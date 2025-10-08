import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTopNMostRevenuableProducts } from './useTopNMostRevenuableProducts';
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';
import type { IResponse } from '@/core/models/responseModel';
import type { ITopNMostRevenuableProducts } from '../../types';

// Mock axiosInstance to control API responses
vi.mock('@/core/constant/axios');
const mockAxiosGet = vi.mocked(axiosInstance.get);

// Mock react-toastify to check if toast messages are called
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

// Mock translation utility
vi.mock('@/core/helper/translationUtility', () => ({
    getTranslation: (key: string) => `Translated: ${key}`,
}));

const createTestWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

// Define mock data for a successful response
const mockTopSellingProductsData: ITopNMostRevenuableProducts = {
    productName: 'Laptop',
    productCode: 'LAP001',
    salesQuantity: 100,
    salesRevenuAmount: 5000000,
    formattedSalesRevenuAmount: '5000000',
    salesRevenuAmountUOM: 'تومان',
    revenuPercentage: 50,
    purchaseAmount: 4000000,
    formattedPurchaseAmount: '4000000',
    purchaseAmountUOM: 'تومان',
    saleAmount: 1000000,
    formattedSaleAmount: '1000000',
    saleAmountUOM: 'تومان',
};

// Define mock data for an empty response (or when Status is false)
const emptyTopSellingProductsData: ITopNMostRevenuableProducts = {
    productName: '',
    productCode: '',
    salesQuantity: 0,
    salesRevenuAmount: 0,
    formattedSalesRevenuAmount: '',
    salesRevenuAmountUOM: '',
    revenuPercentage: 0,
    purchaseAmount: 0,
    formattedPurchaseAmount: '',
    purchaseAmountUOM: '',
    saleAmount: 0,
    formattedSaleAmount: '',
    saleAmountUOM: '',
};

describe('useTopNMostSoldProducts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch and return top selling products successfully', async () => {
        // Mock a successful API response
        const mockSuccessResponse: IResponse<ITopNMostRevenuableProducts> = {
            Status: true,
            Data: mockTopSellingProductsData,
            Message: [],
            HttpStatusCode: 200,
            RequestUrl: ''
        };
        mockAxiosGet.mockResolvedValue({ data: mockSuccessResponse });

        const daysType = '30';
        const { result } = renderHook(() => useTopNMostRevenuableProducts(daysType), { wrapper: createTestWrapper() });

        // Assert initial state
        expect(result.current.isPending).toBe(true);

        // Wait for the query to be successful
        await waitFor(() => expect(result.current.isPending).toBe(false));

        // Assert final state
        expect(mockAxiosGet).toHaveBeenCalledWith(`/SoldProducts/GetTopNMostRevenuableProducts?daysType=${daysType}&topN=10`);
        expect(result.current.data).toEqual(mockSuccessResponse);
        expect(result.current.isError).toBe(false);
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('should handle API success with status=false and display toast messages', async () => {
        // Mock an API response with Status: false
        const mockFailureResponse: IResponse<ITopNMostRevenuableProducts> = {
            Status: false,
            Data: emptyTopSellingProductsData, // Use an empty data object to match type
            Message: ['ERROR_CODE_TOP_SELL_1', 'ERROR_CODE_TOP_SELL_2'],
            HttpStatusCode: 200,
            RequestUrl: ''
        };
        mockAxiosGet.mockResolvedValue({ data: mockFailureResponse });

        const daysType = '7';
        const { result } = renderHook(() => useTopNMostRevenuableProducts(daysType), { wrapper: createTestWrapper() });

        await waitFor(() => expect(result.current.isPending).toBe(false));

        // Assertions for a logical API failure
        expect(result.current.data).toEqual(mockFailureResponse);
        expect(result.current.isError).toBe(false);

        // Check if toast.error was called for each message
        expect(toast.error).toHaveBeenCalledTimes(2);
        expect(toast.error).toHaveBeenCalledWith('Translated: ERROR_CODE_TOP_SELL_1');
        expect(toast.error).toHaveBeenCalledWith('Translated: ERROR_CODE_TOP_SELL_2');
    });

    it('should handle API request failure and set isError to true without toasting', async () => {
        // Mock a network error
        const mockError = new Error('Network error occurred.');
        mockAxiosGet.mockRejectedValue(mockError);

        const daysType = '15';
        const { result } = renderHook(() => useTopNMostRevenuableProducts(daysType), { wrapper: createTestWrapper() });

        // Wait for the hook to catch the error
        await waitFor(() => expect(result.current.isError).toBe(true));

        // Assertions for a network/request failure
        expect(result.current.isPending).toBe(false);
        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toEqual(mockError);
        expect(toast.error).not.toHaveBeenCalled();
    });
});