
// useDebitCreditCardHooks.test.tsx
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useDebitCreditCardHooks from './debitCredit';
import type { DebtorCreditorItem, DebitCreditBalanceAmountsItems } from '../types';

// --- Global Mock Variables for API Hook Return Values ---
let mockTopDebtorsData: any;
let mockTopCreditorsData: any;
let mockDebitCreditTotalsData: any;

// Declare simple boolean variables for isPending states
let mockTopDebtorsIsPending: boolean;
let mockTopCreditorsIsPending: boolean;
let mockDebitCreditTotalsIsPending: boolean;

// --- Mocks for API Hooks ---
vi.mock('./APIHooks/useTopDebtors', () => ({
  default: () => ({
    data: mockTopDebtorsData,
    isPending: mockTopDebtorsIsPending,
  }),
}));

vi.mock('./APIHooks/useTopCreditors', () => ({
  default: () => ({
    data: mockTopCreditorsData,
    isPending: mockTopCreditorsIsPending,
  }),
}));

vi.mock('./APIHooks/useDebitCredit', () => ({
  default: () => ({
    data: mockDebitCreditTotalsData,
    isPending: mockDebitCreditTotalsIsPending,
  }),
}));

describe('useDebitCreditCardHooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient();

    // Initialize global mock variables for API data with empty but valid structures
    mockTopDebtorsData = { Data: [] };
    mockTopCreditorsData = { Data: [] };
    mockDebitCreditTotalsData = { 
      totalCreditAmount: 0,
      formattedTotalCreditAmount: '0',
      totalCreditAmountUOM: 'ریال',
      totalDebitAmount: 0,
      formattedTotalDebitAmount: '0',
      totalDebitAmountUOM: 'ریال',
      balanceAmount: 0,
      formattedBalanceAmount: '0'
    };

    // Initialize isPending states to false
    mockTopDebtorsIsPending = false;
    mockTopCreditorsIsPending = false;
    mockDebitCreditTotalsIsPending = false;
  });

  afterEach(() => {
    queryClient.clear();
  });

  // Define a wrapper component for renderHook
  const createWrapper = () => {
    return function Wrapper({ children }: { children: React.ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
  };

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useDebitCreditCardHooks(), { wrapper: createWrapper() });

    expect(result.current.selectedTab).toBe('debtors');
    expect(result.current.expandedCard).toBe(0);
    expect(result.current.list).toEqual([]);
    expect(result.current.debtorsList).toEqual([]);
    expect(result.current.creditorsList).toEqual([]);
    expect(result.current.totals).toEqual({
      totalCreditAmount: 0,
      formattedTotalCreditAmount: '0',
      totalCreditAmountUOM: 'ریال',
      totalDebitAmount: 0,
      formattedTotalDebitAmount: '0',
      totalDebitAmountUOM: 'ریال',
      balanceAmount: 0,
      formattedBalanceAmount: '0'
    });
  });

  it('setSelectedTab should update selectedTab', () => {
    const { result } = renderHook(() => useDebitCreditCardHooks(), { wrapper: createWrapper() });

    expect(result.current.selectedTab).toBe('debtors');

    act(() => {
      result.current.setSelectedTab('creditors');
    });
    expect(result.current.selectedTab).toBe('creditors');

    act(() => {
      result.current.setSelectedTab('debtors');
    });
    expect(result.current.selectedTab).toBe('debtors');
  });

  it('setExpandedCard should update expandedCard', () => {
    const { result } = renderHook(() => useDebitCreditCardHooks(), { wrapper: createWrapper() });

    expect(result.current.expandedCard).toBe(0);

    act(() => {
      result.current.setExpandedCard(5);
    });
    expect(result.current.expandedCard).toBe(5);

    act(() => {
      result.current.setExpandedCard(null);
    });
    expect(result.current.expandedCard).toBe(null);
  });

  it('should return debtors list when selectedTab is debtors', () => {
    const mockDebtorsData: DebtorCreditorItem[] = [
      {
        code: '001',
        name: 'Debtor 1',
        customerCode: 'C001',
        tel: '021-12345678',
        mobile: '09123456789',
        sumBed: 1000000,
        formattedSumBed: '1000000',
        sumBedUOM: 'ریال',
        sumBes: 500000,
        formattedSumBes: '500000',
        sumBesUOM: 'ریال',
        price: 500000,
        formattedPrice: '500,000',
        priceUOM: 'ریال'
      },
      {
        code: '002',
        name: 'Debtor 2',
        customerCode: 'C002',
        tel: '021-87654321',
        mobile: '09876543210',
        sumBed: 2000000,
        formattedSumBed: '2000000',
        sumBedUOM: 'ریال',
        sumBes: 1000000,
        formattedSumBes: '1000000',
        sumBesUOM: 'ریال',
        price: 1000000,
        formattedPrice: '1000000',
        priceUOM: 'ریال'
      }
    ];

    const { result, rerender } = renderHook(() => useDebitCreditCardHooks(), { wrapper: createWrapper() });

    act(() => {
      mockTopDebtorsData = { Data: mockDebtorsData };
      rerender();
    });

    expect(result.current.selectedTab).toBe('debtors');
    expect(result.current.list).toEqual(mockDebtorsData);
    expect(result.current.debtorsList).toEqual(mockDebtorsData);
    expect(result.current.creditorsList).toEqual([]);
  });

  it('should return creditors list when selectedTab is creditors', () => {
    const mockCreditorsData: DebtorCreditorItem[] = [
      {
        code: '003',
        name: 'Creditor 1',
        customerCode: 'C003',
        tel: '021-11111111',
        mobile: '09111111111',
        sumBed: 3000000,
        formattedSumBed: '3000000',
        sumBedUOM: 'ریال',
        sumBes: 1500000,
        formattedSumBes: '1500000',
        sumBesUOM: 'ریال',
        price: 1500000,
        formattedPrice: '1500000',
        priceUOM: 'ریال'
      },
      {
        code: '004',
        name: 'Creditor 2',
        customerCode: 'C004',
        tel: '021-22222222',
        mobile: '09222222222',
        sumBed: 4000000,
        formattedSumBed: '4000000',
        sumBedUOM: 'ریال',
        sumBes: 2000000,
        formattedSumBes: '2000000',
        sumBesUOM: 'ریال',
        price: 2000000,
        formattedPrice: '2000000',
        priceUOM: 'ریال'
      }
    ];

    const { result, rerender } = renderHook(() => useDebitCreditCardHooks(), { wrapper: createWrapper() });

    act(() => {
      mockTopCreditorsData = { Data: mockCreditorsData };
      result.current.setSelectedTab('creditors');
      rerender();
    });

    expect(result.current.selectedTab).toBe('creditors');
    expect(result.current.list).toEqual(mockCreditorsData);
    expect(result.current.debtorsList).toEqual([]);
    expect(result.current.creditorsList).toEqual(mockCreditorsData);
  });

  it('should handle empty or undefined data gracefully', () => {
    const { result, rerender } = renderHook(() => useDebitCreditCardHooks(), { wrapper: createWrapper() });

    act(() => {
      mockTopDebtorsData = { Data: [] };
      mockTopCreditorsData = { Data: [] };
      rerender();
    });

    expect(result.current.list).toEqual([]);
    expect(result.current.debtorsList).toEqual([]);
    expect(result.current.creditorsList).toEqual([]);

    // Test with undefined data
    act(() => {
      mockTopDebtorsData = undefined;
      mockTopCreditorsData = undefined;
      rerender();
    });

    expect(result.current.list).toEqual([]);
    expect(result.current.debtorsList).toEqual([]);
    expect(result.current.creditorsList).toEqual([]);
  });

  it('should handle non-array data gracefully', () => {
    const { result, rerender } = renderHook(() => useDebitCreditCardHooks(), { wrapper: createWrapper() });

    act(() => {
      mockTopDebtorsData = { Data: 'not an array' };
      mockTopCreditorsData = { Data: null };
      rerender();
    });

    // The hook only checks Array.isArray for the 'list' property, not for debtorsList/creditorsList
    // The hook uses ?? [] so null becomes empty array
    expect(result.current.list).toEqual([]);
    expect(result.current.debtorsList).toBe('not an array');
    expect(result.current.creditorsList).toEqual([]);
  });

  it('should return correct totals data', () => {
    const mockTotalsData: DebitCreditBalanceAmountsItems = {
      totalCreditAmount: 5000000,
      formattedTotalCreditAmount: '5,000,000',
      totalCreditAmountUOM: 'ریال',
      totalDebitAmount: 3000000,
      formattedTotalDebitAmount: '3,000,000',
      totalDebitAmountUOM: 'ریال',
      balanceAmount: 2000000,
      formattedBalanceAmount: '2,000,000'
    };

    const { result, rerender } = renderHook(() => useDebitCreditCardHooks(), { wrapper: createWrapper() });

    act(() => {
      mockDebitCreditTotalsData = mockTotalsData;
      rerender();
    });

    expect(result.current.totals).toEqual(mockTotalsData);
  });

  it('should handle undefined totals data gracefully', () => {
    const { result, rerender } = renderHook(() => useDebitCreditCardHooks(), { wrapper: createWrapper() });

    act(() => {
      mockDebitCreditTotalsData = undefined;
      rerender();
    });

    expect(result.current.totals).toBeUndefined();
  });

  it('should maintain state between tab switches', () => {
    const mockDebtorsData: DebtorCreditorItem[] = [
      {
        code: '001',
        name: 'Debtor 1',
        customerCode: 'C001',
        tel: '021-12345678',
        mobile: '09123456789',
        sumBed: 1000000,
        formattedSumBed: '1,000,000',
        sumBedUOM: 'ریال',
        sumBes: 500000,
        formattedSumBes: '500,000',
        sumBesUOM: 'ریال',
        price: 500000,
        formattedPrice: '500,000',
        priceUOM: 'ریال'
      }
    ];

    const mockCreditorsData: DebtorCreditorItem[] = [
      {
        code: '002',
        name: 'Creditor 1',
        customerCode: 'C002',
        tel: '021-87654321',
        mobile: '09876543210',
        sumBed: 2000000,
        formattedSumBed: '2,000,000',
        sumBedUOM: 'ریال',
        sumBes: 1000000,
        formattedSumBes: '1,000,000',
        sumBesUOM: 'ریال',
        price: 1000000,
        formattedPrice: '1,000,000',
        priceUOM: 'ریال'
      }
    ];

    const { result, rerender } = renderHook(() => useDebitCreditCardHooks(), { wrapper: createWrapper() });

    act(() => {
      mockTopDebtorsData = { Data: mockDebtorsData };
      mockTopCreditorsData = { Data: mockCreditorsData };
      rerender();
    });

    // Initially debtors tab
    expect(result.current.selectedTab).toBe('debtors');
    expect(result.current.list).toEqual(mockDebtorsData);

    // Switch to creditors tab
    act(() => {
      result.current.setSelectedTab('creditors');
    });

    expect(result.current.selectedTab).toBe('creditors');
    expect(result.current.list).toEqual(mockCreditorsData);

    // Switch back to debtors tab
    act(() => {
      result.current.setSelectedTab('debtors');
    });

    expect(result.current.selectedTab).toBe('debtors');
    expect(result.current.list).toEqual(mockDebtorsData);
  });

  it('should maintain expanded card state independently', () => {
    const { result } = renderHook(() => useDebitCreditCardHooks(), { wrapper: createWrapper() });

    expect(result.current.expandedCard).toBe(0);

    act(() => {
      result.current.setExpandedCard(3);
    });
    expect(result.current.expandedCard).toBe(3);

    // Change tab should not affect expanded card state
    act(() => {
      result.current.setSelectedTab('creditors');
    });
    expect(result.current.expandedCard).toBe(3);

    act(() => {
      result.current.setExpandedCard(null);
    });
    expect(result.current.expandedCard).toBe(null);
  });
}); 