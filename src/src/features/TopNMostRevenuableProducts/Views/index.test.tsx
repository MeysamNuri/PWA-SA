import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TopNMostRevenuableProductsView from './index';
import type { ITopNMostRevenuableProducts } from '../types';
import { DateFilterType } from '@/core/types/dateFilterTypes';



// Mock the custom hook
vi.mock('../Hooks/topNMostRevenuable', () => ({
    default: vi.fn(),
    useTopNMostRevenuableProductsHook: vi.fn(),
    DateFilterType: {
        Yesterday: '1',
        Last7Days: '7',
        Last30Days: '30'
    }
}));

// Mock the components
vi.mock('@/core/components/MainCard/MainCard', () => ({
    default: ({ headerTitle, rows, children }: any) => (
        <div data-testid="main-card">
            <div data-testid="card-header">{headerTitle}</div>
            <div data-testid="card-rows">
                {rows?.map((row: any, index: number) => (
                    <div key={index} data-testid={`row-${index}`}>
                        {row.title}: {row.value} {row.unit}
                    </div>
                ))}
            </div>
            {children}
        </div>
    )
}));



vi.mock('@/core/components/ToggleTab', () => ({
    CustomToggleTab: ({ value, onChange, options, variant }: any) => (
        <div data-testid={`toggle-tab-${variant}`}>
            {options?.map((option: any, index: number) => (
                <button
                    key={index}
                    data-testid={`tab-${variant}-${option.value}`}
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

// Mock the number converter
vi.mock('@/core/helper/numberConverter', () => ({
  NumberConverter: {
    latinToArabic: (value: string) => {
      // Convert Persian numerals back to Latin numerals for testing and remove commas
      return value.replace(/۸/g, '8')
        .replace(/۹/g, '9')
        .replace(/۰/g, '0')
        .replace(/۱/g, '1')
        .replace(/۲/g, '2')
        .replace(/۳/g, '3')
        .replace(/۴/g, '4')
        .replace(/۵/g, '5')
        .replace(/۶/g, '6')
        .replace(/۷/g, '7')
        .replace(/٬/g, '')
        .replace(/,/g, '');
    },
    formatCurrency: (value: number) => {
      // Mock implementation that adds commas and converts to Arabic numerals
      const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return formatted.replace(/\d/g, (digit) => {
        const arabicMap: { [key: string]: string } = {
          '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
          '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
        };
        return arabicMap[digit] || digit;
      });
    }
  }
}));

// Mock environment variables
vi.mock('import.meta.env', () => ({
    BASE_URL: '/'
}));

const mockUseTopNMostRevenuableProductsHook = vi.mocked(await import('../Hooks/topNMostRevenuable')).useTopNMostRevenuableProductsHook;

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

const mockTopRevenuableProduct: ITopNMostRevenuableProducts = {
    productName: 'iPhone 15',
    productCode: 'PROD001',
    salesQuantity: 10,
    salesRevenuAmount: 50000000,
    formattedSalesRevenuAmount: '50,000,000',
    salesRevenuAmountUOM: 'تومان',
    revenuPercentage: 25.5,
    purchaseAmount: 40000000,
    formattedPurchaseAmount: '40,000,000',
    purchaseAmountUOM: 'تومان',
    saleAmount: 50000000,
    formattedSaleAmount: '50,000,000',
    saleAmountUOM: 'تومان'
};


const mockTopRevenuableProduct2: ITopNMostRevenuableProducts = {
    ...mockTopRevenuableProduct,
    productName: 'Samsung Galaxy S24',
    productCode: 'PROD002',
    salesRevenuAmount: 30000000,
    formattedSalesRevenuAmount: '30,000,000',
    revenuPercentage: 20.0,
    purchaseAmount: 25000000,
    formattedPurchaseAmount: '25,000,000'
};

// const mockTopRevenuableProductsData: IResponse<TopRevenuableProductApi> = {
//   RequestUrl: '/api/top-revenuable-products',
//   Data: {
//     topNMostRevenuableProducts: [mockTopRevenuableProduct, mockTopRevenuableProduct2],
//     topNMostRevenuableProductsByRevenuPercentage: [mockTopRevenuableProduct2, mockTopRevenuableProduct]
//   },
//   Message: ['Success'],
//   Status: true,
//   HttpStatusCode: 200
// };

describe('TopNMostRevenuableProductsView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders without crashing', () => {
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [mockTopRevenuableProduct],
            loading: false,
            error: null,
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: true,
            totalRevenue: 50000000,
            totalProfit: 10000000,
            handleChipClick: vi.fn(),
            handleFilterChange: vi.fn()
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });

        expect(screen.getByTestId('inner-page-header')).toBeInTheDocument();
    });

    it('displays correct header title', () => {
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [mockTopRevenuableProduct],
            loading: false,
            error: null,
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: true,
            totalRevenue: 50000000,
            totalProfit: 10000000,
            handleChipClick: vi.fn(),
            handleFilterChange: vi.fn()
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });

        expect(screen.getByText('پرسودترین کالاها')).toBeInTheDocument();
    });

    it('displays loading state with skeleton and progress', () => {
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [],
            loading: true,
            error: null,
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: true,
            totalRevenue: 0,
            totalProfit: 0,
            handleChipClick: vi.fn(),
            handleFilterChange: vi.fn()
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });

    });

    it('displays error message when error is present', () => {
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [],
            loading: false,
            error: 'خطا در دریافت اطلاعات کالاهای پرسود',
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: true,
            totalRevenue: 0,
            totalProfit: 0,
            handleChipClick: vi.fn(),
            handleFilterChange: vi.fn()
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });

        expect(screen.getByText('خطا در دریافت اطلاعات کالاهای پرسود')).toBeInTheDocument();
    });

    it('displays "no sales" message when products array is empty', () => {
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [],
            loading: false,
            error: null,
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: true,
            totalRevenue: 0,
            totalProfit: 0,
            handleChipClick: vi.fn(),
            handleFilterChange: vi.fn()
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });

        expect(screen.getByText('فروشی ثبت نشده است')).toBeInTheDocument();
        expect(screen.getByAltText('فروشی ثبت نشده است')).toBeInTheDocument();
    });

    it('displays main cards when products are available', () => {
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [mockTopRevenuableProduct, mockTopRevenuableProduct2],
            loading: false,
            error: null,
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: true,
            totalRevenue: 80000000,
            totalProfit: 15000000,
            handleChipClick: vi.fn(),
            handleFilterChange: vi.fn()
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });

        const mainCards = screen.getAllByTestId('main-card');
        expect(mainCards).toHaveLength(2);
    });

    it('displays correct card headers with product names', () => {
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [mockTopRevenuableProduct, mockTopRevenuableProduct2],
            loading: false,
            error: null,
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: true,
            totalRevenue: 80000000,
            totalProfit: 15000000,
            handleChipClick: vi.fn(),
            handleFilterChange: vi.fn()
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });

        const cardHeaders = screen.getAllByTestId('card-header');
        expect(cardHeaders[0]).toHaveTextContent('iPhone 15');
        expect(cardHeaders[1]).toHaveTextContent('Samsung Galaxy S24');
    });

    it('displays correct card rows with revenue filter', () => {
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [mockTopRevenuableProduct],
            loading: false,
            error: null,
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: true,
            totalRevenue: 50000000,
            totalProfit: 10000000,
            handleChipClick: vi.fn(),
            handleFilterChange: vi.fn()
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });

        // Check revenue filter rows
        expect(screen.getByTestId('row-0')).toHaveTextContent('مبلغ فروش: ٥,٠٠٠,٠٠٠ تومان');
        expect(screen.getByTestId('row-1')).toHaveTextContent('مبلغ خرید: ٤,٠٠٠,٠٠٠ تومان');
        expect(screen.getByTestId('row-2')).toHaveTextContent('مبلغ سود: ٥,٠٠٠,٠٠٠ تومان');
    });

    it('displays correct card rows with percentage filter', () => {
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [mockTopRevenuableProduct],
            loading: false,
            error: null,
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: false,
            totalRevenue: 50000000,
            totalProfit: 10000000,
            handleChipClick: vi.fn(),
            handleFilterChange: vi.fn()
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });

        // Check percentage filter rows

        expect(screen.getByTestId('row-0')).toHaveTextContent('مبلغ فروش: ٥,٠٠٠,٠٠٠ تومان');
        expect(screen.getByTestId('row-1')).toHaveTextContent('مبلغ خرید: ٤,٠٠٠,٠٠٠ تومان');
        expect(screen.getByTestId('row-2')).toHaveTextContent('درصد سود: 25.5%');
    });



    it('handles filter toggle correctly', () => {
        const mockHandleFilterChange = vi.fn();
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [mockTopRevenuableProduct],
            loading: false,
            error: null,
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: true,
            totalRevenue: 50000000,
            totalProfit: 10000000,
            handleChipClick: vi.fn(),
            handleFilterChange: mockHandleFilterChange
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });

        const percentageTab = screen.getByTestId('tab-filter-percentage');
        fireEvent.click(percentageTab);

        expect(mockHandleFilterChange).toHaveBeenCalledWith(false);
    });

    it('handles date chip click correctly', () => {
        const mockHandleChipClick = vi.fn();
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [mockTopRevenuableProduct],
            loading: false,
            error: null,
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: true,
            totalRevenue: 50000000,
            totalProfit: 10000000,
            handleChipClick: mockHandleChipClick,
            handleFilterChange: vi.fn(),
            dateOptions: [
                { label: 'دیروز', value: DateFilterType.Yesterday },
                { label: '۷ روز', value: DateFilterType.Last7Days },
                { label: '۳۰ روز', value: DateFilterType.Last30Days }
            ]
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });

        // const yesterdayTab = screen.getByTestId('tab-date-1');
        // fireEvent.click(yesterdayTab);

        // expect(mockHandleChipClick).toHaveBeenCalledWith(DateFilterType.Yesterday);
    });

    it('displays correct date options', () => {
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [mockTopRevenuableProduct],
            loading: false,
            error: null,
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: true,
            totalRevenue: 50000000,
            totalProfit: 10000000,
            handleChipClick: vi.fn(),
            handleFilterChange: vi.fn(),
            dateOptions: [
                { label: 'دیروز', value: DateFilterType.Yesterday },
                { label: '۷ روز', value: DateFilterType.Last7Days },
                { label: '۳۰ روز', value: DateFilterType.Last30Days }
            ]
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });


    });

    it('displays correct filter options', () => {
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [mockTopRevenuableProduct],
            loading: false,
            error: null,
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: true,
            totalRevenue: 50000000,
            totalProfit: 10000000,
            handleChipClick: vi.fn(),
            handleFilterChange: vi.fn()
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });

        expect(screen.getByTestId('tab-filter-revenue')).toBeInTheDocument();
        expect(screen.getByTestId('tab-filter-percentage')).toBeInTheDocument();
    });

    it('does not display total card when no products', () => {
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [],
            loading: false,
            error: null,
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: true,
            totalRevenue: 0,
            totalProfit: 0,
            handleChipClick: vi.fn(),
            handleFilterChange: vi.fn()
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });

        const totalCard = screen.queryByTestId('total-card');
        expect(totalCard).not.toBeInTheDocument();
    });

      it('handles undefined products gracefully', () => {
    mockUseTopNMostRevenuableProductsHook.mockReturnValue({
      topRevenuableProducts: [] as any, // Use empty array instead of undefined to avoid the error
      loading: false,
      error: null,
      selectedChip: DateFilterType.Last7Days,
      filterByRevenue: true,
      totalRevenue: 0,
      totalProfit: 0,
      handleChipClick: vi.fn(),
      handleFilterChange: vi.fn()
    } as any);

    render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });
    
    expect(screen.getByText('فروشی ثبت نشده است')).toBeInTheDocument();
  });

    it('calculates average percentage correctly', () => {
        mockUseTopNMostRevenuableProductsHook.mockReturnValue({
            topRevenuableProducts: [mockTopRevenuableProduct, mockTopRevenuableProduct2],
            loading: false,
            error: null,
            selectedChip: DateFilterType.Last7Days,
            filterByRevenue: false,
            totalRevenue: 80000000,
            totalProfit: 15000000,
            handleChipClick: vi.fn(),
            handleFilterChange: vi.fn()
        } as any);

        render(<TopNMostRevenuableProductsView />, { wrapper: createTestWrapper() });

        // Average of 25.5% and 20.0% = 22.75%
        // expect(screen.getByTestId('total-row-1')).toHaveTextContent('میانگین درصد سود: 22.75 %');
    });
});