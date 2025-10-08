// useLoginByOTPHooks.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useLoginByOTPHooks from '../useLoginByOTP';
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { getTranslation } from '@/core/helper/translationUtility';

// Mock all external dependencies to isolate the hook's logic.
// We use simple vi.mock calls here, and we will define the mock behaviors later.
vi.mock('@/core/constant/axios');
vi.mock('react-toastify');
vi.mock('react-router');
vi.mock('@/core/helper/translationUtility');

// Mock localStorage to verify that the token is set.
const localStorageMock = {
    setItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('useLoginByOTPHooks', () => {
    let queryClient: QueryClient;

    // Set up a new QueryClient instance and clear mocks before each test.
    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false, // Disable retries for tests
                },
            },
        });

        // Reset all mocks before each test to ensure a clean state.
        vi.clearAllMocks();

        // Now, we define the mock behavior for each function.
        // This happens inside the beforeEach block, so it is not hoisted.
        // FIX: The toast functions must return a value (Id), not void.
        // We now return a simple number to satisfy the TypeScript type.
        vi.mocked(toast.success).mockImplementation(() => 1);
        vi.mocked(toast.error).mockImplementation(() => 1);
        vi.mocked(useNavigate).mockReturnValue(vi.fn());
        vi.mocked(getTranslation).mockImplementation((key: string) => `Translated: ${key}`);
    });

    // A helper component to wrap the hook in the necessary provider.
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    it('handles a successful login correctly', async () => {
        // Set the return value for the mocked post function.
        vi.mocked(axiosInstance.post).mockResolvedValueOnce({
            data: {
                Status: true,
                Message: null,
                Data: { token: 'mock-auth-token' },
            },
        });

        // Render the hook
        const { result } = renderHook(() => useLoginByOTPHooks(), { wrapper });

        // Call the mutation function with mock payload
        const mockPayload = {
            phoneNumber: "09197547969",
            code: "1234"
        };
        result.current.handleLoginByOTP(mockPayload);

        // Wait for the mutation to finish by checking the status.
        await waitFor(() => expect(result.current.status).toBe('success'));

        // Assert that the correct actions were taken. Use the mocked functions directly.
        expect(vi.mocked(toast.success)).toHaveBeenCalledWith('ورود انجام شد');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', 'mock-auth-token');
        expect(vi.mocked(useNavigate)()).toHaveBeenCalledWith('/home');
    });

    it('handles a failed login correctly', async () => {
        // Set the return value for the mocked post function for failure.
        vi.mocked(axiosInstance.post).mockResolvedValueOnce({
            data: {
                Status: false,
                Message: ['ERROR_MESSAGE_1'],
                Data: null,
            },
        });

        // Render the hook
        const { result } = renderHook(() => useLoginByOTPHooks(), { wrapper });

        // Call the mutation function
        result.current.handleLoginByOTP({
            phoneNumber: "09197547969",
            code: "1234"
        });

        // Wait for the mutation to finish
        await waitFor(() => expect(result.current.status).toBe('success'));

        // Assert that the correct error messages were toasted.
        expect(vi.mocked(toast.error)).toHaveBeenCalledTimes(1);
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Translated: ERROR_MESSAGE_1');
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
        expect(vi.mocked(useNavigate)()).not.toHaveBeenCalled();
    });
});
