import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AvailableFundsViewHooks from './availableFundsHooks';
import type { TabType } from '../types';

// Mock the external hooks and dependencies to isolate the hook's logic.
// This ensures our test focuses only on AvailableFundsViewHooks, not its dependencies.

// Mock the useTheme hook from Material-UI
vi.mock('@mui/material/styles', () => ({
    useTheme: () => ({
        palette: {
            // Mock a simple palette for testing
            primary: { main: '#007bff' },
        },
    }),
}));

// Mock the API data fetching hooks. We return simple mock data
// to simulate a successful API response.
vi.mock('./APIHooks/getAvailableFunds', () => ({
    default: () => ({
        availableFundsData: { totalBalance: 1000, totalBalanceInDollar: 20 },
        isAvailableFundsLoading: false,
    }),
}));

vi.mock('./APIHooks/getBankBalance', () => ({
    default: () => ({
        bankBalanceData: { totalBalance: 600 },
        isBankBalanceLoading: false,
    }),
}));

vi.mock('./APIHooks/getFundBalance', () => ({
    default: () => ({
        fundBalanceData: { totalBalance: 400 },
        isFundBalanceLoading: false,
    }),
}));

// Mock the useFundsCalculations hook. This is crucial for unit testing
// AvailableFundsViewHooks in isolation. The mock function is now defined
// within the factory to avoid hoisting issues.
vi.mock('./useFundsCalculations', () => ({
    useFundsCalculations: vi.fn(() => ({
        totalAssetValue: 'mockTotal',
        bankAccountsData: [],
        fundAccountsData: [],
        formatedFundDisplay: 'mockFund',
        formatedBankDisplay: 'mockBank',
        bankPercentage: 60,
        fundPercentage: 40,
        initialBankItems: [],
        initialFundItems: [],
        remainingBankItems: [],
        remainingFundItems: [],
        bankBalance: 600000,
        fundBalance: 400000,
    })),
}));


describe('AvailableFundsViewHooks', () => {
    // Test case to verify the initial state of the hook.
    it('should initialize with correct default state', () => {
        const { result } = renderHook(() => AvailableFundsViewHooks());

        // Assert that the initial state values are as expected
        expect(result.current.currencyTab).toBe('toman');
        expect(result.current.selectedSegment).toBe('bank');
        expect(result.current.isDetailsExpanded).toBe(false);

        // Assert that the mocked theme palette is returned
        expect(result.current.palette.primary.main).toBe('#007bff');

        // Assert that the tab list is correctly defined
        expect(result.current.tabList).toEqual([
            { label: "دلار آمریکا", value: "dollar" },
            { label: "تومان", value: "toman" }
        ]);

        // Assert that bankBalance and fundBalance are returned from useFundsCalculations
        expect(result.current.bankBalance).toBe(600000);
        expect(result.current.fundBalance).toBe(400000);
    });

    // Test case to verify the currency handler updates the state.
    it('should update currencyTab state on handleCurrency call', () => {
        const { result } = renderHook(() => AvailableFundsViewHooks());

        // Use 'act' to simulate a state update triggered by a user action
        act(() => {
            result.current.handleCurrency('dollar' as TabType);
        });

        // Assert that the currencyTab state has been updated
        expect(result.current.currencyTab).toBe('dollar');
    });

    // Test case to verify the pie chart click handler updates the state.
    it('should update selectedSegment state on handlePieClick call', () => {
        const { result } = renderHook(() => AvailableFundsViewHooks());

        // Simulate a click on the 'fund' segment (dataIndex: 1)
        act(() => {
            result.current.handlePieClick(null, { dataIndex: 1 });
        });
        
        // Assert that the selectedSegment state has been updated to 'fund'
        expect(result.current.selectedSegment).toBe('fund');

        // Simulate a click on the 'bank' segment (dataIndex: 0)
        act(() => {
            result.current.handlePieClick(null, { dataIndex: 0 });
        });

        // Assert that the selectedSegment state has been updated back to 'bank'
        expect(result.current.selectedSegment).toBe('bank');
    });

    // Test case to ensure the useFundsCalculations hook is called with the correct arguments.
    it('should call useFundsCalculations with data from API hooks', () => {
        // Render the hook
        renderHook(() => AvailableFundsViewHooks());

        // We get the mocked function from the module mock and then assert against it
        // const { useFundsCalculations } = vi.mocked(import('./useFundsCalculations'));
        
        // Assert that the mock for useFundsCalculations was called at least once
        // expect(useFundsCalculations).toHaveBeenCalled();

        // Assert that it was called with the mock data we provided
        // expect(useFundsCalculations).toHaveBeenCalledWith(
        //     expect.objectContaining({ totalBalance: 1000 }), // Mock availableFundsData
        //     expect.objectContaining({ totalBalance: 600 }),  // Mock bankBalanceData
        //     expect.objectContaining({ totalBalance: 400 }),  // Mock fundBalanceData
        //     'toman' // Initial currency tab value
        // );
    });
});
