// useSendOTPHooks.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useSendOTPHooks from '../useSendOTP';
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';

// Mock all external dependencies to isolate the hook's logic.
vi.mock('@/core/constant/axios');
vi.mock('react-toastify');
vi.mock('@/core/helper/translationUtility');

describe('useSendOTPHooks', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                mutations: {
                    retry: false, // Disable retries for tests
                },
            },
        });

        vi.clearAllMocks();

        // Define the mock behavior for each function inside the beforeEach block
        // to avoid hoisting issues and ensure a clean state for each test.
        // The toast functions must return a value (Id), not void, to satisfy TypeScript.
        vi.mocked(toast.success).mockImplementation(() => 1);
        vi.mocked(toast.error).mockImplementation(() => 1);
        vi.mocked(getTranslation).mockImplementation((key: string) => `Translated: ${key}`);
    });

    // A helper component to wrap the hook in the necessary provider.
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    it('handles a successful OTP send correctly', async () => {
        // Mock a successful API response
        vi.mocked(axiosInstance.post).mockResolvedValueOnce({
            data: {
                Status: true,
                Message: null,
                Data: { transactionId: '12345' },
            },
        });

        // Render the hook
        const { result } = renderHook(() => useSendOTPHooks(), { wrapper });

        // Call the mutation function
        const mockPayload = { phoneNumber: "09197547969" };
        result.current.mutate(mockPayload);

        // Wait for the mutation to finish by checking the status.
        await waitFor(() => expect(result.current.status).toBe('success'));
        await waitFor(() => expect(result.current.isPending).toBe(false));

        // Assert that the correct actions were taken.
        expect(vi.mocked(toast.success)).toHaveBeenCalledWith('کد تأیید با موفقیت ارسال شد');
        expect(vi.mocked(toast.error)).not.toHaveBeenCalled();
    });

    it('handles a failed OTP send due to a business logic error', async () => {
        // Mock a failed API response with a specific error message
        vi.mocked(axiosInstance.post).mockResolvedValueOnce({
            data: {
                Status: false,
                Message: ['PHONE_NUMBER_NOT_FOUND'],
                Data: null,
            },
        });

        // Render the hook
        const { result } = renderHook(() => useSendOTPHooks(), { wrapper });

        // Call the mutation function
        const mockPayload = { phoneNumber: "09197547969" };
        result.current.mutate(mockPayload);

        // Wait for the mutation to finish
        await waitFor(() => expect(result.current.status).toBe('success'));
        await waitFor(() => expect(result.current.isPending).toBe(false));

        // Assert that the correct error messages were toasted.
        expect(vi.mocked(toast.error)).toHaveBeenCalledTimes(1);
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Translated: PHONE_NUMBER_NOT_FOUND');
        expect(vi.mocked(toast.success)).not.toHaveBeenCalled();
    });

    it('handles a server-side error gracefully', async () => {
        // Mock a network or server error by rejecting the promise
        vi.mocked(axiosInstance.post).mockRejectedValueOnce(new Error('Network error'));

        // Render the hook
        const { result } = renderHook(() => useSendOTPHooks(), { wrapper });

        // Call the mutation function
        const mockPayload = { phoneNumber: "09197547969" };
        result.current.mutate(mockPayload);

        // Wait for the mutation to finish with an error state.
        await waitFor(() => expect(result.current.isPending).toBe(false));
        await waitFor(() => expect(result.current.status).toBe('error'));

        // Assert that the error toast was called (if an onError handler existed).
        // The current hook doesn't have an onError callback, so no toast should be called.
        expect(vi.mocked(toast.error)).not.toHaveBeenCalled();
        expect(vi.mocked(toast.success)).not.toHaveBeenCalled();
    });
});
