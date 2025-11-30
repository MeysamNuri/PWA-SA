import {
    describe,
    it,
    expect,
    vi,
    afterEach,
} from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useCurrencyRates from '../useCurrencyRates';
import type { IResponse } from '@/core/types/responseModel'
import type { ExchangeRateItem } from '../../../types';

// Mock the external dependencies
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

vi.mock('@/core/helper/translationUtility', () => ({
    getTranslation: vi.fn((key) => `Translated: ${key}`),
}));

// Mock the axios instance directly. This is a cleaner approach
// as we can control the network response without mocking the entire module.
vi.mock('@/core/constant/axios', () => {
    return {
        // We mock the `get` method of the axios instance.
        default: {
            get: vi.fn(),
        },
    };
});

// Import the mocked axios instance
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

afterEach(() => {
    vi.clearAllMocks();
});

describe('useCurrencyRates', () => {

    it('should fetch and return currency rates successfully', async () => {
        // Define the mock response for a successful API call
        const mockSuccessResponse: IResponse<ExchangeRateItem[]> = {
            Status: true,
            Message: ['Success'],
            Data: [
                {
                    title: "USD",
                    name: "USD",
                    price: "USD",
                    rateOfChange: "USD",
                    category: "USD",
                    highestRate: "USD",
                    lowestRate: "USD",
                    sourceCreated: "USD",
                },
                {
                    title: "EUR",
                    name: "EUR",
                    price: "EUR",
                    rateOfChange: "EUR",
                    category: "EUR",
                    highestRate: "EUR",
                    lowestRate: "EUR",
                    sourceCreated: "EUR",
                }
            ],
            RequestUrl: '/ExchangeRateData/GetExchangeRate',
            HttpStatusCode: 200,
        };

        // Now we can mock the `get` method of axiosInstance directly
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockSuccessResponse });

        // Render the hook with the wrapper
        const { result } = renderHook(() => useCurrencyRates(), {
            wrapper: createWrapper(),
        });

        // Initially, the hook should be in a pending state
        expect(result.current.isPending).toBe(true);

        // Wait for the query to finish fetching
        await waitFor(() => expect(result.current.isPending).toBe(false));

        // After a successful fetch, the data should be present, and no error
        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.data?.Status).toBe(true);
        expect(result.current.data?.Data).toHaveLength(2);
        // expect(result.current.data?.Data?.[0].Name).toBe('USD');
    });

    it('should call toast.error and getTranslation when API status is false', async () => {
        // Define the mock response for a failed API call with messages
        const mockFailureResponse: IResponse<ExchangeRateItem[]> = {
            Status: false,
            Message: ['ERROR_RATE_FETCH', 'ERROR_RATES_EMPTY'],
            Data: [],
            RequestUrl: '/ExchangeRateData/GetExchangeRate',
            HttpStatusCode: 200,
        };

        // Mock the `get` method of axiosInstance directly
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockFailureResponse });

        const { result } = renderHook(() => useCurrencyRates(), {
            wrapper: createWrapper(),
        });

        // Wait for the query to finish and the toast logic to run
        await waitFor(() => expect(result.current.isPending).toBe(false));

        // The getTranslation function should be called for each message
        expect(vi.mocked(getTranslation)).toHaveBeenCalledTimes(2);
        expect(vi.mocked(getTranslation)).toHaveBeenCalledWith('ERROR_RATE_FETCH');
        expect(vi.mocked(getTranslation)).toHaveBeenCalledWith('ERROR_RATES_EMPTY');

        // The toast.error function should be called for each translated message
        expect(vi.mocked(toast.error)).toHaveBeenCalledTimes(2);
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Translated: ERROR_RATE_FETCH');
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Translated: ERROR_RATES_EMPTY');
    });

    it('should handle network errors correctly', async () => {
        const mockErrorMessage = 'Network Error';

        // Mock the `get` method of axiosInstance directly to throw an error
        vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error(mockErrorMessage));

        const { result } = renderHook(() => useCurrencyRates(), {
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
