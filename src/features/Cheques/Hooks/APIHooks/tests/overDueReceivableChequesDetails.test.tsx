import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';

import type { IResponse } from '@/core/models/responseModel';
import type { IOverDueReceivableRes } from '../../../types';

// The custom hook to be tested
import useOverDueReceivableChequesDetails from '../overDueReceivableChequesDetails';

// --- MOCK DEPENDENCIES ---

// Mock axiosInstance to prevent actual network requests.
vi.mock('@/core/constant/axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

// Mock the react-toastify toast function to check if it's called.
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

// Mock the translation utility to control its output.
vi.mock('@/core/helper/translationUtility', () => ({
    getTranslation: (key: string) => `Translated: ${key}`,
}));

// --- MOCK DATA ---

// Mock a successful API response with a Status of true
const mockSuccessData: IResponse<IOverDueReceivableRes> = {
    Status: true,
    Data: {
        overDueReceivableChequesDetailsDtos: [],
        chequesQuantity: 10000,
        chequesAmount: 10000,
        formattedChequesAmount: "5000",
        chequesAmountUOM: "5000"

    },
    Message: ['error_message_1', 'error_message_2'],
    RequestUrl: '/Cheque/GetOverDueReceivableChequesDetails', // Added missing property
    HttpStatusCode: 200 // Added missing property
};

// Mock an API response with a Status of false, simulating an error from the backend.
const mockErrorData: IResponse<IOverDueReceivableRes> = {
    Status: false,
    Data: {
        overDueReceivableChequesDetailsDtos: [],
        chequesQuantity: 10000,
        chequesAmount: 10000,
        formattedChequesAmount: "5000",
        chequesAmountUOM: "5000"
    },
    Message: ['error_message_1', 'error_message_2'],
    RequestUrl: '/Cheque/GetOverDueReceivableChequesDetails', // Added missing property
    HttpStatusCode: 200 // Added missing property
};

// --- TEST SUITE ---

describe('useOverDueReceivableChequesDetails', () => {
    // Create a new QueryClient for each test to ensure a clean state
    let queryClient: QueryClient;
    beforeEach(() => {
        // Clear all mocks before each test to prevent side effects
        vi.clearAllMocks();
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false, // Disable retries for deterministic testing
                },
            },
        });
    });

    // A helper component to wrap the hook in the necessary provider
    const createWrapper = () => {
        return ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };

    it('should fetch data successfully and return the correct state', async () => {
        // Set up the mock for axiosInstance.get to return the mock data
        (axiosInstance.get as any).mockResolvedValue({ data: mockSuccessData });

        // Render the hook using renderHook
        const { result } = renderHook(() => useOverDueReceivableChequesDetails(), { wrapper: createWrapper() });

        // Initially, the hook should be in a pending state
        expect(result.current.isPending).toBe(true);
        expect(result.current.overDueReceivableChequesData).toBeUndefined();

        // Wait for the query to finish fetching
        await waitFor(() => expect(result.current.isPending).toBe(false));

        // After fetching, the data should be available
        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.overDueReceivableChequesData).toEqual(mockSuccessData.Data);

        // The toast.error function should not have been called for a successful response
        expect(toast.error).not.toHaveBeenCalled();

        // Verify that the correct API endpoint was called
        expect(axiosInstance.get).toHaveBeenCalledWith('/Cheque/GetOverDueReceivableChequesDetails');
    });

    it('should handle an API response with Status: false and show toast errors', async () => {
        // Mock axiosInstance.get to return a failed response
        (axiosInstance.get as any).mockResolvedValue({ data: mockErrorData });

        // Render the hook
        const { result } = renderHook(() => useOverDueReceivableChequesDetails(), { wrapper: createWrapper() });

        // Wait for the query to finish fetching
        await waitFor(() => expect(result.current.isPending).toBe(false));

        // After the hook updates, the data should be null, and toasts should have been called
        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(false); // TanStack Query does not consider a 200 response with a bad status an error
 

        // The toast.error function should have been called for each message
        expect(toast.error).toHaveBeenCalledTimes(2);
        expect(toast.error).toHaveBeenCalledWith('Translated: error_message_1');
        expect(toast.error).toHaveBeenCalledWith('Translated: error_message_2');
    });

    it('should handle a network error and return an error state', async () => {
        const networkError = new Error('Network failed!');

        // Mock axiosInstance.get to reject with a network error
        (axiosInstance.get as any).mockRejectedValue(networkError);

        // Render the hook
        const { result } = renderHook(() => useOverDueReceivableChequesDetails(), { wrapper: createWrapper() });

        // Wait for the query to fail and the error state to be set
        await waitFor(() => expect(result.current.isError).toBe(true));

        // The hook should be in an error state
        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBe(networkError);

        // No data should be present
        expect(result.current.overDueReceivableChequesData).toBeUndefined();

        // No toasts should be called for network errors by the useEffect hook
        expect(toast.error).not.toHaveBeenCalled();
    });
});
