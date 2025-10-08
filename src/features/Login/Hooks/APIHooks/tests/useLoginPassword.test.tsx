// useLoginPasswordHooks.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useLoginPasswordHooks from '../useLoginPassword';
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { getTranslation } from '@/core/helper/translationUtility';

// Mock all external dependencies to isolate the hook's logic.
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

describe('useLoginPasswordHooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries for tests
        },
        mutations: {
          retry: false,
        },
      },
    });

    vi.clearAllMocks();

    // Now, we define the mock behavior for each function.
    // This happens inside the beforeEach block, so it is not hoisted.
    // The toast functions must return a value (Id), not void.
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
    // Mock a successful API response
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: {
        Status: true,
        Message: null,
        Data: { token: 'mock-auth-token' },
      },
    });

    // Render the hook
    const { result } = renderHook(() => useLoginPasswordHooks(), { wrapper });

    // Call the mutation function
    const mockPayload = { phoneNumber: '1234567890', password: 'password123' };
    result.current.mutate(mockPayload);

    // Wait for the mutation to finish by checking the status.
    await waitFor(() => expect(result.current.isPending).toBe(false));
    await waitFor(() => expect(result.current.data?.Status).toBe(true));

    // Assert that the correct actions were taken.
    expect(vi.mocked(toast.success)).toHaveBeenCalledWith('ورود انجام شد');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', 'mock-auth-token');
    expect(vi.mocked(useNavigate)()).toHaveBeenCalledWith('/home');
  });

  it('handles a failed login due to a business logic error', async () => {
    // Mock a failed API response with a specific error message
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: {
        Status: false,
        Message: ['INVALID_CREDENTIALS'],
        Data: null,
      },
    });

    // Render the hook
    const { result } = renderHook(() => useLoginPasswordHooks(), { wrapper });

    // Call the mutation function
    const mockPayload = { phoneNumber: '1234567890', password: 'wrong-password' };
    result.current.mutate(mockPayload);

    // Wait for the mutation to finish
    await waitFor(() => expect(result.current.isPending).toBe(false));
    await waitFor(() => expect(result.current.data?.Status).toBe(false));

    // Assert that the correct error messages were toasted.
    expect(vi.mocked(toast.error)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Translated: INVALID_CREDENTIALS');
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(vi.mocked(useNavigate)()).not.toHaveBeenCalled();
  });

  it('handles a server-side error gracefully', async () => {
    // Mock a network or server error by rejecting the promise
    vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('Network error'));

    // Render the hook
    const { result } = renderHook(() => useLoginPasswordHooks(), { wrapper });

    // Call the mutation function
    const mockPayload = { phoneNumber: '1234567890', password: 'password123' };
    result.current.mutate(mockPayload);

    // Wait for the mutation to finish with an error.
    await waitFor(() => expect(result.current.isPending).toBe(false));

    // Assert that the error toast was called.
    expect(vi.mocked(toast.error)).toHaveBeenCalledWith('مشکلی از سمت سرور رخ داده است');
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(vi.mocked(useNavigate)()).not.toHaveBeenCalled();
  });
});
