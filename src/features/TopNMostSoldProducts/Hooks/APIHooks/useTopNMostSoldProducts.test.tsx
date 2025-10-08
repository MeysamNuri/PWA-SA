import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTopNMostSoldProducts } from './useTopNMostSoldProducts';
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';
import type { IResponse } from '@/core/models/responseModel';
import type { TopSellingProductsApi } from '../../types';

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
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Define mock data for a successful response
const mockTopSellingProductsData: TopSellingProductsApi = {
  productCode: 'LAP001',
  productName: 'Laptop',
  soldQuantity: 100,
  soldPrice: 5000000,
  productAvailableQuantity: 50,
  mainGroupName: 'Electronics',
  sideGroupName: 'Computers',
  formattedSoldPrice: '5,000,000',
  soldPriceUOM: 'تومان',
  id: '1'
};

// Define mock data for an empty response (or when Status is false)
const emptyTopSellingProductsData: TopSellingProductsApi = {
  productCode: '',
  productName: '',
  soldQuantity: 0,
  soldPrice: 0,
  productAvailableQuantity: 0,
  mainGroupName: '',
  sideGroupName: '',
  formattedSoldPrice: '',
  soldPriceUOM: '',
  id: ''
};

describe('useTopNMostSoldProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and return top selling products successfully', async () => {
    // Mock a successful API response
    const mockSuccessResponse: IResponse<TopSellingProductsApi> = {
      Status: true,
      Data: mockTopSellingProductsData,
      Message: [],
      HttpStatusCode: 200,
      RequestUrl: ''
    };
    mockAxiosGet.mockResolvedValue({ data: mockSuccessResponse });

    const daysType = '30';
    const { result } = renderHook(() => useTopNMostSoldProducts(daysType), { wrapper: createTestWrapper() });

    // Assert initial state
    expect(result.current.isPending).toBe(true);

    // Wait for the query to be successful
    await waitFor(() => expect(result.current.isPending).toBe(false));

    // Assert final state
    expect(mockAxiosGet).toHaveBeenCalledWith(`/SoldProducts/GetTopNMostSoldProductsReport?daysType=${daysType}&topN=10`);
    expect(result.current.data).toEqual(mockSuccessResponse);
    expect(result.current.isError).toBe(false);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should handle API success with status=false and display toast messages', async () => {
    // Mock an API response with Status: false
    const mockFailureResponse: IResponse<TopSellingProductsApi> = {
      Status: false,
      Data: emptyTopSellingProductsData, // Use an empty data object to match type
      Message: ['ERROR_CODE_TOP_SELL_1', 'ERROR_CODE_TOP_SELL_2'],
      HttpStatusCode: 200,
      RequestUrl: ''
    };
    mockAxiosGet.mockResolvedValue({ data: mockFailureResponse });

    const daysType = '7';
    const { result } = renderHook(() => useTopNMostSoldProducts(daysType), { wrapper: createTestWrapper() });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    // Assertions for a logical API failure
    expect(result.current.data).toEqual(mockFailureResponse);
    expect(result.current.isError).toBe(false);

    // Check if toast.error was called for each message
    expect(toast.error).toHaveBeenCalledTimes(2);
    expect(toast.error).toHaveBeenCalledWith('Translated: ERROR_CODE_TOP_SELL_1');
    expect(toast.error).toHaveBeenCalledWith('Translated: ERROR_CODE_TOP_SELL_2');
  });

  it('should handle API request failure and set isError to true without toasting', async () => {
    // Mock a network error
    const mockError = new Error('Network error occurred.');
    mockAxiosGet.mockRejectedValue(mockError);

    const daysType = '15';
    const { result } = renderHook(() => useTopNMostSoldProducts(daysType), { wrapper: createTestWrapper() });

    // Wait for the hook to catch the error
    await waitFor(() => expect(result.current.isError).toBe(true));

    // Assertions for a network/request failure
    expect(result.current.isPending).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
    expect(toast.error).not.toHaveBeenCalled();
  });
});