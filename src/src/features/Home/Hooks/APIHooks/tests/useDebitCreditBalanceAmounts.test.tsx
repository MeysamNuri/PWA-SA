import {
    describe,
    it,
    expect,
    vi,
    afterEach,
} from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useDebitCreditBalanceAmountsHooks from '../useDebitCreditBalanceAmounts';
import type { IResponse } from '@/core/types/responseModel'
import type { DebitCreditBalanceData } from '../../../types';

// Mock the external dependencies
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

vi.mock('@/core/helper/translationUtility', () => ({
    getTranslation: vi.fn((key) => `Translated: ${key}`),
}));

// Mock the axios instance directly to control the network response
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

describe('useDebitCreditBalanceAmountsHooks', () => {

    it('should fetch and return debit credit balance successfully', async () => {
        // Define the mock data for a successful API call
        const mockDebitCreditData: DebitCreditBalanceData = {
            totalCreditAmount: 1000,
            formattedTotalCreditAmount: "1000.00",
            totalCreditAmountUOM: "1000.00",
            totalDebitAmount: 1000,
            formattedTotalDebitAmount: "1000.00",
            totalDebitAmountUOM: "1000.00",
            balanceAmount: 1000,
            formattedBalanceAmount: "1000.00",
            balanceAmountUOM: "1000.00",
        };

        // Define the full mock response object
        const mockSuccessResponse: IResponse<DebitCreditBalanceData> = {
            Status: true,
            Message: ['Success'],
            Data: mockDebitCreditData,
            RequestUrl: '/AccountingReports/GetDebitCreditBalanceAmounts',
            HttpStatusCode: 200,
        };

        // Mock the `get` method of axiosInstance to return the successful response
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockSuccessResponse });

        // Render the hook with the wrapper
        const { result } = renderHook(() => useDebitCreditBalanceAmountsHooks(), {
            wrapper: createWrapper(),
        });

        // Initially, the hook should be in a pending state
        expect(result.current.isPending).toBe(true);
        expect(result.current.data).toBeUndefined();

        // Wait for the query to finish fetching
        await waitFor(() => expect(result.current.isPending).toBe(false));

        // After a successful fetch, the data should be present, and no error
        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.data?.Status).toBe(true);

    });

    it('should call toast.error and getTranslation when API status is false', async () => {
        // Define the mock response for a failed API call with messages
        const mockFailureResponse: IResponse<DebitCreditBalanceData> = {
            Status: false,
            Message: ['ERROR_BALANCE_FETCH', 'ERROR_DATA_MISSING'],
            Data: 
                {
                    totalCreditAmount: 0,
                    formattedTotalCreditAmount: "0.00",
                    totalCreditAmountUOM: "0.00",
                    totalDebitAmount: 0,
                    formattedTotalDebitAmount: "0.00",
                    totalDebitAmountUOM: "0.00",
                    balanceAmount: 0,
                    formattedBalanceAmount: "0.00",
                    balanceAmountUOM: "0.00",
                },
            RequestUrl: '/AccountingReports/GetDebitCreditBalanceAmounts',
            HttpStatusCode: 200,
        };

        // Mock the `get` method of axiosInstance to return the failed response
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockFailureResponse });

        const { result } = renderHook(() => useDebitCreditBalanceAmountsHooks(), {
            wrapper: createWrapper(),
        });

        // Wait for the query to finish and the toast logic to run
        await waitFor(() => expect(result.current.isPending).toBe(false));

        // The getTranslation function should be called for each message
        expect(vi.mocked(getTranslation)).toHaveBeenCalledTimes(2);
        expect(vi.mocked(getTranslation)).toHaveBeenCalledWith('ERROR_BALANCE_FETCH');
        expect(vi.mocked(getTranslation)).toHaveBeenCalledWith('ERROR_DATA_MISSING');

        // The toast.error function should be called for each translated message
        expect(vi.mocked(toast.error)).toHaveBeenCalledTimes(2);
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Translated: ERROR_BALANCE_FETCH');
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Translated: ERROR_DATA_MISSING');
    });

    it('should handle network errors correctly', async () => {
        const mockErrorMessage = 'Network Error';

        // Mock the `get` method of axiosInstance directly to throw an error
        vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error(mockErrorMessage));

        const { result } = renderHook(() => useDebitCreditBalanceAmountsHooks(), {
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
