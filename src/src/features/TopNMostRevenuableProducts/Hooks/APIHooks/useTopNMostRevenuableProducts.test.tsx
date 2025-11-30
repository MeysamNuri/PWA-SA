import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTopNMostRevenuableProducts } from './useTopNMostRevenuableProducts';
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';

// --- Mock Dependencies ---

// 1. Mock axiosInstance to prevent actual network requests
vi.mock('@/core/constant/axios');
const mockedAxiosGet = vi.mocked(axiosInstance.get);

// 2. Mock the react-toastify package
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));
const mockedToastError = vi.mocked(toast.error);

// 3. Mock the translation utility function
vi.mock('@/core/helper/translationUtility', () => ({
  getTranslation: vi.fn((key) => `Translated: ${key}`),
}));

// Create a wrapper component with a QueryClientProvider
// This is necessary to provide the query client context to the hook.
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Disable retries in tests to speed up test execution
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// --- Test Suite ---
describe('useTopNMostRevenuableProducts', () => {
  // Clear all mocks before each test to ensure a clean state
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test Case 1: Successful data fetch
  it('should fetch and return data successfully', async () => {
    // Mock a successful API response with Status: true
    const mockSuccessResponse = {
      data: {
        Status: true,
        Message: [],
        Result: { /* Mock your product data here */ },
      },
    };
    mockedAxiosGet.mockResolvedValue(mockSuccessResponse);

    // Render the hook with the mocked daysType and the QueryClient wrapper
    const { result } = renderHook(() => useTopNMostRevenuableProducts('30days'), {
      wrapper: createWrapper(),
    });

    // Initial state check before the fetch completes
    expect(result.current.isPending).toBe(true);
    expect(result.current.isError).toBe(false);

    // Wait for the query to finish and settle
    await waitFor(() => expect(result.current.isPending).toBe(false));

    // Assert the final state and data
    expect(result.current.data?.Status).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    // Verify that the toast message was NOT called
    expect(mockedToastError).not.toHaveBeenCalled();
  });

  // Test Case 2: API returns data with Status: false
  it('should call toast.error for each message when Status is false', async () => {
    // Mock a response where the API call is successful but the internal status is false
    const mockErrorResponse = {
      data: {
        Status: false,
        Message: ['Error message 1', 'Error message 2'],
        Result: null,
      },
    };
    mockedAxiosGet.mockResolvedValue(mockErrorResponse);

    // Render the hook
    const { result } = renderHook(() => useTopNMostRevenuableProducts('30days'), {
      wrapper: createWrapper(),
    });

    // Wait for the query to finish
    await waitFor(() => expect(result.current.isPending).toBe(false));

    // Assert that the data status is correctly false
    expect(result.current.data?.Status).toBe(false);

    // Assert that toast.error was called for each message
    expect(mockedToastError).toHaveBeenCalledTimes(2);
    expect(mockedToastError).toHaveBeenCalledWith('Translated: Error message 1', { toastId: 'Error message 1' });
    expect(mockedToastError).toHaveBeenCalledWith('Translated: Error message 2', { toastId: 'Error message 2' });
  });

  // Test Case 3: Failed network request (e.g., 404, 500)
  it('should handle API errors correctly', async () => {
    // Mock the API call to reject with an error
    const mockAxiosError = new Error('Network Error');
    mockedAxiosGet.mockRejectedValue(mockAxiosError);

    // Render the hook
    const { result } = renderHook(() => useTopNMostRevenuableProducts('30days'), {
      wrapper: createWrapper(),
    });

    // Wait for the query to fail
    await waitFor(() => expect(result.current.isError).toBe(true));

    // Assert the final state
    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(mockAxiosError);
    // The toast.error should NOT be called in this case, as the useEffect
    // dependency is `data`, and a network error results in `data` being undefined.
    expect(mockedToastError).not.toHaveBeenCalled();
  });
});
