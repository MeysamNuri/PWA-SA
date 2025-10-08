import {
    describe,
    it,
    expect,
    vi,
    afterEach,
} from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useTopMostSoldProduct from '../useTopMostSoldProduct';
import type { IResponse } from '@/core/models/responseModel'
import type { ITopSellingProducts } from '../../../types';

// Mock the external dependencies to isolate the hook's logic
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

vi.mock('@/core/helper/translationUtility', () => ({
    getTranslation: vi.fn((key) => `Translated: ${key}`),
}));

// Mock the axios instance to control the network response
vi.mock('@/core/constant/axios', () => {
    return {
        default: {
            get: vi.fn(),
        },
    };
});

// Import the mocked axios instance for direct access in tests
import axiosInstance from '@/core/constant/axios';
import { getTranslation } from '@/core/helper/translationUtility';
import { toast } from 'react-toastify';

// Create a wrapper component with a new QueryClient instance for each test run
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                // Disable retries to speed up tests
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

// Clear all mocks after each test to ensure a clean state
afterEach(() => {
    vi.clearAllMocks();
});

describe('useTopMostSoldProduct', () => {

    it('should fetch and return top most sold products successfully', async () => {
        // Define the mock data for a successful API call
        const mockProductsData: ITopSellingProducts = {
            topNMostProductsByPrices: [
                {
                    productCode: "PROD001",
                    productName: "PROD001",
                    soldQuantity: 100,
                    soldPrice: 100,
                    productAvailableQuantity: 100,
                    mainGroupName: "PROD001",
                    sideGroupName: "PROD001",
                    formattedSoldPrice: "PROD001",
                    soldPriceUOM: "PROD001",
                    id: "PROD001",
                }
            ],
            topNMostProductsByQuantity: [
                {
                    productCode: "PROD001",
                    productName: "PROD001",
                    soldQuantity: 100,
                    soldPrice: 100,
                    productAvailableQuantity: 100,
                    mainGroupName: "PROD001",
                    sideGroupName: "PROD001",
                    formattedSoldPrice: "PROD001",
                    soldPriceUOM: "PROD001",
                    id: "PROD001",
                }
            ],

        };
        const daysType = '90';

        // Define the full mock response object
        const mockSuccessResponse: IResponse<ITopSellingProducts> = {
            Status: true,
            Message: ['Success'],
            Data: mockProductsData,
            RequestUrl: `/SoldProducts/GetTopNMostSoldProductsReport?daysType=${daysType}&topN=10`,
            HttpStatusCode: 200,
        };

        // Mock the `get` method of axiosInstance to return the successful response
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockSuccessResponse });

        // Render the hook with the wrapper and a specific daysType
        const { result } = renderHook(() => useTopMostSoldProduct(daysType), {
            wrapper: createWrapper(),
        });

        // Initially, the hook should be in a pending state
        expect(result.current.isPending).toBe(true);
        expect(result.current.data).toBeUndefined();
        expect(vi.mocked(axiosInstance.get)).toHaveBeenCalledWith(`/SoldProducts/GetTopNMostSoldProductsReport?daysType=${daysType}&topN=10`);

        // Wait for the query to finish fetching
        await waitFor(() => expect(result.current.isPending).toBe(false));

        // After a successful fetch, the data should be present, and no error
        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.data?.Status).toBe(true);

    });

    it('should call toast.error and getTranslation when API status is false', async () => {
        // Define the mock response for a failed API call with messages
        const mockFailureResponse: IResponse<ITopSellingProducts> = {
            Status: false,
            Message: ['ERROR_FETCH_PRODUCTS', 'INVALID_PARAMS'],
            Data: {
                topNMostProductsByPrices: [],
                topNMostProductsByQuantity: []
            },
            RequestUrl: '/SoldProducts/GetTopNMostSoldProductsReport?daysType=invalid&topN=10',
            HttpStatusCode: 200,
        };
        const daysType = 'invalid';

        // Mock the `get` method of axiosInstance to return the failed response
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockFailureResponse });

        const { result } = renderHook(() => useTopMostSoldProduct(daysType), {
            wrapper: createWrapper(),
        });

        // Wait for the query to finish and the toast logic to run
        await waitFor(() => expect(result.current.isPending).toBe(false));

        // The getTranslation function should be called for each message
        expect(vi.mocked(getTranslation)).toHaveBeenCalledTimes(2);
        expect(vi.mocked(getTranslation)).toHaveBeenCalledWith('ERROR_FETCH_PRODUCTS');
        expect(vi.mocked(getTranslation)).toHaveBeenCalledWith('INVALID_PARAMS');

        // The toast.error function should be called for each translated message
        expect(vi.mocked(toast.error)).toHaveBeenCalledTimes(2);
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Translated: ERROR_FETCH_PRODUCTS');
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Translated: INVALID_PARAMS');
    });

    it('should handle network errors correctly', async () => {
        const mockErrorMessage = 'Network Error';
        const daysType = '30';

        // Mock the `get` method of axiosInstance directly to throw an error
        vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error(mockErrorMessage));

        const { result } = renderHook(() => useTopMostSoldProduct(daysType), {
            wrapper: createWrapper(),
        });

        // Wait for the query to error
        await waitFor(() => expect(result.current.isError).toBe(true));

        // After an error, isError should be true and the error object should be present
        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe(mockErrorMessage);
    });
});
