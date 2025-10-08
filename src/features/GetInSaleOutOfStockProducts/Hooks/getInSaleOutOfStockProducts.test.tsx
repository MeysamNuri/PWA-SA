import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useGetInSaleOutOfStockProductsHooks from './getInSaleOutOfStockProducts';
import type { OutOfStockProductResponse } from '../types';

// Mock the API hook dependency
let mockData: any;
let mockIsPending: boolean;
let mockIsError: boolean;

vi.mock('./APIHooks/useGetInSaleOutOfStockProducts', () => ({
  default: () => ({
    data: mockData,
    isPending: mockIsPending,
    isError: mockIsError,
  }),
}));

const mockProducts: OutOfStockProductResponse[] = [
  {
    productName: 'MacBook Pro',
    needQuantity: 10,
    exist: 2,
    salesQuantity: 5,
  },
  {
    productName: 'iPhone 13',
    needQuantity: 5,
    exist: 3,
    salesQuantity: 8,
  },
  {
    productName: 'USB Cable',
    needQuantity: 20,
    exist: 0,
    salesQuantity: 15,
  },
].map(p => ({
  ...p,
  mainGroupCode: '', mainGroupName: '', sideGroupCode: '', sideGroupName: '',
  productCode: '', productCode2: '', purchasePrice: 0, formattedPurchasePrice: '',
  purchasePriceUOM: '', salesPrice: 0, formattedSalesPrice: '', salesPriceUOM: '',
  averageSalesUnitPrice: 0, formattedAverageSalesUnitPrice: '', averageSalesUnitPriceUOM: '',
  salesUnitPrice: 0, formattedSalesUnitPrice: '', salesUnitPriceUOM: '', salesAmount: 0,
  formattedSalesAmount: '', salesAmountUOM: '', salesRevenue: 0, formattedSalesRevenue: '',
  salesRevenueUOM: ''
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useGetInSaleOutOfStockProductsHooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockData = { Data: [] };
    mockIsPending = false;
    mockIsError = false;
  });

  // --- Initial State and State Management ---
  it('should return initial state and handle expandedCard state correctly', () => {
    const { result } = renderHook(() => useGetInSaleOutOfStockProductsHooks(), { wrapper: createWrapper() });

    expect(result.current.expandedCard).toBe(0);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);

    act(() => {
      result.current.setExpandedCard(5);
    });
    expect(result.current.expandedCard).toBe(5);

    act(() => {
      result.current.setExpandedCard(null);
    });
    expect(result.current.expandedCard).toBe(null);
  });

  // --- Core Logic: Calculations and Sorting ---
  it('should calculate totals and sort products correctly based on fetched data', () => {
    mockData = { Data: mockProducts };
    const { result } = renderHook(() => useGetInSaleOutOfStockProductsHooks(), { wrapper: createWrapper() });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.totalNeed).toBe(35); // 10 + 5 + 20
    expect(result.current.totalExist).toBe(5); // 2 + 3 + 0
    expect(result.current.totalSales).toBe(28); // 5 + 8 + 15
    
    // Check sorting
    expect(result.current.sortedProducts[0].productName).toBe('USB Cable');
    expect(result.current.sortedProducts[1].productName).toBe('MacBook Pro');
    expect(result.current.sortedProducts[2].productName).toBe('iPhone 13');
  });

  // --- Edge Cases: Loading, Errors, and Invalid Data ---
  it('should reflect API hook state and handle various data types gracefully', () => {
    // Loading state
    mockIsPending = true;
    const { result, rerender } = renderHook(() => useGetInSaleOutOfStockProductsHooks(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);

    // Error state
    mockIsPending = false;
    mockIsError = true;
    rerender();
    expect(result.current.isError).toBe(true);

    // Empty data array
    mockData = { Data: [] };
    mockIsError = false;
    rerender();
    expect(result.current.products).toEqual([]);
    expect(result.current.totalNeed).toBe(0);
    
    // Non-array data
    mockData = { Data: 'not an array' };
    rerender();
    expect(result.current.products).toEqual([]);
    expect(result.current.totalNeed).toBe(0);
    
    // Undefined data
    mockData = undefined;
    rerender();
    expect(result.current.products).toEqual([]);
    expect(result.current.totalNeed).toBe(0);
  });

});