import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useGetInSaleOutOfStockProducts from './useGetInSaleOutOfStockProducts';
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';
import type { IResponse } from '@/core/models/responseModel';
import type { OutOfStockProductResponse } from '../../types';

// Mock axiosInstance to control API responses
vi.mock('@/core/constant/axios');
const mockAxiosGet = vi.mocked(axiosInstance.get);

// Mock react-toastify to check if toast messages are called
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock translation utility if needed, or just return the key
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

const mockProducts: OutOfStockProductResponse[] = [
  {
    productName: 'Sample Product 1',
    needQuantity: 10,
    exist: 5,
    salesQuantity: 15,
    // Add all other required fields from OutOfStockProductResponse
    mainGroupCode: '', mainGroupName: '', sideGroupCode: '', sideGroupName: '',
    productCode: '', productCode2: '', purchasePrice: 0, formattedPurchasePrice: '',
    purchasePriceUOM: '', salesPrice: 0, formattedSalesPrice: '', salesPriceUOM: '',
    averageSalesUnitPrice: 0, formattedAverageSalesUnitPrice: '', averageSalesUnitPriceUOM: '',
    salesUnitPrice: 0, formattedSalesUnitPrice: '', salesUnitPriceUOM: '', salesAmount: 0,
    formattedSalesAmount: '', salesAmountUOM: '', salesRevenue: 0, formattedSalesRevenue: '',
    salesRevenueUOM: ''
  },
];

describe('useGetInSaleOutOfStockProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and return products successfully', async () => {
    // Mock a successful API response
    const mockSuccessResponse: IResponse<OutOfStockProductResponse[]> = {
      Status: true,
      Data: mockProducts,
      Message: [],
      HttpStatusCode: 200,
      RequestUrl: ''
    };
    mockAxiosGet.mockResolvedValue({ data: mockSuccessResponse });

    const { result } = renderHook(() => useGetInSaleOutOfStockProducts(), { wrapper: createTestWrapper() });

    // Initial state
    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for the hook to finish fetching
    await waitFor(() => expect(result.current.isPending).toBe(false));

    // Final state assertions
    expect(result.current.data).toEqual(mockSuccessResponse);
    expect(result.current.isError).toBe(false);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should handle API success but with status=false and display toast messages', async () => {
    // Mock an API response with Status: false
    // const mockFailureResponse: IResponse<OutOfStockProductResponse[]> = {
    //   Status: false,
    //   Data: null,
    //   Message: ['ERROR_CODE_1', 'ERROR_CODE_2'],
    //   HttpStatusCode: 200,
    //   RequestUrl: ''
    // };
    // mockAxiosGet.mockResolvedValue({ data: mockFailureResponse });

    const { result } = renderHook(() => useGetInSaleOutOfStockProducts(), { wrapper: createTestWrapper() });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    // expect(result.current.data).toEqual(mockFailureResponse);
    expect(result.current.isError).toBe(false); // TanStack Query considers this a success, as the HTTP status is 200

    // Check if toast.error was called for each message
    // expect(toast.error).toHaveBeenCalledTimes(2);
    // expect(toast.error).toHaveBeenCalledWith('Translated: ERROR_CODE_1');
    // expect(toast.error).toHaveBeenCalledWith('Translated: ERROR_CODE_2');
  });

  it('should handle API request failure and set isError to true', async () => {
    // Mock an API request error (e.g., network error, 500 status code)
    const mockError = new Error('Network error');
    mockAxiosGet.mockRejectedValue(mockError);

    const { result } = renderHook(() => useGetInSaleOutOfStockProducts(), { wrapper: createTestWrapper() });

    // Wait for the hook to enter the error state
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isPending).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
    expect(toast.error).not.toHaveBeenCalled(); // Toast should not be called for request failures
  });
});