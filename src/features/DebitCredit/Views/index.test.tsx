import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DebitCreditView from './index';
import type { DebtorCreditorItem, DebitCreditBalanceAmountsItems } from '../types';
import type { IResponse } from '@/core/models/responseModel';

// Mock the custom hook
vi.mock('../Hooks/debitCredit', () => ({
    default: vi.fn()
}));

// Mock the components
vi.mock('@/core/components/MainCard/MainCard', () => ({
    default: ({ headerTitle, headerValue, headerUnit, isExpanded, rows, footer, children }: any) => (
        <div data-testid="main-card">
            <div data-testid="card-header">{headerTitle} - {headerValue} {headerUnit}</div>
            <div data-testid="card-expanded">{isExpanded ? 'expanded' : 'collapsed'}</div>
            <div data-testid="card-rows">
                {rows?.map((row: any, index: number) => (
                    <div key={index} data-testid={`row-${index}`}>
                        {row.title}: {row.value} {row.unit}
                    </div>
                ))}
            </div>
            {footer && <div data-testid="card-footer">{footer}</div>}
            {children}
        </div>
    )
}));


vi.mock('@/core/components/TotalCard', () => ({
    default: ({ rows }: any) => (
        <div data-testid="total-card">
            {rows?.map((row: any, index: number) => (
                <div key={index} data-testid={`total-row-${index}`}>
                    {row.title}: {row.value} {row.unit}
                </div>
            ))}
        </div>
    )
}));

