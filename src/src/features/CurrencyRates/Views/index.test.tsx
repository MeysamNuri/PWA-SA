
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CurrencyRatesView from './index';
import useCurrencyRatesHook from '../Hooks/useCurrencyRates';

// Mock MUI theme hook
vi.mock('@mui/material', async () => {
    const actual = await vi.importActual('@mui/material');
    return {
        ...actual,
        useTheme: () => ({
            palette: {
                background: { default: '#fff' },
                success: { main: 'green' },
                error: { main: 'red' },
            },
        }),
    };
});

// Mock custom hook
vi.mock('../Hooks/useCurrencyRates', () => ({
    default: vi.fn(),
}));

// Mock NumberConverter
vi.mock('@/core/helper/numberConverter', () => ({
    NumberConverter: {
        latinToArabic: (val: string) => val, // identity for testing
        formatTime: (h: number, m: number) => `${h}:${m}`,
    },
}));

// Mock MainCard and other components to simplify test
vi.mock('@/core/components/MainCard/MainCard', () => ({
    default: (props: any) => <div data-testid="main-card">{JSON.stringify(props.rows)}</div>,
}));
vi.mock('@/core/components/innerPagesHeader', () => ({
    default: () => <div>Header</div>,
}));
vi.mock('@/core/components/ToggleTab', () => ({
    default: (props: any) => <div>ToggleTab: {props.value}</div>,
}));
vi.mock('@/core/components/ajaxLoadingComponent', () => ({
    default: () => <div>Loading...</div>,
}));
vi.mock('@/core/components/profitNotFound', () => ({
    default: (props: any) => <div>{props.message}</div>,
}));

describe('CurrencyRatesView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state correctly', () => {
        (useCurrencyRatesHook as any).mockReturnValue({
            isPending: true,
            isError: false,
            error: null,
            filteredData: [],
            tabs: [],
            findDollar: null,
            handleTabClick: vi.fn(),
            selectedTab: 'currencyRates',
        });

        render(<CurrencyRatesView />);
        expect(screen.getByText('Loading...')).toBeDefined();
    });

    it('renders error state correctly', () => {
        (useCurrencyRatesHook as any).mockReturnValue({
            isPending: false,
            isError: true,
            error: { message: 'Test error' },
            filteredData: [],
            tabs: [],
            findDollar: null,
            handleTabClick: vi.fn(),
            selectedTab: 'currencyRates',
        });

        render(<CurrencyRatesView />);
        expect(screen.getByText('Test error')).toBeDefined();
    });

    it('renders data correctly with rows', () => {
        const mockData = [
            {
                title: 'Gold',
                name: 'Ons',
                price: '1000',
                rateOfChange: '5',
                category: 'gold',
                highestRate: '0',
                lowestRate: '0',
                sourceCreated: '2025-11-18T12:00:00Z',
            },
        ];

        (useCurrencyRatesHook as any).mockReturnValue({
            isPending: false,
            isError: false,
            error: null,
            filteredData: mockData,
            tabs: [],
            findDollar: { price: '30000' },
            handleTabClick: vi.fn(),
            selectedTab: 'currencyRates',
        });

        render(<CurrencyRatesView />);
        expect(screen.getByTestId('main-card')).toBeDefined();
        // Optionally check row content
        const rows = JSON.parse(screen.getByTestId('main-card').textContent || '[]');
        expect(rows.length).toBe(2); // Ons has 2 rows
    });
    it('renders ProfitNotFound when there is no data', () => {
    (useCurrencyRatesHook as any).mockReturnValue({
        isPending: false,
        isError: false,
        error: null,
        filteredData: [],
        tabs: [],
        findDollar: null,
        handleTabClick: vi.fn(),
        selectedTab: 'currencyRates',
    });

    render(<CurrencyRatesView />);
    expect(screen.getByText('داده‌ای برای نمایش وجود ندارد.')).toBeDefined();
});
});
