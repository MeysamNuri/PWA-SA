import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import UnsettledInvoicesDetailsView from "./index";
import useUnsettledInvoicesDetailsHooks from "../Hooks/unsettledInvoicesDetails";
import type { UnsettledInvoicesDataDetails } from "../types";

vi.mock("../Hooks/unsettledInvoicesDetails", () => ({
    default: vi.fn(),
}));


vi.mock("@/core/components/MainCard/MainCard", () => ({
    default: ({ headerTitle, onToggle, rows, isExPanded }: any) => (
        <div data-testid="main-card">
            <div data-testid="card-header">{headerTitle}</div>
            <div data-testid="card-expanded">{isExPanded ? 'expanded' : 'collapsed'}</div>
            <button data-testid="toggle-button" onClick={onToggle}>Toggle</button>
            <div data-testid="card-rows">
                {rows.map((row: any, index: number) => (
                    <div key={index}>{row.title}: {row.value}</div>
                ))}
            </div>
        </div>
    ),
}));


vi.mock("@/core/components/innerPagesHeader", () => ({
    default: ({ title }: any) => <h1 data-testid="inner-page-header">{title}</h1>,
}));

vi.mock("@/core/components/ajaxLoadingComponent", () => ({
    default: () => <div data-testid="loading-component">Loading...</div>,
}));