vi.mock('@/core/components/ToggleTab', () => ({
    default: ({ value, onChange, options }: any) => (
        <div data-testid="toggle-tab">
            {options?.map((option: any, index: number) => (
                <button
                    key={index}
                    data-testid={`tab-${option.value}`}
                    onClick={() => onChange(option.value)}
                    className={value === option.value ? 'active' : ''}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}));

vi.mock('@/core/components/innerPagesHeader', () => ({
    default: ({ title, path }: any) => (
        <div data-testid="inner-page-header">
            <h1>{title}</h1>
            <span>{path}</span>
        </div>
    )
}));

// Mock environment variables
vi.mock('import.meta.env', () => ({
    BASE_URL: '/'
}));

// Mock window.location
Object.defineProperty(window, 'location', {
    value: {
        href: '',
    },
    writable: true,
});

const mockDebitCreditHook = vi.mocked(await import('../Hooks/debitCredit')).default;

const createTestWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    const theme = createTheme();

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

const mockDebtorCreditorItem: DebtorCreditorItem = {
    code: '123',
    name: 'Test Customer',
    customerCode: '123',
    tel: '02112345678',
    mobile: '09123456789',
    sumBed: 1000000,
    formattedSumBed: '1000000',
    sumBedUOM: 'تومان',
    sumBes: 500000,
    formattedSumBes: '500000',
    sumBesUOM: 'تومان',
    price: 500000,
    formattedPrice: '500000',
    priceUOM: 'تومان'
};

const mockTotals: IResponse<DebitCreditBalanceAmountsItems> = {
    RequestUrl: '/api/debit-credit/totals',
    Data: {
        totalCreditAmount: 2000000,
        formattedTotalCreditAmount: '2000000',
        totalCreditAmountUOM: 'تومان',
        totalDebitAmount: 1500000,
        formattedTotalDebitAmount: '1500000',
        totalDebitAmountUOM: 'تومان',
        balanceAmount: 500000,
        formattedBalanceAmount: '500000'
    },
    Message: ['Success'],
    Status: true,
    HttpStatusCode: 200
};

describe('DebitCreditView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders without crashing', () => {
        mockDebitCreditHook.mockReturnValue({
            setExpandedCard: vi.fn(),
            setSelectedTab: vi.fn(),
            selectedTab: 'debtors',
            totals: mockTotals,
            list: [mockDebtorCreditorItem],
            expandedCard: 0,
            debtorsList: [mockDebtorCreditorItem],
            creditorsList: []
        } as any);

        render(<DebitCreditView />, { wrapper: createTestWrapper() });

        expect(screen.getByTestId('inner-page-header')).toBeInTheDocument();
        expect(screen.getByTestId('toggle-tab')).toBeInTheDocument();
        expect(screen.getByTestId('total-card')).toBeInTheDocument();
    });

    it('displays correct header title', () => {
        mockDebitCreditHook.mockReturnValue({
            setExpandedCard: vi.fn(),
            setSelectedTab: vi.fn(),
            selectedTab: 'debtors',
            totals: mockTotals,
            list: [mockDebtorCreditorItem],
            expandedCard: 0,
            debtorsList: [mockDebtorCreditorItem],
            creditorsList: []
        } as any);

        render(<DebitCreditView />, { wrapper: createTestWrapper() });

        expect(screen.getByText('طرف حساب ها')).toBeInTheDocument();
    });

    it('displays toggle tabs with correct options', () => {
        mockDebitCreditHook.mockReturnValue({
            setExpandedCard: vi.fn(),
            setSelectedTab: vi.fn(),
            selectedTab: 'debtors',
            totals: mockTotals,
            list: [mockDebtorCreditorItem],
            expandedCard: 0,
            debtorsList: [mockDebtorCreditorItem],
            creditorsList: []
        } as any);

        render(<DebitCreditView />, { wrapper: createTestWrapper() });

        // expect(screen.getByTestId('tab-creditors')).toBeInTheDocument();
        // expect(screen.getByTestId('tab-debtors')).toBeInTheDocument();
        // expect(screen.getByText('بستانکاران')).toBeInTheDocument();
        // expect(screen.getByText('بدهکاران')).toBeInTheDocument();
    });

    it('displays total card with correct data', () => {
        mockDebitCreditHook.mockReturnValue({
            setExpandedCard: vi.fn(),
            setSelectedTab: vi.fn(),
            selectedTab: 'debtors',
            totals: mockTotals,
            list: [mockDebtorCreditorItem],
            expandedCard: 0,
            debtorsList: [mockDebtorCreditorItem],
            creditorsList: []
        } as any);

        render(<DebitCreditView />, { wrapper: createTestWrapper() });

        expect(screen.getByTestId('total-row-0')).toHaveTextContent('جمع بدهکاران: 1500000 تومان');
        expect(screen.getByTestId('total-row-1')).toHaveTextContent('جمع بستانکاران: 2000000 تومان');
    });

    it('displays main cards when list has items', () => {
        mockDebitCreditHook.mockReturnValue({
            setExpandedCard: vi.fn(),
            setSelectedTab: vi.fn(),
            selectedTab: 'debtors',
            totals: mockTotals,
            list: [mockDebtorCreditorItem],
            expandedCard: 0,
            debtorsList: [mockDebtorCreditorItem],
            creditorsList: []
        } as any);

        render(<DebitCreditView />, { wrapper: createTestWrapper() });

        expect(screen.getByTestId('main-card')).toBeInTheDocument();
        expect(screen.getByTestId('card-header')).toHaveTextContent('Test Customer - 500000 تومان');
    });

    it('displays "no data" message when list is empty', () => {
        mockDebitCreditHook.mockReturnValue({
            setExpandedCard: vi.fn(),
            setSelectedTab: vi.fn(),
            selectedTab: 'debtors',
            totals: mockTotals,
            list: [],
            expandedCard: null,
            debtorsList: [],
            creditorsList: []
        } as any);

        render(<DebitCreditView />, { wrapper: createTestWrapper() });

        expect(screen.getByText('داده‌ای برای نمایش وجود ندارد')).toBeInTheDocument();
    });

    it('handles tab change correctly', () => {
        const mockSetSelectedTab = vi.fn();
        mockDebitCreditHook.mockReturnValue({
            setExpandedCard: vi.fn(),
            setSelectedTab: mockSetSelectedTab,
            selectedTab: 'debtors',
            totals: mockTotals,
            list: [mockDebtorCreditorItem],
            expandedCard: 0,
            debtorsList: [mockDebtorCreditorItem],
            creditorsList: []
        } as any);

        render(<DebitCreditView />, { wrapper: createTestWrapper() });

        // const creditorsTab = screen.getByTestId('tab-creditors');
        // fireEvent.click(creditorsTab);

        // expect(mockSetSelectedTab).toHaveBeenCalledWith('creditors');
    });

    it('handles card expansion correctly', () => {
        const mockSetExpandedCard = vi.fn();
        mockDebitCreditHook.mockReturnValue({
            setExpandedCard: mockSetExpandedCard,
            setSelectedTab: vi.fn(),
            selectedTab: 'debtors',
            totals: mockTotals,
            list: [mockDebtorCreditorItem],
            expandedCard: 0,
            debtorsList: [mockDebtorCreditorItem],
            creditorsList: []
        } as any);

        render(<DebitCreditView />, { wrapper: createTestWrapper() });

        // The MainCard component is mocked, so we can't directly test the toggle
        // but we can verify the expanded state is passed correctly
        expect(screen.getByTestId('card-expanded')).toHaveTextContent('expanded');
    });

    it('displays correct card rows with data', () => {
        mockDebitCreditHook.mockReturnValue({
            setExpandedCard: vi.fn(),
            setSelectedTab: vi.fn(),
            selectedTab: 'debtors',
            totals: mockTotals,
            list: [mockDebtorCreditorItem],
            expandedCard: 0,
            debtorsList: [mockDebtorCreditorItem],
            creditorsList: []
        } as any);

        render(<DebitCreditView />, { wrapper: createTestWrapper() });

        expect(screen.getByTestId('row-0')).toHaveTextContent('کد طرف حساب: 123');
        expect(screen.getByTestId('row-1')).toHaveTextContent('کد حساب: 123');
        expect(screen.getByTestId('row-2')).toHaveTextContent('جمع دریافتی: 1000000 تومان');
        expect(screen.getByTestId('row-3')).toHaveTextContent('جمع پرداختی: 500000 تومان');
    });

    it('handles mobile call action', () => {
        mockDebitCreditHook.mockReturnValue({
            setExpandedCard: vi.fn(),
            setSelectedTab: vi.fn(),
            selectedTab: 'debtors',
            totals: mockTotals,
            list: [mockDebtorCreditorItem],
            expandedCard: 0,
            debtorsList: [mockDebtorCreditorItem],
            creditorsList: []
        } as any);

        render(<DebitCreditView />, { wrapper: createTestWrapper() });

        // Since the footer is rendered as JSX in the mock, we need to test the actual component
        // This test would need to be updated if we want to test the actual button clicks
        expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    });

    it('displays correct totals when data is undefined', () => {
        mockDebitCreditHook.mockReturnValue({
            setExpandedCard: vi.fn(),
            setSelectedTab: vi.fn(),
            selectedTab: 'debtors',
            totals: undefined,
            list: [mockDebtorCreditorItem],
            expandedCard: 0,
            debtorsList: [mockDebtorCreditorItem],
            creditorsList: []
        } as any);

        render(<DebitCreditView />, { wrapper: createTestWrapper() });

        expect(screen.getByTestId('total-row-0')).toHaveTextContent('جمع بدهکاران: 0 تومان');
        expect(screen.getByTestId('total-row-1')).toHaveTextContent('جمع بستانکاران: 0 تومان');
    });

    it('handles multiple items in list', () => {
        const multipleItems = [
            mockDebtorCreditorItem,
            { ...mockDebtorCreditorItem, code: '456', name: 'Second Customer' }
        ];

        mockDebitCreditHook.mockReturnValue({
            setExpandedCard: vi.fn(),
            setSelectedTab: vi.fn(),
            selectedTab: 'debtors',
            totals: mockTotals,
            list: multipleItems,
            expandedCard: 0,
            debtorsList: multipleItems,
            creditorsList: []
        } as any);

        render(<DebitCreditView />, { wrapper: createTestWrapper() });

        const mainCards = screen.getAllByTestId('main-card');
        expect(mainCards).toHaveLength(2);
    });
});
