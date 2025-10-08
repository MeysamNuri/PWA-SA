import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Import the hook to be tested and its dependencies
import useCurrencyRatesHook from './useCurrencyRates';
import useExchangeRate from '../Hooks/APIHooks/useExchangeRate';
import type { ExchangeRateItem } from '../types';

// Mock the useExchangeRate hook to control its return values
vi.mock('../Hooks/APIHooks/useExchangeRate', () => ({
    default: vi.fn(),
}));

describe('useCurrencyRatesHook', () => {
    // Define mock data that mimics the API response structure, including the IResponse properties
    const mockExchangeRateData = {
        Data: [
            {
                title: 'UsdDollar Title',
                name: 'UsdDollar',
                price: '50,000',
                rateOfChange: '+1.5%',
                category: 'currency',
                highestRate: '51,000',
                lowestRate: '49,000',
                sourceCreated: '2023-10-27T10:00:00Z'
            } as ExchangeRateItem,
            {
                title: 'Euro Title',
                name: 'Euro',
                price: '55,000',
                rateOfChange: '-0.5%',
                category: 'currency',
                highestRate: '55,500',
                lowestRate: '54,500',
                sourceCreated: '2023-10-27T10:00:00Z'
            } as ExchangeRateItem,
            {
                title: 'SekeEmaami Title',
                name: 'SekeEmaami',
                price: '15,000,000',
                rateOfChange: '+2.0%',
                category: 'coin',
                highestRate: '15,200,000',
                lowestRate: '14,800,000',
                sourceCreated: '2023-10-27T10:00:00Z'
            } as ExchangeRateItem,
            {
                title: 'GoldGram18740 Title',
                name: 'GoldGram18740',
                price: '2,500,000',
                rateOfChange: '+1.0%',
                category: 'gold',
                highestRate: '2,510,000',
                lowestRate: '2,490,000',
                sourceCreated: '2023-10-27T10:00:00Z'
            } as ExchangeRateItem,
            {
                title: 'Ons Title',
                name: 'Ons',
                price: '2,000',
                rateOfChange: '+0.2%',
                category: 'gold',
                highestRate: '2,010',
                lowestRate: '1,990',
                sourceCreated: '2023-10-27T10:00:00Z'
            } as ExchangeRateItem,
        ],
        RequestUrl: "http://mock-api.com/rates",
        Message: ["Success"], // Changed to an array
        Status: true, // Changed from number to boolean
        HttpStatusCode: 200
    };

    beforeEach(() => {
        // Reset all mocks before each test
        vi.resetAllMocks();
    });

    it('should initialize with currencyRates tab selected', () => {
        // Mock the useExchangeRate to return data
        vi.mocked(useExchangeRate).mockReturnValue({
            data: mockExchangeRateData,
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useCurrencyRatesHook());

        // Assert that the initial tab is 'currencyRates'
        expect(result.current.selectedTab).toBe('currencyRates');
        // Assert that the tabs array is correct
        expect(result.current.tabs).toEqual([
            { label: 'ارز', value: 'currencyRates' },
            { label: 'سکه', value: 'coinRates' },
            { label: 'طلا', value: 'goldRates' },
        ]);
    });

    it('should filter data for currency rates tab by default', () => {
        // Mock the useExchangeRate to return data
        vi.mocked(useExchangeRate).mockReturnValue({
            data: mockExchangeRateData,
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useCurrencyRatesHook());

        // Assert that filteredData contains only the currency item
        expect(result.current.filteredData).toEqual([
            expect.objectContaining({ name: 'UsdDollar', price: '50,000' }),
            expect.objectContaining({ name: 'Euro', price: '55,000' }),
        ]);
    });

    it('should update the selected tab and filter data when handleTabClick is called', () => {
        // Mock the useExchangeRate to return data
        vi.mocked(useExchangeRate).mockReturnValue({
            data: mockExchangeRateData,
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useCurrencyRatesHook());

        // Use act to simulate the tab change
        act(() => {
            result.current.handleTabClick('coinRates');
        });

        // Assert that the tab has been updated
        expect(result.current.selectedTab).toBe('coinRates');
        // Assert that the data is filtered correctly for coins
        expect(result.current.filteredData).toEqual([
            expect.objectContaining({ name: 'SekeEmaami', price: '15,000,000' }),
        ]);
    });

    it('should return the correct findDollar item', () => {
        // Mock the useExchangeRate to return data
        vi.mocked(useExchangeRate).mockReturnValue({
            data: mockExchangeRateData,
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useCurrencyRatesHook());

        // Assert that findDollar correctly returns the UsdDollar item
        expect(result.current.findDollar).toEqual(
            expect.objectContaining({ name: 'UsdDollar', price: '50,000' })
        );
    });

    it('should return null for findDollar when data is not available', () => {
        // Mock the useExchangeRate to return null data
        vi.mocked(useExchangeRate).mockReturnValue({
            data: undefined, // Changed from null to undefined
            isPending: true,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useCurrencyRatesHook());

        // Assert that findDollar is null when there is no data
        expect(result.current.findDollar).toBeNull();
    });

    it('should handle pending and error states correctly', () => {
        // Mock the useExchangeRate to return a pending state
        vi.mocked(useExchangeRate).mockReturnValue({
            data: undefined,
            isPending: true,
            isError: false,
            error: null,
        });

        const { result, rerender } = renderHook(() => useCurrencyRatesHook());

        expect(result.current.isPending).toBe(true);
        expect(result.current.isError).toBe(false);

        // Rerender with an error state
        vi.mocked(useExchangeRate).mockReturnValue({
            data: undefined,
            isPending: false,
            isError: true,
            error: new Error('Failed to fetch'),
        });

        rerender();
        
        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(true);
        expect(result.current.error?.message).toBe('Failed to fetch');
    });
});