const createTestWrapper = () => {
    const queryClient = new QueryClient();
    const theme = createTheme();
    return ({ children } : { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <BrowserRouter>{children}</BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
};



const mockProduct1: UnsettledInvoicesDataDetails = {
    invoiceCode: 'INV001',
    customerName: 'Customer 1',
    invoiceDate: '2021-01-01',
    invoiceAmount: 1000000,
    formattedInvoiceAmount: '1,000,000',
    invoiceAmountUOM: 'تومان',
    unCreditAmount: 100000,
    formattedUnCreditAmount: '100,000',
    unCreditAmountUOM: 'تومان',
    settlementDate: '2021-01-01',
    settelementBalance: 100000,
    formattedSettelementBalance: '100,000',
    settelementBalanceUOM: 'تومان',
    sellerCode: 'SELLER001',
    sellerName: 'Seller 1',
    paidAmount: 100000,
    formattedPaidAmount: '100,000',
    paidAmountUOM: 'تومان'
};
const mockProduct2: UnsettledInvoicesDataDetails = {
    ...mockProduct1,
    invoiceCode: 'INV002',
    customerName: 'Customer 2',
    invoiceDate: '2021-01-02',
    invoiceAmount: 2000000,
    formattedInvoiceAmount: '2,000,000',
    invoiceAmountUOM: 'تومان',
    unCreditAmount: 200000,
    formattedUnCreditAmount: '200,000',
    unCreditAmountUOM: 'تومان',
    settlementDate: '2021-01-02',
    settelementBalance: 200000,
    formattedSettelementBalance: '200,000',
    settelementBalanceUOM: 'تومان',
    sellerCode: 'SELLER002',
    sellerName: 'Seller 2',
    paidAmount: 200000,
    formattedPaidAmount: '200,000',
    paidAmountUOM: 'تومان'
};

const mockGetUnsettledInvoicesDetailsHooks = vi.mocked(useUnsettledInvoicesDetailsHooks);

describe('UnsettledInvoicesDetailsView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should display loading component when data is pending', () => {
    mockGetUnsettledInvoicesDetailsHooks.mockReturnValue({
        setExpandedCard: vi.fn(),
        expandedCard: 0, // First card expanded by default
        isPending: true,
        isError: false,
        sortedInvoices: [],
        invoices: [],
        infoOBJ: {
            path: '/unsettled-invoices-details',
            title: '',
            description: 'لیست فاکتورهایی که هنوز به طور کامل تسویه نشده‌اند'
        },
        selectedDaysType: 'Last30Days',
        handleDaysChange: vi.fn(),
        dateFilterOptions: [
            { label: 'دیروز', value: 'Yesterday' },
            { label: '۷روز گذشته', value: 'Last7Days' },
            { label: '۳۰روز گذشته', value: 'Last30Days' }
        ]
    } as any);

    render(<UnsettledInvoicesDetailsView />, { wrapper: createTestWrapper() });
    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
});

it('should display error message when data fetching fails', () => {
    mockGetUnsettledInvoicesDetailsHooks.mockReturnValue({
        setExpandedCard: vi.fn(),
        expandedCard: 0, // First card expanded by default
        isPending: false,
        isError: true,
        sortedInvoices: [],
        invoices: [],
        infoOBJ: {
            path: '/unsettled-invoices-details',
            title: '',
            description: 'لیست فاکتورهایی که هنوز به طور کامل تسویه نشده‌اند'
        },
        selectedDaysType: 'Last30Days',
        handleDaysChange: vi.fn(),
        dateFilterOptions: [
            { label: 'دیروز', value: 'Yesterday' },
            { label: '۷روز گذشته', value: 'Last7Days' },
            { label: '۳۰روز گذشته', value: 'Last30Days' }
        ]
    } as any);

    render(<UnsettledInvoicesDetailsView />, { wrapper: createTestWrapper() });
    expect(screen.getByText('خطا در دریافت اطلاعات')).toBeInTheDocument();
});

it('should display "no invoices" message when invoices list is empty', () => {
    mockGetUnsettledInvoicesDetailsHooks.mockReturnValue({
        setExpandedCard: vi.fn(),
        expandedCard: 0, // First card expanded by default
        isPending: false,
        isError: false,
        sortedInvoices: [],
        invoices: [],
        infoOBJ: {
            path: '/unsettled-invoices-details',
            title: '',
            description: 'لیست فاکتورهایی که هنوز به طور کامل تسویه نشده‌اند'
        },
        selectedDaysType: 'Last30Days',
        handleDaysChange: vi.fn(),
        dateFilterOptions: [
            { label: 'دیروز', value: 'Yesterday' },
            { label: '۷روز گذشته', value: 'Last7Days' },
            { label: '۳۰روز گذشته', value: 'Last30Days' }
        ]
    } as any);

    render(<UnsettledInvoicesDetailsView />, { wrapper: createTestWrapper() });
    expect(screen.getByText('فاکتور تسویه نشده‌ای موجود نیست')).toBeInTheDocument();
});

it('should render invoices with correct data and handle card expansion', () => {
    const setExpandedCard = vi.fn();
    mockGetUnsettledInvoicesDetailsHooks.mockReturnValue({
        setExpandedCard,
        expandedCard: 0,
        isPending: false,
        isError: false,
        sortedInvoices: [mockProduct1, mockProduct2],
        invoices: [mockProduct1, mockProduct2],
        infoOBJ: { path: '/test', title: 'Test' }
    } as any);

    render(<UnsettledInvoicesDetailsView />, { wrapper: createTestWrapper() });

    const mainCards = screen.getAllByTestId('main-card');
    expect(mainCards).toHaveLength(2);

    const firstCardRows = screen.getAllByTestId('card-rows')[0];
    expect(firstCardRows).toHaveTextContent('نام مشتری: Customer 1');
    expect(firstCardRows).toHaveTextContent('مبلغ فاکتور: 1,000,000');
    expect(firstCardRows).toHaveTextContent('مبلغ تسویه شده: 100,000');
    expect(firstCardRows).toHaveTextContent('مبلغ باقیمانده: 100,000');
    expect(firstCardRows).toHaveTextContent('نام فروشنده: Seller 1');
    expect(firstCardRows).toHaveTextContent('کد فروشنده: SELLER001');
    expect(firstCardRows).toHaveTextContent('کد فروشنده: SELLER001');

    const toggleButton = screen.getAllByTestId('toggle-button')[0];
    fireEvent.click(toggleButton);
    expect(setExpandedCard).toHaveBeenCalledWith(null);
});

it('should toggle the expanded card state on click', () => {
    const setExpandedCard = vi.fn();
    mockGetUnsettledInvoicesDetailsHooks.mockReturnValue({
        setExpandedCard,
        expandedCard: 0,
        isPending: false,
        isError: false,
        sortedInvoices: [mockProduct1, mockProduct2],
        invoices: [mockProduct1, mockProduct2],
        infoOBJ: { path: '/test', title: 'Test' },
        selectedDaysType: 'Last30Days',
        handleDaysChange: vi.fn(),
        dateFilterOptions: [
            { label: 'دیروز', value: 'Yesterday' },
            { label: '۷روز گذشته', value: 'Last7Days' },
            { label: '۳۰روز گذشته', value: 'Last30Days' }
        ]
    } as any);

    render(<UnsettledInvoicesDetailsView />, { wrapper: createTestWrapper() });

    const mainCards = screen.getAllByTestId('main-card');
    expect(mainCards).toHaveLength(2);

    const toggleButton = screen.getAllByTestId('toggle-button')[0];
    fireEvent.click(toggleButton);
    expect(setExpandedCard).toHaveBeenCalledWith(null);
});

it('should render date filter buttons and handle date change', () => {
    const handleDaysChange = vi.fn();
    mockGetUnsettledInvoicesDetailsHooks.mockReturnValue({
        setExpandedCard: vi.fn(),
        expandedCard: null,
        isPending: false,
        isError: false,
        sortedInvoices: [mockProduct1],
        invoices: [mockProduct1],
        infoOBJ: { path: '/test', title: 'Test' },
        selectedDaysType: 'Last30Days',
        handleDaysChange,
        dateFilterOptions: [
            { label: 'دیروز', value: 'Yesterday' },
            { label: '۷روز گذشته', value: 'Last7Days' },
            { label: '۳۰روز گذشته', value: 'Last30Days' }
        ]
    } as any);

    render(<UnsettledInvoicesDetailsView />, { wrapper: createTestWrapper() });

    // Check if date filter buttons are rendered
    expect(screen.getByText('دیروز')).toBeInTheDocument();
    expect(screen.getByText('۷روز گذشته')).toBeInTheDocument();
    expect(screen.getByText('۳۰روز گذشته')).toBeInTheDocument();

    // Test clicking on a different date filter
    const yesterdayButton = screen.getByText('دیروز');
    fireEvent.click(yesterdayButton);
    expect(handleDaysChange).toHaveBeenCalledWith('Yesterday');
});

it('should render date filter with correct alignment and direction', () => {
    mockGetUnsettledInvoicesDetailsHooks.mockReturnValue({
        setExpandedCard: vi.fn(),
        expandedCard: 0, // First card expanded by default
        isPending: false,
        isError: false,
        sortedInvoices: [mockProduct1],
        invoices: [mockProduct1],
        infoOBJ: { path: '/test', title: 'Test' },
        selectedDaysType: 'Last30Days',
        handleDaysChange: vi.fn(),
        dateFilterOptions: [
            { label: 'دیروز', value: 'Yesterday' },
            { label: '۷روز گذشته', value: 'Last7Days' },
            { label: '۳۰روز گذشته', value: 'Last30Days' }
        ]
    } as any);

    render(<UnsettledInvoicesDetailsView />, { wrapper: createTestWrapper() });

    // Check if date filter container has RTL direction
    const dateFilterContainer = screen.getByText('دیروز').closest('div')?.parentElement;
    expect(dateFilterContainer).toHaveStyle('direction: rtl');
});
});

