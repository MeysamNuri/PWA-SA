import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import GetInSaleOutOfStockProductsView from './index';
import type { OutOfStockProductResponse } from '../types';
import getInSaleOutOfStockProductsHooks from '../Hooks/getInSaleOutOfStockProducts';

// Mock the custom hook and components to isolate the component being tested
vi.mock('../Hooks/getInSaleOutOfStockProducts', () => ({
  default: vi.fn(),
}));

vi.mock('@/core/components/MainCard/MainCard', () => ({
  default: ({ headerTitle, onToggle, rows, isExpanded }: any) => (
    <div data-testid="main-card">
      <div data-testid="card-header">{headerTitle}</div>
      <div data-testid="card-expanded">{isExpanded ? 'expanded' : 'collapsed'}</div>
      <button data-testid="toggle-button" onClick={onToggle}>Toggle</button>
      <div data-testid="card-rows">
        {rows.map((row: any, index: number) => (
          <div key={index}>{row.title}: {row.value}</div>
        ))}
      </div>
    </div>
  ),
}));

vi.mock('@/core/components/innerPagesHeader', () => ({
  default: ({ title }: any) => <h1 data-testid="inner-page-header">{title}</h1>,
}));

vi.mock('@/core/components/ajaxLoadingComponent', () => ({
  default: () => <div data-testid="loading-component">Loading...</div>,
}));

// Setup a consistent test environment wrapper
const createTestWrapper = () => {
  const queryClient = new QueryClient();
  const theme = createTheme();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Mock data for tests
const mockProduct1: OutOfStockProductResponse = {
  productCode: 'PROD001',
  productName: 'iPhone 15',
  needQuantity: 10,
  exist: 0,
  salesQuantity: 5,
  purchasePrice: 8000000,
  salesUnitPrice: 10000000,
  averageSalesUnitPrice: 9500000,
  mainGroupCode: '', mainGroupName: '', sideGroupCode: '', sideGroupName: '', productCode2: '', formattedPurchasePrice: '', purchasePriceUOM: '', salesPrice: 0, formattedSalesPrice: '', salesPriceUOM: '', formattedAverageSalesUnitPrice: '', averageSalesUnitPriceUOM: '', formattedSalesUnitPrice: '', salesUnitPriceUOM: '', salesAmount: 0, formattedSalesAmount: '', salesAmountUOM: '', salesRevenue: 0, formattedSalesRevenue: '', salesRevenueUOM: ''
};
const mockProduct2: OutOfStockProductResponse = {
  ...mockProduct1,
  productCode: 'PROD002',
  productName: 'Samsung Galaxy S24',
  needQuantity: 8,
};

const mockGetInSaleOutOfStockProductsHooks = vi.mocked(getInSaleOutOfStockProductsHooks);

describe('GetInSaleOutOfStockProductsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading component when data is pending', () => {
    mockGetInSaleOutOfStockProductsHooks.mockReturnValue({
      isPending: true,
      products: [],
    } as any);

    render(<GetInSaleOutOfStockProductsView />, { wrapper: createTestWrapper() });
    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
  });

  it('should display error message when data fetching fails', () => {
    mockGetInSaleOutOfStockProductsHooks.mockReturnValue({
      isError: true,
      products: [],
    } as any);

    render(<GetInSaleOutOfStockProductsView />, { wrapper: createTestWrapper() });
    expect(screen.getByText('خطا در دریافت اطلاعات')).toBeInTheDocument();
  });

  it('should display "no products" message when products list is empty', () => {
    mockGetInSaleOutOfStockProductsHooks.mockReturnValue({
      isPending: false,
      isError: false,
      products: [],
      sortedProducts: [],
    } as any);

    render(<GetInSaleOutOfStockProductsView />, { wrapper: createTestWrapper() });
    expect(screen.getByText('کالایی پرفروش موجود نیست')).toBeInTheDocument();
  });

  it('should render products with correct data and handle card expansion', () => {
    const setExpandedCard = vi.fn();
    mockGetInSaleOutOfStockProductsHooks.mockReturnValue({
      isPending: false,
      isError: false,
      products: [mockProduct1, mockProduct2],
      sortedProducts: [mockProduct1, mockProduct2], // Assuming hook returns sorted data
      expandedCard: 0,
      setExpandedCard,
    } as any);

    render(<GetInSaleOutOfStockProductsView />, { wrapper: createTestWrapper() });

    // Verify header and products are rendered
    expect(screen.getByTestId('inner-page-header')).toHaveTextContent('کالا های پرفروش ناموجود');
    const mainCards = screen.getAllByTestId('main-card');
    expect(mainCards).toHaveLength(2);

    // Verify data for the first card
    // const firstCardHeader = screen.getByTestId('card-header');
    // expect(firstCardHeader).toHaveTextContent('iPhone 15');

    const firstCardRows = screen.getAllByTestId('card-rows')[0];
    expect(firstCardRows).toHaveTextContent('کسری: 10');
    expect(firstCardRows).toHaveTextContent('فعلی: 0');
    expect(firstCardRows).toHaveTextContent('فروخته: 5');

    // Verify card expansion functionality
    const toggleButton = screen.getAllByTestId('toggle-button')[0];
    fireEvent.click(toggleButton);
    expect(setExpandedCard).toHaveBeenCalledWith(null);
  });
});