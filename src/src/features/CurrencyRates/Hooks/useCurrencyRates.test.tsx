import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
// import { MemoryRouter } from 'react-router-dom';

// Import the hook to be tested and its dependencies
import useCurrencyRatesHook from './useCurrencyRates';
import useExchangeRate from '../Hooks/APIHooks/useExchangeRate';
import type { ExchangeRateItem } from '../types';

// Mock the useExchangeRate hook to control its return values
vi.mock('../Hooks/APIHooks/useExchangeRate', () => ({
    default: vi.fn(),
}));

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
const mockLocation = { pathname: '/currencyRates' };

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => mockLocation,
    };
});

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
        mockNavigate.mockClear();
        mockLocation.pathname = '/currencyRates';
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

    it('should navigate to correct URL when handleTabClick is called', () => {
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

        // Assert that navigate was called with the correct URL
        expect(mockNavigate).toHaveBeenCalledWith('/currencyRates/coin');
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

    it('should select correct tab based on URL path', () => {
        // Mock the useExchangeRate to return data
        vi.mocked(useExchangeRate).mockReturnValue({
            data: mockExchangeRateData,
            isPending: false,
            isError: false,
            error: null,
        });

        // Test different URL paths
        const testCases = [
            { path: '/currencyRates/currency', expectedTab: 'currencyRates' },
            { path: '/currencyRates/coin', expectedTab: 'coinRates' },
            { path: '/currencyRates/gold', expectedTab: 'goldRates' },
            { path: '/currencyRates', expectedTab: 'currencyRates' },
        ];

        testCases.forEach(({ path, expectedTab }) => {
            mockLocation.pathname = path;
            const { result } = renderHook(() => useCurrencyRatesHook());
            expect(result.current.selectedTab).toBe(expectedTab);
        });
    });

    it('should handle data with exchangeRateItem structure', () => {
        const mockDataWithExchangeRateItem = {
            Data: {
                exchangeRateItem: [
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
                ]
            },
            RequestUrl: "http://mock-api.com/rates",
            Message: ["Success"],
            Status: true,
            HttpStatusCode: 200
        };

        vi.mocked(useExchangeRate).mockReturnValue({
            data: mockDataWithExchangeRateItem as any,
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useCurrencyRatesHook());

        expect(result.current.filteredData).toHaveLength(1);
        expect(result.current.filteredData[0]).toEqual(
            expect.objectContaining({ name: 'UsdDollar' })
        );
    });

    it('should handle data with Object.values fallback structure', () => {
        const mockDataWithObjectValues = {
            Data: {
                someOtherProperty: 'value',
                rates: [
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
                ]
            },
            RequestUrl: "http://mock-api.com/rates",
            Message: ["Success"],
            Status: true,
            HttpStatusCode: 200
        };

        vi.mocked(useExchangeRate).mockReturnValue({
            data: mockDataWithObjectValues as any,
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useCurrencyRatesHook());

        expect(result.current.filteredData).toHaveLength(1);
        expect(result.current.filteredData[0]).toEqual(
            expect.objectContaining({ name: 'Euro' })
        );
    });

    it('should handle non-array data and return empty array with warning', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        
        // Create data that will result in exchangeRates not being an array
        // The key is to make exchangeRateItem be a non-array value that's truthy
        // so that the || [] fallback doesn't apply
        const mockNonArrayData = {
            Data: {
                exchangeRateItem: { notAnArray: true } // This is truthy but not an array
            },
            RequestUrl: "http://mock-api.com/rates",
            Message: ["Success"],
            Status: true,
            HttpStatusCode: 200
        };

        vi.mocked(useExchangeRate).mockReturnValue({
            data: mockNonArrayData as any,
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useCurrencyRatesHook());

        expect(result.current.filteredData).toEqual([]);
        expect(consoleSpy).toHaveBeenCalledWith('Exchange rates data is not an array:', mockNonArrayData.Data);
        
        consoleSpy.mockRestore();
    });

    it('should filter coin rates correctly', () => {
        const mockCoinData = {
            Data: [
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
                    title: 'SekeBahar Title',
                    name: 'SekeBahar',
                    price: '16,000,000',
                    rateOfChange: '+1.5%',
                    category: 'coin',
                    highestRate: '16,200,000',
                    lowestRate: '15,800,000',
                    sourceCreated: '2023-10-27T10:00:00Z'
                } as ExchangeRateItem,
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
            ],
            RequestUrl: "http://mock-api.com/rates",
            Message: ["Success"],
            Status: true,
            HttpStatusCode: 200
        };

        vi.mocked(useExchangeRate).mockReturnValue({
            data: mockCoinData,
            isPending: false,
            isError: false,
            error: null,
        });

        mockLocation.pathname = '/currencyRates/coin';
        const { result } = renderHook(() => useCurrencyRatesHook());

        expect(result.current.selectedTab).toBe('coinRates');
        expect(result.current.filteredData).toHaveLength(2);
        expect(result.current.filteredData).toEqual([
            expect.objectContaining({ name: 'SekeEmaami' }),
            expect.objectContaining({ name: 'SekeBahar' })
        ]);
    });

    it('should filter gold rates correctly with custom ordering', () => {
        const mockGoldData = {
            Data: [
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
                {
                    title: 'GoldGram18 Title',
                    name: 'GoldGram18',
                    price: '2,500,000',
                    rateOfChange: '+1.0%',
                    category: 'gold',
                    highestRate: '2,510,000',
                    lowestRate: '2,490,000',
                    sourceCreated: '2023-10-27T10:00:00Z'
                } as ExchangeRateItem,
                {
                    title: 'GoldGram24 Title',
                    name: 'GoldGram24',
                    price: '3,000,000',
                    rateOfChange: '+0.8%',
                    category: 'gold',
                    highestRate: '3,020,000',
                    lowestRate: '2,980,000',
                    sourceCreated: '2023-10-27T10:00:00Z'
                } as ExchangeRateItem,
                {
                    title: 'GoldGram18740 Title',
                    name: 'GoldGram18740',
                    price: '2,800,000',
                    rateOfChange: '+1.2%',
                    category: 'gold',
                    highestRate: '2,820,000',
                    lowestRate: '2,780,000',
                    sourceCreated: '2023-10-27T10:00:00Z'
                } as ExchangeRateItem,
                {
                    title: 'GoldMesghal Title',
                    name: 'GoldMesghal',
                    price: '1,200,000',
                    rateOfChange: '+0.5%',
                    category: 'gold',
                    highestRate: '1,210,000',
                    lowestRate: '1,190,000',
                    sourceCreated: '2023-10-27T10:00:00Z'
                } as ExchangeRateItem,
            ],
            RequestUrl: "http://mock-api.com/rates",
            Message: ["Success"],
            Status: true,
            HttpStatusCode: 200
        };

        vi.mocked(useExchangeRate).mockReturnValue({
            data: mockGoldData,
            isPending: false,
            isError: false,
            error: null,
        });

        mockLocation.pathname = '/currencyRates/gold';
        const { result } = renderHook(() => useCurrencyRatesHook());

        expect(result.current.selectedTab).toBe('goldRates');
        expect(result.current.filteredData).toHaveLength(5);
        
        // Check that gold items are sorted according to custom order
        const expectedOrder = ['GoldGram18', 'GoldGram18740', 'GoldGram24', 'GoldMesghal', 'Ons'];
        const actualOrder = result.current.filteredData.map(item => item.name);
        expect(actualOrder).toEqual(expectedOrder);
    });

    it('should handle default navigation fallback', () => {
        vi.mocked(useExchangeRate).mockReturnValue({
            data: mockExchangeRateData,
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useCurrencyRatesHook());

        act(() => {
            result.current.handleTabClick('unknownTab' as any);
        });

        expect(mockNavigate).toHaveBeenCalledWith('/currencyRates');
    });

    it('should handle unknown URL path and default to currencyRates', () => {
        vi.mocked(useExchangeRate).mockReturnValue({
            data: mockExchangeRateData,
            isPending: false,
            isError: false,
            error: null,
        });

        mockLocation.pathname = '/unknown/path';
        const { result } = renderHook(() => useCurrencyRatesHook());

        expect(result.current.selectedTab).toBe('currencyRates');
    });

    it('should handle empty data gracefully', () => {
        const mockEmptyData = {
            Data: [],
            RequestUrl: "http://mock-api.com/rates",
            Message: ["Success"],
            Status: true,
            HttpStatusCode: 200
        };

        vi.mocked(useExchangeRate).mockReturnValue({
            data: mockEmptyData,
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useCurrencyRatesHook());

        expect(result.current.filteredData).toEqual([]);
        expect(result.current.findDollar).toBeNull();
    });

    it('should handle null/undefined data gracefully', () => {
        vi.mocked(useExchangeRate).mockReturnValue({
            data: null as any,
            isPending: false,
            isError: false,
            error: null,
        });

        const { result } = renderHook(() => useCurrencyRatesHook());

        expect(result.current.filteredData).toEqual([]);
        expect(result.current.findDollar).toBeNull();
    });
});
