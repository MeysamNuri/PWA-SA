import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useUnsettledInvoicesDetailsHooks from './unsettledInvoicesDetails';
import useUnsettledInvoicesDetails from './APIHooks/useUnsettledInvoicesDetails';
import type { UnsettledInvoicesDataDetails } from '../types';
import React from 'react';

// Mock the API hook
vi.mock('./APIHooks/useUnsettledInvoicesDetails', () => ({
    default: vi.fn(),
}));

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

const wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
};

const mockInvoice1: UnsettledInvoicesDataDetails = {
    invoiceCode: 'INV001',
    customerName: 'مشتری اول',
    invoiceDate: '2024-01-15',
    invoiceAmount: 1000000,
    formattedInvoiceAmount: '1,000,000',
    invoiceAmountUOM: 'ریال',
    unCreditAmount: 500000,
    formattedUnCreditAmount: '500,000',
    unCreditAmountUOM: 'ریال',
    settlementDate: '2024-01-20',
    settelementBalance: 500000,
    formattedSettelementBalance: '500,000',
    settelementBalanceUOM: 'ریال',
    sellerCode: 'SELLER001',
    sellerName: 'فروشنده اول',
    paidAmount: 500000,
    formattedPaidAmount: '500,000',
    paidAmountUOM: 'ریال'
};

const mockInvoice2: UnsettledInvoicesDataDetails = {
    invoiceCode: 'INV002',
    customerName: 'مشتری دوم',
    invoiceDate: '2024-01-10',
    invoiceAmount: 2000000,
    formattedInvoiceAmount: '2,000,000',
    invoiceAmountUOM: 'ریال',
    unCreditAmount: 1000000,
    formattedUnCreditAmount: '1,000,000',
    unCreditAmountUOM: 'ریال',
    settlementDate: '2024-01-25',
    settelementBalance: 1000000,
    formattedSettelementBalance: '1,000,000',
    settelementBalanceUOM: 'ریال',
    sellerCode: 'SELLER002',
    sellerName: 'فروشنده دوم',
    paidAmount: 1000000,
    formattedPaidAmount: '1,000,000',
    paidAmountUOM: 'ریال'
};

