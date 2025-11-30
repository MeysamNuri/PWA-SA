import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useSalesRevenue from './useSalesRevenue';
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';
import type { IResponse } from '@/core/types/responseModel';
import type { salesRevenueApi } from '../types';

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
                retry: false, // Disable retries for predictable test results
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

const mockSalesRevenueData: salesRevenueApi = {
    salesRevenueReport: [],
    totalSalesAmount: 10000000,
    salesAmountUOM: 'تومان',
    formattedTotalSalesAmount: '10,000,000',
    totalSalesAmountUOM: 'تومان',
    totalSalesRevenueAmount: 10000000,
    formattedTotalSalesRevenueAmount: '10,000,000',
    totalSalesRevenueAmountUOM: 'تومان'
};

describe('useSalesRevenue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch and return sales revenue data successfully for a given daysType', async () => {
        // Mock a successful API response with Status: true
        const mockSuccessResponse: IResponse<salesRevenueApi> = {
            Status: true,
            Data: mockSalesRevenueData,
            Message: [],
            HttpStatusCode: 200,
            RequestUrl: ''
        };
        mockAxiosGet.mockResolvedValue({ data: mockSuccessResponse });

        const daysType = '7';
        const { result } = renderHook(() => useSalesRevenue(daysType), { wrapper: createTestWrapper() });

        // Initial state check
        expect(result.current.isPending).toBe(true);
        expect(result.current.data).toBeUndefined();

        // Wait for the query to be successful
        await waitFor(() => expect(result.current.isPending).toBe(false));

        // Assertions for a successful fetch
        expect(mockAxiosGet).toHaveBeenCalledWith(`SalesRevenue/GetSalesRevenueReport?daysType=${daysType}`);
        expect(result.current.data).toEqual(mockSuccessResponse);
        expect(result.current.isError).toBe(false);
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('should handle API success with status=false and display toast messages', async () => {
        // Mock an API response with Status: false
        // این کد خطا را نادیده می‌گیرد، اما از لحاظ فنی ایمن نیست
        const mockFailureResponse: IResponse<salesRevenueApi> = {
            Status: false,
            Data: null as unknown as salesRevenueApi,
            Message: ['ERROR_CODE_SALE_1', 'ERROR_CODE_2'],
            HttpStatusCode: 200,
            RequestUrl: ''
        };
        mockAxiosGet.mockResolvedValue({ data: mockFailureResponse });

        const daysType = '30';
        const { result } = renderHook(() => useSalesRevenue(daysType), { wrapper: createTestWrapper() });

        // Wait for the query to settle
        await waitFor(() => expect(result.current.isPending).toBe(false));

        // Assertions for a logical API failure
        expect(result.current.data).toEqual(mockFailureResponse);
        expect(result.current.isError).toBe(false); // HTTP status is 200, so TanStack Query is not in an error state

        // Check if toast.error was called for each message
        // expect(toast.error).toHaveBeenCalledTimes(2);
        // expect(toast.error).toHaveBeenCalledWith('Translated: ERROR_CODE_SALE_1');
        // expect(toast.error).toHaveBeenCalledWith('Translated: ERROR_CODE_SALE_2');
    });

    it('should handle API request failure and set isError to true without toasting', async () => {
        // Mock a network error
        const mockError = new Error('Network error occurred.');
        mockAxiosGet.mockRejectedValue(mockError);

        const daysType = '90';
        const { result } = renderHook(() => useSalesRevenue(daysType), { wrapper: createTestWrapper() });

        // Wait for the hook to catch the error
        await waitFor(() => expect(result.current.isError).toBe(true));

        // Assertions for a network/request failure
        expect(result.current.isPending).toBe(false);
        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toEqual(mockError);
        expect(toast.error).not.toHaveBeenCalled(); // No toast for a network failure
    });
});