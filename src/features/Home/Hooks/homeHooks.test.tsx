import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useHomeHooks from './homeHooks';
import { DateFilterType } from '@/core/types/dateFilterTypes';


// MOCK the entire 'react-router' module at the top level to match the hook's import path
const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual as any,
        useNavigate: () => mockNavigate,
    };
});

// Create a new QueryClient instance for the tests
const queryClient = new QueryClient();

// Create a wrapper component that provides all necessary contexts
const TestWrapper = ({ children }: { children: any }) => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
);

// Mock all the custom data-fetching hooks to control their return values
vi.mock('./APIHooks/useDebitCreditBalanceAmounts', () => ({
    default: () => ({
        data: {
            Data: {
                formattedTotalCreditAmount: '1,234,567',
                totalCreditAmountUOM: 'ریال',
                formattedTotalDebitAmount: '987,654',
                totalDebitAmountUOM: 'ریال',
            },
        },
    }),
}));

vi.mock('./APIHooks/useSalesRevenue', () => ({
    default: () => ({
        data: {
            Data: [
                {
                    dateType: 'TodayDate',
                    formattedSalesAmount: '2,000,000',
                    salesAmountUOM: 'ریال',
                    salesChangePercent: 10,
                    salesType: 'Up',
                },
                {
                    dateType: 'YesterdayDate',
                    formattedSalesAmount: '1,800,000',
                    salesAmountUOM: 'ریال',
                    salesChangePercent: -5,
                    salesType: 'Down',
                },
            ],
        },
    }),
}));

vi.mock('./APIHooks/useNearDueCheques', () => ({
    default: () => ({
        data: {
            Data: {
                formattedPayableChequesAmount: '3,000,000',
                payableChequesAmountUOM: 'ریال',
                formattedReceivableChequesAmount: '5,000,000',
                receivableChequesAmountUOM: 'ریال',
            },
        },
    }),
}));

vi.mock('./APIHooks/useCurrencyRates', () => ({
    default: () => ({
        data: {
            Data: [
                {
                    name: 'UsdDollar',
                    title: 'دلار',
                    price: '450000',
                    sourceCreated: '2023-01-01T10:30:00Z',
                    rateOfChange: 2,
                },
                {
                    name: 'SekeEmaami',
                    title: 'سکه امامی',
                    price: '25000000',
                    sourceCreated: '2023-01-01T10:31:00Z',
                    rateOfChange: 5,
                },
                {
                    name: 'GoldGram18',
                    title: 'طلا ۱۸ عیار',
                    price: '1500000',
                    sourceCreated: '2023-01-01T10:32:00Z',
                    rateOfChange: -1,
                },
                {
                    name: 'Eur', // Exclude this from the final list
                    title: 'یورو',
                    price: '500000',
                    sourceCreated: '2023-01-01T10:33:00Z',
                    rateOfChange: 0,
                },
            ],
        },
        isPending: false,
    }),
}));

vi.mock('./APIHooks/useTopMostSoldProduct', () => ({
    default: () => ({
        data: {
            Data: {
                topNMostProductsByPrices: [{
                    productName: 'Sold by Price',
                    salesQuantity: 10,
                }],
                topNMostProductsByQuantity: [{
                    productName: 'Sold by Quantity',
                    salesQuantity: 20,
                }],
            },
        },
        isPending: false,
    }),
}));

vi.mock('./APIHooks/useTopMostRevenuableProduct', () => ({
    default: () => ({
        data: {
            Data: {
                topNMostRevenuableProducts: [{
                    productName: 'Revenuable by Amount',
                    salesRevenue: 500000,
                }],
                topNMostRevenuableProductsByRevenuPercentage: [{
                    productName: 'Revenuable by Percent',
                    salesRevenue: 600000,
                }],
            },
        },
        isPending: false,
    }),
}));

// Mock the available funds hook
vi.mock('@/features/AvailableFunds/Hooks/APIHooks/getAvailableFunds', () => ({
    default: () => ({
        availableFundsData: {
            availableFundsReportResponseDtos: [{
                formattedFundBalance: '5,000,000',
                fundBalanceUOM: 'ریال',
                formattedBankBalance: '10,000,000',
                bankBalanceUOM: 'ریال'
            }]
        }
    }),
}));

describe('useHomeHooks', () => {
    it('should correctly process and return all data from mocked hooks', () => {
        const { result } = renderHook(() => useHomeHooks(), { wrapper: TestWrapper });

        // Test debitCredit data
        expect(result.current.debitCredit).toEqual([
            {
                title: 'بستانکاران',
                value: '1,234,567',
                unit: 'ریال',
                icon: '/images/Homepageicons/creditbalanceamounts.png.png',
                path: '/debitcredit',
            },
            {
                title: 'بدهکاران',
                value: '987,654',
                unit: 'ریال',
                icon: '/images/Homepageicons/debitbalanceamounts.png',
                path: '/debitcredit',
            },
        ]);

        // Test nearDueCheques data
        expect(result.current.nearDueCheques).toEqual([
            {
                title: 'چک‌های پرداختی',
                value: '3,000,000',
                unit: 'ریال',
                icon: '/images/Homepageicons/payablecheques.png',
                path: '/cheques/payable-cheques',
            },
            {
                title: 'چک‌های دریافتی',
                value: '5,000,000',
                unit: 'ریال',
                icon: '/images/Homepageicons/receivablecheques.png',
                path: '/cheques/receivable-cheques',
            },
        ]);

        // Test salesAmount data
        expect(result.current.saleAmount).toEqual([
            {
                title: 'فروش امروز',
                value: '2,000,000',
                unit: 'ریال',
                salesChangePercent: 10,
                salesType: 'Up',
                icon: '/images/Homepageicons/salesRevenue.png',
                path: '/salesrevenue',
                dateType: DateFilterType.Today
            },
            {
                title: 'فروش دیروز',
                value: '1,800,000',
                unit: 'ریال',
                salesChangePercent: -5,
                salesType: 'Down',
                icon: '/images/Homepageicons/salesRevenue.png',
                path: '/salesrevenue',
                 dateType: DateFilterType.Yesterday
            }
        ]);


        // Test currencyTableData and ensure the price is formatted
        const faIRPrice1 = Math.round(Number('450000') / 10).toLocaleString('fa-IR');
        const faIRPrice2 = Math.round(Number('25000000') / 10).toLocaleString('fa-IR');
        const faIRPrice3 = Math.round(Number('1500000') / 10).toLocaleString('fa-IR');

        expect(result.current.currencyTableData).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'UsdDollar',
                    price: faIRPrice1,
                }),
                expect.objectContaining({
                    name: 'SekeEmaami',
                    price: faIRPrice2,
                }),
                expect.objectContaining({
                    name: 'GoldGram18',
                    price: faIRPrice3,
                }),
            ])
        );

        // Check that the excluded item is not in the list
        expect(result.current.currencyTableData).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: 'Eur' })
            ])
        );

        // Check the combined cardsData array in the correct order

    });

    it('should navigate to the correct path when handleCurrencyRatesClick is called', () => {
        const { result } = renderHook(() => useHomeHooks(), { wrapper: TestWrapper });
        act(() => {
            result.current.handleCurrencyRatesClick();
        });
        expect(mockNavigate).toHaveBeenCalledWith('/currencyRates');
    });
});
