import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useTopNMostSoldProductsHook from './topNMostSold';
import { useTopNMostSoldProducts } from './APIHooks/useTopNMostSoldProducts';
import { useLocation } from 'react-router';
import { DateFilterType } from "@/core/types/dateFilterTypes";

// Mock the useLocation hook
vi.mock('react-router', () => ({
  useLocation: vi.fn(),
}));

// Mock the useTopNMostSoldProducts API hook
vi.mock('./APIHooks/useTopNMostSoldProducts', () => ({
  useTopNMostSoldProducts: vi.fn(),
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

describe('useTopNMostSoldProductsHook', () => {
  // Before each test, reset mocks to ensure a clean slate
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock for useLocation
    (vi.mocked(useLocation)).mockReturnValue({
      state: {}, // No initial state
      key: '',
      pathname: '/',
      search: '',
      hash: '',
    });

    // Default mock for useTopNMostSoldProducts
    (vi.mocked(useTopNMostSoldProducts)).mockReturnValue({
      data: {
        RequestUrl: '/api/test',
        Data: {
          topNMostProductsByPrices: [
            { id: "1", productCode: "P001", productName: "Product 1", formattedSoldPrice: "100.00", soldQuantity: 10, soldPrice: 100, productAvailableQuantity: 5, mainGroupName: "Main", sideGroupName: "Side", soldPriceUOM: "USD" },
            { id: "2", productCode: "P002", productName: "Product 2", formattedSoldPrice: "50.00", soldQuantity: 20, soldPrice: 50, productAvailableQuantity: 10, mainGroupName: "Main", sideGroupName: "Side", soldPriceUOM: "USD" },
          ],
          topNMostProductsByQuantity: [
            { id: "3", productCode: "P003", productName: "Product 3", formattedSoldPrice: "20.00", soldQuantity: 30, soldPrice: 20, productAvailableQuantity: 15, mainGroupName: "Main", sideGroupName: "Side", soldPriceUOM: "USD" },
            { id: "4", productCode: "P004", productName: "Product 4", formattedSoldPrice: "10.00", soldQuantity: 40, soldPrice: 10, productAvailableQuantity: 20, mainGroupName: "Main", sideGroupName: "Side", soldPriceUOM: "USD" },
          ],
        },
        Message: [],
        Status: true,
        HttpStatusCode: 200,
      },
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it('should initialize with default values and fetch data', () => {
    const { result } = renderHook(() => useTopNMostSoldProductsHook(), { wrapper: createTestWrapper() });

    // Check initial state
    expect(result.current.selectedChip).toBe(DateFilterType.Last7Days.toString());
    expect(result.current.filterByPrice).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);

    // Check if useTopNMostSoldProducts was called with the default chip
    expect(useTopNMostSoldProducts).toHaveBeenCalledWith(DateFilterType.Last7Days.toString());

    // Check calculated totals based on default (filterByPrice = true)
    expect(result.current.topSellingProducts).toEqual([
      { id: "1", productCode: "P001", productName: "Product 1", formattedSoldPrice: "100.00", soldQuantity: 10, soldPrice: 100, productAvailableQuantity: 5, mainGroupName: "Main", sideGroupName: "Side", soldPriceUOM: "USD" },
      { id: "2", productCode: "P002", productName: "Product 2", formattedSoldPrice: "50.00", soldQuantity: 20, soldPrice: 50, productAvailableQuantity: 10, mainGroupName: "Main", sideGroupName: "Side", soldPriceUOM: "USD" },
    ]);
    expect(result.current.totalPrice).toBe(150); // 100 + 50
    expect(result.current.totalQuantity).toBe(30); // 10 + 20
  });

  it('should initialize with state from useLocation', () => {
    // Mock useLocation to return specific state
    (vi.mocked(useLocation)).mockReturnValue({
      state: {
        date: DateFilterType.Yesterday,
        filterByPrice: false,
      },
      key: '',
      pathname: '/',
      search: '',
      hash: '',
    });

    const { result } = renderHook(() => useTopNMostSoldProductsHook(), { wrapper: createTestWrapper() });

    // Check if initial state reflects useLocation's state
    expect(result.current.selectedChip).toBe(DateFilterType.Yesterday.toString());
    expect(result.current.filterByPrice).toBe(false);

    // Check if useTopNMostSoldProducts was called with the initial chip from location
    expect(useTopNMostSoldProducts).toHaveBeenCalledWith(DateFilterType.Yesterday.toString());

    // Check calculated totals based on initial (filterByPrice = false)
    expect(result.current.topSellingProducts).toEqual([
      { id: "3", productCode: "P003", productName: "Product 3", formattedSoldPrice: "20.00", soldQuantity: 30, soldPrice: 20, productAvailableQuantity: 15, mainGroupName: "Main", sideGroupName: "Side", soldPriceUOM: "USD" },
      { id: "4", productCode: "P004", productName: "Product 4", formattedSoldPrice: "10.00", soldQuantity: 40, soldPrice: 10, productAvailableQuantity: 20, mainGroupName: "Main", sideGroupName: "Side", soldPriceUOM: "USD" },
    ]);
    expect(result.current.totalPrice).toBe(30); // 20 + 10
    expect(result.current.totalQuantity).toBe(70); // 30 + 40
  });

  it('should update selectedChip when handleChipClick is called', () => {
    const { result } = renderHook(() => useTopNMostSoldProductsHook(), { wrapper: createTestWrapper() });

    // Simulate clicking a chip
    act(() => {
      result.current.handleChipClick(DateFilterType.Last30Days);
    });

    // Check if the selected chip has updated
    expect(result.current.selectedChip).toBe(DateFilterType.Last30Days.toString());
    // Verify that useTopNMostSoldProducts is called again with the new chip value
    expect(useTopNMostSoldProducts).toHaveBeenCalledWith(DateFilterType.Last30Days.toString());
  });

  it('should update filterByPrice when handleFilterChange is called', () => {
    const { result } = renderHook(() => useTopNMostSoldProductsHook(), { wrapper: createTestWrapper() });

    // Simulate changing the filter
    act(() => {
      result.current.handleFilterChange(false);
    });

    // Check if the filter has updated
    expect(result.current.filterByPrice).toBe(false);

    // Verify that the topSellingProducts and totals update based on the new filter
    expect(result.current.topSellingProducts).toEqual([
      { id: "3", productCode: "P003", productName: "Product 3", formattedSoldPrice: "20.00", soldQuantity: 30, soldPrice: 20, productAvailableQuantity: 15, mainGroupName: "Main", sideGroupName: "Side", soldPriceUOM: "USD" },
      { id: "4", productCode: "P004", productName: "Product 4", formattedSoldPrice: "10.00", soldQuantity: 40, soldPrice: 10, productAvailableQuantity: 20, mainGroupName: "Main", sideGroupName: "Side", soldPriceUOM: "USD" },
    ]);
    expect(result.current.totalPrice).toBe(30); // 20 + 10
    expect(result.current.totalQuantity).toBe(70); // 30 + 40
  });

  it('should set error message when isError is true', () => {
    // Mock useTopNMostSoldProducts to return an error state
    (vi.mocked(useTopNMostSoldProducts)).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      error: new Error('API Error'),
    });

    const { result } = renderHook(() => useTopNMostSoldProductsHook(), { wrapper: createTestWrapper() });

    // Check if the error message is present
    expect(result.current.error).toBe("خطا در دریافت اطلاعات کالاهای پرفروش");
    expect(result.current.loading).toBe(false);
    expect(result.current.topSellingProducts).toEqual([]); // Should be empty on error
  });

  it('should show loading state when isPending is true', () => {
    // Mock useTopNMostSoldProducts to return a pending state
    (vi.mocked(useTopNMostSoldProducts)).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useTopNMostSoldProductsHook(), { wrapper: createTestWrapper() });

    // Check if the loading state is true
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.topSellingProducts).toEqual([]); // Should be empty while loading
  });
});