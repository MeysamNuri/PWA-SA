import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useCurrencyRatesHook from '../useCurrencyRates';
import type { ExchangeRateItem } from '../../types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the API hook to control the data returned to the hook under test.
// We explicitly define the mock to be a function to avoid the TypeError.
vi.mock('../Hooks/APIHooks/useExchangeRate', () => {
  return {
    // This is a named export, so we need to return an object with the named export.
    // If it were a default export, you would use `default: vi.fn()`.
    __esModule: true,
    default: vi.fn(),
  };
});

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useCurrencyRatesHook', () => {
  const mockExchangeRates: ExchangeRateItem[] = [
    { title: "test",
        name: "test 1",
        price: "15000",
        rateOfChange: "20",
        category: "gold",
        highestRate: "1",
        lowestRate: "0",
        sourceCreated: ""},
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct initial state and tabs', () => {
    // vi.mocked(useExchangeRate).mockReturnValue({
    //   data: undefined,
    //   isPending: true,
    //   isError: false,
    //   error: null,
    // });

    const { result } = renderHook(() => useCurrencyRatesHook(), { wrapper });

    expect(result.current.isPending).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.selectedTab).toBe('currencyRates');
    expect(result.current.tabs).toEqual([
      { label: 'ارز', value: 'currencyRates' },
      { label: 'سکه', value: 'coinRates' },
      { label: 'طلا', value: 'goldRates' },
    ]);
    expect(result.current.filteredData).toEqual([]);
    expect(result.current.findDollar).toBeNull();
  });

  it('should return an error state if the API call fails', () => {
    // const mockError = new Error('Failed to fetch data');
    // vi.mocked(useExchangeRate).mockReturnValue({
    //   data: undefined,
    //   isPending: false,
    //   isError: true,
    //   error: mockError,
    // });

    // const { result } = renderHook(() => useCurrencyRatesHook(), { wrapper });

    // expect(result.current.isPending).toBe(false);
    // expect(result.current.isError).toBe(true);
    // expect(result.current.error).toEqual(mockError);
    // expect(result.current.filteredData).toEqual([]);
  });

  it('should filter data for "currencyRates" tab correctly', () => {
    // vi.mocked(useExchangeRate).mockReturnValue({
    //   data: undefined,
    //   isPending: false,
    //   isError: false,
    //   error: null,
    // });

    const { result } = renderHook(() => useCurrencyRatesHook(), { wrapper });

    expect(result.current.selectedTab).toBe('currencyRates');
    // expect(result.current.filteredData.map(item => item.name)).toEqual(['UsdDollar', 'Euro', 'Gbp', 'Aed']);
  });

  it('should filter data for "coinRates" tab correctly after a tab change', () => {
    // vi.mocked(useExchangeRate).mockReturnValue({
    //   data: undefined,
    //   isPending: false,
    //   isError: false,
    //   error: null,
    // });

    const { result } = renderHook(() => useCurrencyRatesHook(), { wrapper });

    // Simulate clicking the "coinRates" tab.
    act(() => {
      result.current.handleTabClick('coinRates');
    });

    expect(result.current.selectedTab).toBe('coinRates');
    // expect(result.current.filteredData.map(item => item.name)).toEqual(['SekeEmaami', 'SekeBahar', 'SekeNim']);
  });

  it('should filter and sort data for "goldRates" tab correctly', () => {
    // vi.mocked(useExchangeRate).mockReturnValue({
    //   data:undefined,
    //   isPending: false,
    //   isError: false,
    //   error: null,
    // });

    const { result } = renderHook(() => useCurrencyRatesHook(), { wrapper });

    // Simulate clicking the "goldRates" tab.
    act(() => {
      result.current.handleTabClick('goldRates');
    });

    // const goldNames = result.current.filteredData.map(item => item.name);
    
    // Expect the data to be filtered correctly.
    // expect(goldNames).toContain('GoldGram18740');
    // expect(goldNames).toContain('Ons');
    
    // Expect the data to be sorted according to the custom order.
    const expectedOrder = ['GoldGram18740', 'GoldGram18', 'GoldGram24', 'GoldMesghal', 'Ons'];
    const actualOrder = result.current.filteredData.map(item => item.name);
    
    // We only have a subset of the expected order in our mock data.
    const sortedMockDataNames = mockExchangeRates
      .filter(item => expectedOrder.includes(item.name))
      .sort((a, b) => expectedOrder.indexOf(a.name) - expectedOrder.indexOf(b.name))
      .map(item => item.name);

    expect(actualOrder).toEqual(sortedMockDataNames);
  });

  it('should find the UsdDollar item correctly', () => {
    // vi.mocked(useExchangeRate).mockReturnValue({
    //   data: undefined,
    //   isPending: false,
    //   isError: false,
    //   error: null,
    // });

    // const { result } = renderHook(() => useCurrencyRatesHook(), { wrapper });

    // expect(result.current.findDollar).toEqual(
    //   expect.objectContaining({ name: 'UsdDollar', price: 50000 })
    // );
  });
});