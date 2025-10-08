import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TopNMostSoldProductsView from './index';
import { useTopNMostSoldProductsHook } from '../Hooks/topNMostSold';

// Mock the InnerPageHeader component to prevent routing errors
vi.mock('@/core/components/innerPagesHeader', () => ({
  __esModule: true,
  default: ({ title }: { title: string; path: string }) => (
    <div data-testid="mock-inner-page-header">
      Mocked Header: {title}
    </div>
  ),
}));

// Mock the custom hook to control the component's state
vi.mock('../Hooks/topNMostSold', () => ({
  useTopNMostSoldProductsHook: vi.fn(),
  DateEnum: { Yesterday: '1', Last7Days: '7', Last30Days: '30' },
}));

// Mock the components used within the main component
vi.mock('@/core/components/MainCard/MainCard', () => ({
  __esModule: true,
  default: ({ headerTitle }: { headerTitle: string; rows: any[]; isCollapsible: boolean; path: string; headerIcon: string }) => (
    <div data-testid="mock-main-card">
      {headerTitle}
    </div>
  ),
}));

vi.mock('@/core/components/TotalCard', () => ({
  __esModule: true,
  default: ({ rows }: { rows: any[] }) => (
    <div data-testid="mock-total-card">
      {rows[0].title}
    </div>
  ),
}));

vi.mock('@/core/components/ToggleTab', () => ({
  CustomToggleTab: ({ onChange }: { value: string; onChange: (value: string) => void; options: any[] }) => (
    <div data-testid="mock-toggle-tab" onClick={() => onChange('price')}>
      ToggleTab
    </div>
  ),
}));

vi.mock('@/core/components/DateFilter', () => ({
  __esModule: true,
  default: ({ onChange }: { value: string; onChange: (value: string) => void; options: any[] }) => (
    <div data-testid="mock-date-filter" onClick={() => onChange('7')}>
      DateFilter
    </div>
  ),
}));

// Mock the number converter utility
vi.mock('@/core/helper/numberConverter', () => ({
  NumberConverter: {
    latinToArabic: (num: string) => num, // Simplified mock
  },
}));

describe('TopNMostSoldProductsView', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state correctly with CircularProgress', () => {
    (useTopNMostSoldProductsHook as any).mockReturnValue({
      topSellingProducts: [],
      loading: true,
      error: '',
      selectedChip: '1',
      filterByPrice: true,
      totalPrice: 0,
      totalQuantity: 0,
      handleChipClick: vi.fn(),
      handleFilterChange: vi.fn(),
    });

    render(<TopNMostSoldProductsView />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders an error message when there is an error', () => {
    (useTopNMostSoldProductsHook as any).mockReturnValue({
      topSellingProducts: [],
      loading: false,
      error: 'Failed to fetch data.',
      selectedChip: '1',
      filterByPrice: true,
      totalPrice: 0,
      totalQuantity: 0,
      handleChipClick: vi.fn(),
      handleFilterChange: vi.fn(),
    });

    render(<TopNMostSoldProductsView />);
    expect(screen.getByText('Failed to fetch data.')).toBeInTheDocument();
  });

  it('renders the "no sales" message when there are no products', () => {
    (useTopNMostSoldProductsHook as any).mockReturnValue({
      topSellingProducts: [],
      loading: false,
      error: '',
      selectedChip: '1',
      filterByPrice: true,
      totalPrice: 0,
      totalQuantity: 0,
      handleChipClick: vi.fn(),
      handleFilterChange: vi.fn(),
    });

    render(<TopNMostSoldProductsView />);
    expect(screen.getByText('فروشی ثبت نشده است')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'فروشی ثبت نشده است' })).toBeInTheDocument();
  });

  it('renders the list of products and total card when data is available', () => {
    const mockProducts = [
      { id: 1, productName: 'Product A', soldQuantity: 100, formattedSoldPrice: '1000000' },
      { id: 2, productName: 'Product B', soldQuantity: 50, formattedSoldPrice: '500000' },
    ];

    (useTopNMostSoldProductsHook as any).mockReturnValue({
      topSellingProducts: mockProducts,
      loading: false,
      error: '',
      selectedChip: '1',
      filterByPrice: true,
      totalPrice: 1500000,
      totalQuantity: 150,
      handleChipClick: vi.fn(),
      handleFilterChange: vi.fn(),
    });

    render(<TopNMostSoldProductsView />);

    expect(screen.getByTestId('mock-total-card')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-main-card')).toHaveLength(2);
    expect(screen.getByText('Product A')).toBeInTheDocument();
  });
  
  it('calls handleFilterChange when CustomToggleTab is clicked', () => {
    const mockHandleFilterChange = vi.fn();
    (useTopNMostSoldProductsHook as any).mockReturnValue({
      topSellingProducts: [],
      loading: false,
      error: '',
      selectedChip: '1',
      filterByPrice: true,
      totalPrice: 0,
      totalQuantity: 0,
      handleChipClick: vi.fn(),
      handleFilterChange: mockHandleFilterChange,
    });

    render(<TopNMostSoldProductsView />);
    fireEvent.click(screen.getByTestId('mock-toggle-tab'));
    expect(mockHandleFilterChange).toHaveBeenCalledWith(true);
  });
  
  it('calls handleChipClick when DateFilter is clicked', () => {
    const mockHandleChipClick = vi.fn();
    (useTopNMostSoldProductsHook as any).mockReturnValue({
      topSellingProducts: [],
      loading: false,
      error: '',
      selectedChip: '1',
      filterByPrice: true,
      totalPrice: 0,
      totalQuantity: 0,
      handleChipClick: mockHandleChipClick,
      handleFilterChange: vi.fn(),
    });

    render(<TopNMostSoldProductsView />);
    fireEvent.click(screen.getByTestId('mock-date-filter'));
    expect(mockHandleChipClick).toHaveBeenCalledWith('7');
  });
});