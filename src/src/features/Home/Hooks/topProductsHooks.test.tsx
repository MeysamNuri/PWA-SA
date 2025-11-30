import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useTopProductsData from './topProductsHooks';
import useTopMostSoldProduct from './APIHooks/useTopMostSoldProduct';
import useTopMostRevenuableProduct from './APIHooks/useTopMostRevenuableProduct';

import type { ITopNMostRevenuableProduct, ITopNMostSoldProduct } from '../types';

// Mock external dependencies
const mockUseNavigate = vi.fn();
const mockSetInfoDetails = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => mockUseNavigate,
}));

// This simplified mock setup lets Vitest handle the default export
vi.mock('./APIHooks/useTopMostSoldProduct');
vi.mock('./APIHooks/useTopMostRevenuableProduct');

vi.mock('@/core/zustandStore', () => ({
  useInfoModalStore: vi.fn((selector) => {
    const state = { setInfoDetails: mockSetInfoDetails };
    return selector(state);
  }),
}));

// Create a new QueryClient instance for tests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Create a wrapper component to provide the QueryClientProvider context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useTopProductsData', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock behavior for a pending state
    (useTopMostSoldProduct as any).mockReturnValue({
      data: undefined,
      isPending: true,
      error: null,
      isError: false,
    });
    (useTopMostRevenuableProduct as any).mockReturnValue({
      data: undefined,
      isPending: true,
      error: null,
      isError: false,
    });
  });

  // Test Case 1: Verifies the initial state of the hook.
  it('should return initial state values correctly', () => {
    const { result } = renderHook(() => useTopProductsData(), { wrapper });

    expect(result.current.selectedChip).toBe('Last7Days');
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.open).toBe(false);
  });

  // Test Case 2: Verifies that selectedChip updates when handleDaysChange is called.
  it('should change the selected chip on handleDaysChange', () => {
    const { result } = renderHook(() => useTopProductsData(), { wrapper });

    act(() => {
      result.current.handleDaysChange(null, 'Last30Days');
    });

    expect(result.current.selectedChip).toBe('Last30Days');
  });

  // Test Case 3: Verifies the navigation function for sold products.
  it('should navigate to topSellingProducts on handleSoldProductClick', () => {
    const { result } = renderHook(() => useTopProductsData(), { wrapper });

    act(() => {
      result.current.handleSoldProductClick();
    });

    expect(mockUseNavigate).toHaveBeenCalledWith('/topSellingProducts',{state:{date:"Last7Days"}});
  });

  // Test Case 4: Verifies the navigation function for revenuable products.
  it('should navigate to topRevenuableProducts on handleRevenuableProductClick', () => {
    const { result } = renderHook(() => useTopProductsData(), { wrapper });

    act(() => {
      result.current.handleRevenuableProductClick();
    });

    expect(mockUseNavigate).toHaveBeenCalledWith('/topRevenuableProducts',{state:{date:"Last7Days"}});
  });

  // Test Case 5: Verifies that the loading state is correct when either API hook is pending.
  it('should set loading to true when either API hook is pending', () => {
    (useTopMostSoldProduct as any).mockReturnValue({
      data: undefined,
      isPending: false,
      error: null,
      isError: false,
    });
    (useTopMostRevenuableProduct as any).mockReturnValue({
      data: undefined,
      isPending: true,
      error: null,
      isError: false,
    });

    const { result } = renderHook(() => useTopProductsData(), { wrapper });
    expect(result.current.loading).toBe(true);
  });

  // Test Case 6: Verifies that the error state is correct when an API hook returns an error.
  it('should set error when either API hook returns an error', () => {
    const mockError = new Error('API error');
    (useTopMostSoldProduct as any).mockReturnValue({
      data: undefined,
      isPending: false,
      error: mockError,
      isError: true,
    });

    const { result } = renderHook(() => useTopProductsData(), { wrapper });
    expect(result.current.error).toBe(mockError);
  });

  // Test Case 7: Verifies that data is correctly extracted and returned from API responses.
  it('should correctly extract and return data from API responses', () => {
    const mockSoldData = {
      RequestUrl: '',
      Message: [''] as string[],
      Status: 200,
      HttpStatusCode: 200,
      Data: {
        topNMostProductsByPrices: [{
          productCode: "test",
          productName: "test",
          soldQuantity: 10,
          soldPrice: 10,
          productAvailableQuantity: 10,
          mainGroupName: "test",
          sideGroupName: "test",
          formattedSoldPrice: "test",
          soldPriceUOM: "test",
          id: "test"
        }] as ITopNMostSoldProduct[],
        topNMostProductsByQuantity: [{
          productCode: "test",
          productName: "test",
          soldQuantity: 10,
          soldPrice: 10,
          productAvailableQuantity: 10,
          mainGroupName: "test",
          sideGroupName: "test",
          formattedSoldPrice: "test",
          soldPriceUOM: "test",
          id: "test"
        }] as ITopNMostSoldProduct[],
      },
    };
    const mockRevenuableData = {
      RequestUrl: '',
      Message: [''] as string[],
      Status: 200,
      HttpStatusCode: 200,
      Data: {
        topNMostRevenuableProducts: [{
          productName: "test",
          productCode: "test",
          salesQuantity: 10,
          salesRevenuAmount: 10,
          formattedSalesRevenuAmount: "test",
          salesRevenuAmountUOM: "test",
          revenuPercentage: 10,
          purchaseAmount: 10,
          formattedPurchaseAmount: "test",
          purchaseAmountUOM: "test",
          saleAmount: 10,
          formattedSaleAmount: "test",
          saleAmountUOM: "test",
        }] as ITopNMostRevenuableProduct[],
        topNMostRevenuableProductsByRevenuPercentage: [{
          productName: "test",
          productCode: "test",
          salesQuantity: 10,
          salesRevenuAmount: 10,
          formattedSalesRevenuAmount: "test",
          salesRevenuAmountUOM: "test",
          revenuPercentage: 10,
          purchaseAmount: 10,
          formattedPurchaseAmount: "test",
          purchaseAmountUOM: "test",
          saleAmount: 10,
          formattedSaleAmount: "test",
          saleAmountUOM: "test",
        }] as ITopNMostRevenuableProduct[],
      },
    };

    (useTopMostSoldProduct as any).mockReturnValue({
      data: mockSoldData, // Set data to the mock object
      isPending: false,
      error: null,
      isError: false,
    });
    (useTopMostRevenuableProduct as any).mockReturnValue({
      data: mockRevenuableData, // Set data to the mock object
      isPending: false,
      error: null,
      isError: false,
    });

    const { result } = renderHook(() => useTopProductsData(), { wrapper });

    expect(result.current?.topSoldByPrice).toEqual(mockSoldData.Data.topNMostProductsByPrices[0]);
    expect(result.current?.topSoldByQuantity).toEqual(mockSoldData.Data.topNMostProductsByQuantity[0]);
    expect(result.current?.topRevenuableByAmount).toEqual(mockRevenuableData.Data.topNMostRevenuableProducts[0]);
    expect(result.current?.topRevenuableByPercent).toEqual(mockRevenuableData.Data.topNMostRevenuableProductsByRevenuPercentage[0]);
  });

  // Test Case 8: Verifies handleClickOpen function
  it('should call setInfoDetails and set open to true on handleClickOpen', () => {
    const { result } = renderHook(() => useTopProductsData(), { wrapper });
    const mockInfo = { path: '/some-path', title: 'Some Title' };

    act(() => {
      result.current.handleClickOpen(mockInfo);
    });

    expect(mockSetInfoDetails).toHaveBeenCalledWith(mockInfo);
    expect(result.current.open).toBe(true);
  });

  // Test Case 9: Verifies handleClose function
  it('should set open to false on handleClose', () => {
    const { result } = renderHook(() => useTopProductsData(), { wrapper });

    // First, open the modal
    act(() => {
      result.current.handleClickOpen({ path: '', title: '' });
    });

    expect(result.current.open).toBe(true);

    // Then, close it
    act(() => {
      result.current.handleClose();
    });

    expect(result.current.open).toBe(false);
  });
});
