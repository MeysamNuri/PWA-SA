import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import React from 'react';
import useFetchTopData from '../useFetchTopData';
import axiosInstance from '@/core/constant/axios';

// Mock dependencies
vi.mock('@/core/constant/axios');
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));
vi.mock('@/core/helper/translationUtility', () => ({
  getTranslation: vi.fn((key) => key),
}));

// Mock axios instance
const mockAxiosInstance = vi.mocked(axiosInstance);

describe('useFetchTopData', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  // Helper function to render hook with QueryClient
  const renderHookWithQueryClient = (options: any) => {
    const wrapper = ({ children }: { children: React.ReactNode }) => 
      React.createElement(QueryClientProvider, { client: queryClient }, children);

    return renderHook(() => useFetchTopData(options), { wrapper });
  };

  it('should fetch data successfully', async () => {
    const mockData = {
      Status: true,
      Data: [
        { id: 1, name: 'Item 1', value: 100 },
        { id: 2, name: 'Item 2', value: 200 },
      ],
      Message: [],
      RequestUrl: '/test',
      HttpStatusCode: 200,
    };

    (mockAxiosInstance.get as any).mockResolvedValue({ data: mockData });

    const options = {
      queryKey: ['test-data'],
      apiPath: (daysType: string) => `/api/test?days=${daysType}`,
      selector: (data: any) => data.map((item: any) => ({ ...item, processed: true })),
      daysType: 'Last7Days',
    };

    const { result } = renderHookWithQueryClient(options);

    // Initially loading
    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.data).toEqual([
      { id: 1, name: 'Item 1', value: 100, processed: true },
      { id: 2, name: 'Item 2', value: 200, processed: true },
    ]);
    expect(result.current.isError).toBe(false);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/test?days=Last7Days');
  });

  it('should handle API errors', async () => {
    const mockError = new Error('Network error');
    (mockAxiosInstance.get as any).mockRejectedValue(mockError);

    const options = {
      queryKey: ['test-error'],
      apiPath: (daysType: string) => `/api/test?days=${daysType}`,
      selector: (data: any) => data,
      daysType: 'Last30Days',
    };

    const { result } = renderHookWithQueryClient(options);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBeUndefined();
  });

  it('should show toast error when Status is false', async () => {
    const mockData = {
      Status: false,
      Data: null,
      Message: ['Error message 1', 'Error message 2'],
      RequestUrl: '/test',
      HttpStatusCode: 400,
    };

    (mockAxiosInstance.get as any).mockResolvedValue({ data: mockData });

    const options = {
      queryKey: ['test-error-status'],
      apiPath: (daysType: string) => `/api/test?days=${daysType}`,
      selector: (data: any) => data,
      daysType: 'Yesterday',
    };

    const { result } = renderHookWithQueryClient(options);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(toast.error).toHaveBeenCalledTimes(2);
    expect(toast.error).toHaveBeenCalledWith('Error message 1');
    expect(toast.error).toHaveBeenCalledWith('Error message 2');
    expect(result.current.data).toBeUndefined();
  });

  it('should handle empty data response', async () => {
    const mockData = {
      Status: true,
      Data: null,
      Message: [],
      RequestUrl: '/test',
      HttpStatusCode: 200,
    };

    (mockAxiosInstance.get as any).mockResolvedValue({ data: mockData });

    const options = {
      queryKey: ['test-empty'],
      apiPath: (daysType: string) => `/api/test?days=${daysType}`,
      selector: (data: any) => data,
      daysType: 'Today',
    };

    const { result } = renderHookWithQueryClient(options);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle undefined data response', async () => {
    const mockData = {
      Status: true,
      Data: undefined,
      Message: [],
      RequestUrl: '/test',
      HttpStatusCode: 200,
    };

    (mockAxiosInstance.get as any).mockResolvedValue({ data: mockData });

    const options = {
      queryKey: ['test-undefined'],
      apiPath: (daysType: string) => `/api/test?days=${daysType}`,
      selector: (data: any) => data,
      daysType: 'Last7Days',
    };

    const { result } = renderHookWithQueryClient(options);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should call apiPath with correct daysType parameter', async () => {
    const mockData = {
      Status: true,
      Data: [],
      Message: [],
      RequestUrl: '/test',
      HttpStatusCode: 200,
    };

    (mockAxiosInstance.get as any).mockResolvedValue({ data: mockData });

    const options = {
      queryKey: ['test-params'],
      apiPath: (daysType: string) => `/api/custom?period=${daysType}`,
      selector: (data: any) => data,
      daysType: 'Last90Days',
    };

    const { result } = renderHookWithQueryClient(options);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/custom?period=Last90Days');
  });

  it('should apply selector function to data', async () => {
    const mockData = {
      Status: true,
      Data: [
        { id: 1, name: 'Product A', price: 100 },
        { id: 2, name: 'Product B', price: 200 },
      ],
      Message: [],
      RequestUrl: '/test',
      HttpStatusCode: 200,
    };

    (mockAxiosInstance.get as any).mockResolvedValue({ data: mockData });

    const options = {
      queryKey: ['test-selector'],
      apiPath: (daysType: string) => `/api/products?days=${daysType}`,
      selector: (data: any) => data.map((item: any) => ({
        ...item,
        formattedPrice: `$${item.price}`,
        isExpensive: item.price > 150,
      })),
      daysType: 'Last30Days',
    };

    const { result } = renderHookWithQueryClient(options);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.data).toEqual([
      {
        id: 1,
        name: 'Product A',
        price: 100,
        formattedPrice: '$100',
        isExpensive: false,
      },
      {
        id: 2,
        name: 'Product B',
        price: 200,
        formattedPrice: '$200',
        isExpensive: true,
      },
    ]);
  });

  it('should not show toast when Status is true', async () => {
    const mockData = {
      Status: true,
      Data: [{ id: 1, name: 'Success' }],
      Message: ['This should not show'],
      RequestUrl: '/test',
      HttpStatusCode: 200,
    };

    (mockAxiosInstance.get as any).mockResolvedValue({ data: mockData });

    const options = {
      queryKey: ['test-success'],
      apiPath: (daysType: string) => `/api/test?days=${daysType}`,
      selector: (data: any) => data,
      daysType: 'Last7Days',
    };

    const { result } = renderHookWithQueryClient(options);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(toast.error).not.toHaveBeenCalled();
    expect(result.current.data).toEqual([{ id: 1, name: 'Success' }]);
  });

  it('should handle empty Message array', async () => {
    const mockData = {
      Status: false,
      Data: null,
      Message: [],
      RequestUrl: '/test',
      HttpStatusCode: 400,
    };

    (mockAxiosInstance.get as any).mockResolvedValue({ data: mockData });

    const options = {
      queryKey: ['test-empty-message'],
      apiPath: (daysType: string) => `/api/test?days=${daysType}`,
      selector: (data: any) => data,
      daysType: 'Last7Days',
    };

    const { result } = renderHookWithQueryClient(options);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(toast.error).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it('should handle different queryKey values', async () => {
    const mockData = {
      Status: true,
      Data: [],
      Message: [],
      RequestUrl: '/test',
      HttpStatusCode: 200,
    };

    (mockAxiosInstance.get as any).mockResolvedValue({ data: mockData });

    const options = {
      queryKey: ['custom', 'query', 'key'],
      apiPath: (daysType: string) => `/api/test?days=${daysType}`,
      selector: (data: any) => data,
      daysType: 'Last7Days',
    };

    const { result } = renderHookWithQueryClient(options);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.isError).toBe(false);
  });
});