describe('useUnsettledInvoicesDetailsHooks', () => {
    it('should return correct initial state', () => {
        vi.mocked(useUnsettledInvoicesDetails).mockReturnValue({
            data: undefined,
            isPending: true,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useUnsettledInvoicesDetailsHooks(), { wrapper });

        expect(result.current.expandedCard).toBe(0); // First card expanded by default
        expect(result.current.sortedInvoices).toEqual([]);
        expect(result.current.invoices).toEqual([]);
        expect(result.current.isPending).toBe(true);
        expect(result.current.isError).toBe(false);
        expect(result.current.infoOBJ).toEqual({
            path: "/unsettled-invoices-details",
            title: "",
            description: "لیست فاکتورهایی که هنوز به طور کامل تسویه نشده‌اند"
        });
    });

    it('should handle successful data fetch and sort invoices by date', () => {
        const mockData = {
            Data: [mockInvoice1, mockInvoice2],
            Status: true,
            Message: [],
            RequestUrl: '/SalesRevenue/GetUnsettledInvoicesDetails',
            HttpStatusCode: 200
        };

        vi.mocked(useUnsettledInvoicesDetails).mockReturnValue({
            data: mockData,
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useUnsettledInvoicesDetailsHooks(), { wrapper });

        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.invoices).toEqual([mockInvoice1, mockInvoice2]);
        // Should be sorted by date (newest first)
        expect(result.current.sortedInvoices[0]).toEqual(mockInvoice1); // 2024-01-15
        expect(result.current.sortedInvoices[1]).toEqual(mockInvoice2); // 2024-01-10
    });

    it('should handle empty data array', () => {
        const mockData = {
            Data: [],
            Status: true,
            Message: [],
            RequestUrl: '/SalesRevenue/GetUnsettledInvoicesDetails',
            HttpStatusCode: 200
        };

        vi.mocked(useUnsettledInvoicesDetails).mockReturnValue({
            data: mockData,
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useUnsettledInvoicesDetailsHooks(), { wrapper });

        expect(result.current.invoices).toEqual([]);
        expect(result.current.sortedInvoices).toEqual([]);
        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(false);
    });

    it('should handle undefined data', () => {
        vi.mocked(useUnsettledInvoicesDetails).mockReturnValue({
            data: undefined,
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useUnsettledInvoicesDetailsHooks(), { wrapper });

        expect(result.current.invoices).toEqual([]);
        expect(result.current.sortedInvoices).toEqual([]);
    });

    it('should handle error state', () => {
        vi.mocked(useUnsettledInvoicesDetails).mockReturnValue({
            data: undefined,
            isPending: false,
            isError: true,
            error: null,
        });

        const { result } = renderHook(() => useUnsettledInvoicesDetailsHooks(), { wrapper });

        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(true);
        expect(result.current.invoices).toEqual([]);
        expect(result.current.sortedInvoices).toEqual([]);
    });

    it('should handle card expansion state', () => {
        vi.mocked(useUnsettledInvoicesDetails).mockReturnValue({
            data: { 
                Data: [mockInvoice1],
                Status: true,
                Message: [],
                RequestUrl: '/SalesRevenue/GetUnsettledInvoicesDetails',
                HttpStatusCode: 200
            },
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useUnsettledInvoicesDetailsHooks(), { wrapper });

        // Initially first card is expanded by default
        expect(result.current.expandedCard).toBe(0);

        // Expand first card (should remain the same)
        act(() => {
            result.current.setExpandedCard(0);
        });

        expect(result.current.expandedCard).toBe(0);

        // Collapse the card
        act(() => {
            result.current.setExpandedCard(null);
        });

        expect(result.current.expandedCard).toBeNull();

        // Expand and then toggle to collapse using the same logic as the component
        act(() => {
            result.current.setExpandedCard(0);
        });

        // Simulate the onToggle logic: expandedCard === idx ? null : idx
        act(() => {
            const currentExpanded = result.current.expandedCard;
            result.current.setExpandedCard(currentExpanded === 0 ? null : 0);
        });

        expect(result.current.expandedCard).toBeNull();
    });

    it('should sort invoices correctly with different dates', () => {
        const olderInvoice = {
            ...mockInvoice1,
            invoiceCode: 'INV_OLD',
            invoiceDate: '2023-12-01'
        };

        const newerInvoice = {
            ...mockInvoice2,
            invoiceCode: 'INV_NEW',
            invoiceDate: '2024-02-01'
        };

        const mockData = {
            Data: [olderInvoice, newerInvoice, mockInvoice1],
            Status: true,
            Message: [],
            RequestUrl: '/SalesRevenue/GetUnsettledInvoicesDetails',
            HttpStatusCode: 200
        };

        vi.mocked(useUnsettledInvoicesDetails).mockReturnValue({
            data: mockData,
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useUnsettledInvoicesDetailsHooks(), { wrapper });

        // Should be sorted by date (newest first)
        expect(result.current.sortedInvoices[0].invoiceCode).toBe('INV_NEW'); // 2024-02-01
        expect(result.current.sortedInvoices[1].invoiceCode).toBe('INV001'); // 2024-01-15
        expect(result.current.sortedInvoices[2].invoiceCode).toBe('INV_OLD'); // 2023-12-01
    });

    describe('handleDaysChange function', () => {
        it('should update selectedDaysType when handleDaysChange is called', () => {
            vi.mocked(useUnsettledInvoicesDetails).mockReturnValue({
                data: undefined,
                isPending: false,
                isError: false,
                error: null,
            });

            const { result } = renderHook(() => useUnsettledInvoicesDetailsHooks(), { wrapper });

            // Initial state should be Last7Days
            expect(result.current.selectedDaysType).toBe('Last7Days');

            // Call handleDaysChange with new value
            act(() => {
                result.current.handleDaysChange('Last30Days');
            });

            // selectedDaysType should be updated
            expect(result.current.selectedDaysType).toBe('Last30Days');
        });

        it('should update selectedDaysType to Yesterday when handleDaysChange is called with Yesterday', () => {
            vi.mocked(useUnsettledInvoicesDetails).mockReturnValue({
                data: undefined,
                isPending: false,
                isError: false,
                error: null,
            });

            const { result } = renderHook(() => useUnsettledInvoicesDetailsHooks(), { wrapper });

            // Call handleDaysChange with Yesterday
            act(() => {
                result.current.handleDaysChange('Yesterday');
            });

            expect(result.current.selectedDaysType).toBe('Yesterday');
        });

        it('should update selectedDaysType to Last7Days when handleDaysChange is called with Last7Days', () => {
            vi.mocked(useUnsettledInvoicesDetails).mockReturnValue({
                data: undefined,
                isPending: false,
                isError: false,
                error: null,
            });

            const { result } = renderHook(() => useUnsettledInvoicesDetailsHooks(), { wrapper });

            // First change to a different value
            act(() => {
                result.current.handleDaysChange('Last30Days');
            });

            expect(result.current.selectedDaysType).toBe('Last30Days');

            // Then change back to Last7Days
            act(() => {
                result.current.handleDaysChange('Last7Days');
            });

            expect(result.current.selectedDaysType).toBe('Last7Days');
        });

        it('should handle multiple consecutive handleDaysChange calls', () => {
            vi.mocked(useUnsettledInvoicesDetails).mockReturnValue({
                data: undefined,
                isPending: false,
                isError: false,
                error: null,
            });

            const { result } = renderHook(() => useUnsettledInvoicesDetailsHooks(), { wrapper });

            // Multiple changes in sequence
            act(() => {
                result.current.handleDaysChange('Yesterday');
            });
            expect(result.current.selectedDaysType).toBe('Yesterday');

            act(() => {
                result.current.handleDaysChange('Last30Days');
            });
            expect(result.current.selectedDaysType).toBe('Last30Days');

            act(() => {
                result.current.handleDaysChange('Last7Days');
            });
            expect(result.current.selectedDaysType).toBe('Last7Days');
        });

        it('should return correct dateFilterOptions', () => {
            vi.mocked(useUnsettledInvoicesDetails).mockReturnValue({
                data: undefined,
                isPending: false,
                isError: false,
                error: null,
            });

            const { result } = renderHook(() => useUnsettledInvoicesDetailsHooks(), { wrapper });

            const expectedOptions = [
                { label: 'دیروز', value: 'Yesterday' },
                { label: '۷روز گذشته', value: 'Last7Days' },
                { label: '۳۰روز گذشته', value: 'Last30Days' },
            ];

            expect(result.current.dateFilterOptions).toEqual(expectedOptions);
        });

        it('should call useUnsettledInvoicesDetails with updated selectedDaysType', () => {
            const mockUseUnsettledInvoicesDetails = vi.mocked(useUnsettledInvoicesDetails);
            
            mockUseUnsettledInvoicesDetails.mockReturnValue({
                data: undefined,
                isPending: false,
                isError: false,
                error: null,
            });

            const { result } = renderHook(() => useUnsettledInvoicesDetailsHooks(), { wrapper });

            // Verify initial call with Last7Days
            expect(mockUseUnsettledInvoicesDetails).toHaveBeenCalledWith('Last7Days');

            // Change the selectedDaysType
            act(() => {
                result.current.handleDaysChange('Last30Days');
            });

            // The hook should be called again with the new value
            expect(mockUseUnsettledInvoicesDetails).toHaveBeenCalledWith('Last30Days');
        });
    });
});


