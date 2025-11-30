import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useInfoDialogHook from '../infoDialogAPIHook';
import { toast } from 'react-toastify';

// Mock dependencies
vi.mock('@/core/constant/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));
vi.mock('react-toastify');
vi.mock('@/core/helper/translationUtility', () => ({
  getTranslation: vi.fn((key: string) => `Translated: ${key}`),
}));

const mockToast = vi.mocked(toast);

describe('useInfoDialogHook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
          gcTime: 0,
        },
      },
    });
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  it('should fetch data successfully when commandName is provided', async () => {
    const mockData = {
      Status: true,
      Message: [],
      Data: {
        commandName: 'test-command',
        executionDate: '2023-01-01',
        executionTime: '10:30:00',
        executionStatus: 'Success'
      }
    };

    // Import and mock axios inside the test to avoid hoisting issues
    const axiosInstance = await import('@/core/constant/axios');
    const mockGet = vi.mocked(axiosInstance.default.get);
    mockGet.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useInfoDialogHook('test-command'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.infoDialogData).toEqual(mockData.Data);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockGet).toHaveBeenCalledWith('/SystemLogs/GetExecutionLog?commandName=test-command');
  });

  it('should not fetch data when commandName is empty', async () => {
    const { result } = renderHook(() => useInfoDialogHook(''), {
      wrapper: createWrapper(),
    });

    // For disabled queries, we should check that data is undefined and no API call is made
    expect(result.current.infoDialogData).toBeUndefined();
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    
    // Give React Query time to settle
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify that no API call was made
    const axiosInstance = await import('@/core/constant/axios');
    const mockGet = vi.mocked(axiosInstance.default.get);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should not fetch data when commandName is null', async () => {
    const { result } = renderHook(() => useInfoDialogHook(null as any), {
      wrapper: createWrapper(),
    });

    // For disabled queries, we should check that data is undefined and no API call is made
    expect(result.current.infoDialogData).toBeUndefined();
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    
    // Give React Query time to settle
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify that no API call was made
    const axiosInstance = await import('@/core/constant/axios');
    const mockGet = vi.mocked(axiosInstance.default.get);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should handle API error response and show toast messages', async () => {
    const mockData = {
      Status: false,
      Message: ['Error message 1', 'Error message 2'],
      Data: null
    };

    const axiosInstance = await import('@/core/constant/axios');
    const mockGet = vi.mocked(axiosInstance.default.get);
    mockGet.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useInfoDialogHook('test-command'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.infoDialogData).toBeNull();
    expect(mockToast.error).toHaveBeenCalledTimes(2);
    expect(mockToast.error).toHaveBeenCalledWith('Translated: Error message 1', {
      toastId: 'Error message 1'
    });
    expect(mockToast.error).toHaveBeenCalledWith('Translated: Error message 2', {
      toastId: 'Error message 2'
    });
  });

  it('should handle API error response with empty message array', async () => {
    const mockData = {
      Status: false,
      Message: [],
      Data: null
    };

    const axiosInstance = await import('@/core/constant/axios');
    const mockGet = vi.mocked(axiosInstance.default.get);
    mockGet.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useInfoDialogHook('test-command'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.infoDialogData).toBeNull();
    expect(mockToast.error).not.toHaveBeenCalled();
  });

  it('should handle API error response with null message', async () => {
    const mockData = {
      Status: false,
      Message: null,
      Data: null
    };

    const axiosInstance = await import('@/core/constant/axios');
    const mockGet = vi.mocked(axiosInstance.default.get);
    mockGet.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useInfoDialogHook('test-command'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.infoDialogData).toBeNull();
    expect(mockToast.error).not.toHaveBeenCalled();
  });

  it('should handle successful response without showing toast', async () => {
    const mockData = {
      Status: true,
      Message: ['Success message'],
      Data: {
        commandName: 'test-command',
        executionDate: '2023-01-01',
        executionTime: '10:30:00',
        executionStatus: 'Success'
      }
    };

    const axiosInstance = await import('@/core/constant/axios');
    const mockGet = vi.mocked(axiosInstance.default.get);
    mockGet.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useInfoDialogHook('test-command'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.infoDialogData).toEqual(mockData.Data);
    expect(mockToast.error).not.toHaveBeenCalled();
  });

  it('should handle network error', async () => {
    const networkError = new Error('Network Error');
    
    const axiosInstance = await import('@/core/constant/axios');
    const mockGet = vi.mocked(axiosInstance.default.get);
    mockGet.mockRejectedValue(networkError);

    const { result } = renderHook(() => useInfoDialogHook('test-command'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(networkError);
    expect(result.current.infoDialogData).toBeUndefined();
  });

  it('should handle undefined data response', async () => {
    const mockData = {
      Status: true,
      Message: [],
      Data: undefined
    };

    const axiosInstance = await import('@/core/constant/axios');
    const mockGet = vi.mocked(axiosInstance.default.get);
    mockGet.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useInfoDialogHook('test-command'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.infoDialogData).toBeUndefined();
    expect(mockToast.error).not.toHaveBeenCalled();
  });

  it('should handle null data response', async () => {
    const mockData = {
      Status: true,
      Message: [],
      Data: null
    };

    const axiosInstance = await import('@/core/constant/axios');
    const mockGet = vi.mocked(axiosInstance.default.get);
    mockGet.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useInfoDialogHook('test-command'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.infoDialogData).toBeNull();
    expect(mockToast.error).not.toHaveBeenCalled();
  });
});
