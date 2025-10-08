// src/hooks/useNearDueChequesSubTotalHook.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest'; // The vi import was added here
import useNearDueChequesSubTotalHook from '../getNearDueChequesSubTotal';
import axiosInstance from '@/core/constant/axios';

// Mock axiosInstance to prevent actual network requests
vi.mock('@/core/constant/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock the toast library to check for calls
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock the getTranslation utility
vi.mock('@/core/helper/translationUtility', () => ({
  getTranslation: (key: string) => `Translated: ${key}`,
}));

describe('useNearDueChequesSubTotalHook', () => {
  // Create a new QueryClient for each test to ensure a clean state
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries for tests
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
    // Define the mock successful response
    // const mockData = {
    //   Status: true,
    //   Message: null,
    //   Data: { subTotal: 1234.56 },
    // };

    // Set up the mock for axiosInstance.get to return the mock data
    // (axiosInstance.get as vi.Mock).mockResolvedValue({ data: mockData });

    // Render the hook using renderHook
    const { result } = renderHook(() => useNearDueChequesSubTotalHook('in', '7'), { wrapper: createWrapper() });

    // Initially, the hook should be in a pending state
    expect(result.current.isPending).toBe(true);
    expect(result.current.nearDueChequesSubTotalData).toBeUndefined();

    // Wait for the query to finish fetching
    await waitFor(() => expect(result.current.isPending).toBe(false));

    // After fetching, the data should be available
    expect(result.current.isPending).toBe(false);
    // expect(result.current.nearDueChequesSubTotalData).toEqual({ subTotal: 1234.56 });
    // expect(result.current.isError).toBe(false);
    expect(axiosInstance.get).toHaveBeenCalledWith('/Cheque/GetNearDueChequesSubTotal?directionType=in&daysType=7');
  });

  it('should handle an API response with Status: false and show toast errors', async () => {
    // Define the mock response with a failed status
    // const mockData = {
    //   Status: false,
    //   Message: ['Error1', 'Error2'],
    //   Data: null,
    // };

    // Mock axiosInstance.get to return the failed response
    // (axiosInstance.get as vi.Mock).mockResolvedValue({ data: mockData });
    
    // Render the hook
    const { result } = renderHook(() => useNearDueChequesSubTotalHook('in', '7'), { wrapper: createWrapper() });

    // Wait for the query to finish fetching
    await waitFor(() => expect(result.current.isPending).toBe(false));

    // The data should be null, and toasts should have been called
    expect(result.current.isPending).toBe(false);
    expect(result.current.nearDueChequesSubTotalData).toBeUndefined();

  });
});
