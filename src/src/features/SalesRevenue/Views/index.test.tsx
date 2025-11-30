import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SalesRevenueView from './index';
import useSalesHooks from '../Hooks/ViewHooks';

// --- Mocking Dependencies ---
// This is crucial for unit testing to isolate the component's logic.

// Mock the custom hook to control the component's state
vi.mock('../Hooks/ViewHooks', () => ({
  __esModule: true,
  default: vi.fn(),
}));

// Mock InnerPageHeader to prevent useNavigate() errors
vi.mock('@/core/components/innerPagesHeader', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <div data-testid="mock-header">{title}</div>
  ),
}));

// Mock TotalCard component
vi.mock('@/core/components/TotalCard', () => ({
  __esModule: true,
  default: ({ rows }: { rows: any[] }) => (
    <div data-testid="mock-total-card">
      {rows.map((row, index) => <div key={index}>{row.title}: {row.value} {row.unit || 'تومان'}</div>)}
    </div>
  ),
}));

// Mock MainCard component
vi.mock('@/core/components/MainCard/MainCard', () => ({
  __esModule: true,
  default: ({ headerTitle, headerValue, rows }: { headerTitle: string; headerValue: string; rows: any[] }) => (
    <div data-testid="mock-main-card">
      <div data-testid="card-header">{headerTitle}</div>
      <div data-testid="card-value">{headerValue}</div>
      <div data-testid="card-rows">
        {rows?.map((row: any, index: number) => (
          <div key={index} data-testid={`row-${index}`}>
            {row.title}: {row.value} {row.unit}
          </div>
        ))}
      </div>
    </div>
  ),
}));

// Mock AjaxLoadingComponent
vi.mock('@/core/components/ajaxLoadingComponent', () => ({
  __esModule: true,
  default: () => <div role="progressbar" data-testid="mock-loading-spinner">Loading...</div>
}));

// Mock DateFilter component and its functionality
vi.mock('@/core/components/DateFilter', () => ({
  __esModule: true,
  default: ({ value, onChange }: { value: string, onChange: (value: string) => void }) => (
    <button data-testid="mock-date-filter" onClick={() => onChange("yesterday")}>
      DateFilter - Selected: {value}
    </button>
  ),
}));

// Mock NumberConverter
vi.mock('@/core/helper/numberConverter', () => ({
  NumberConverter: {
    latinToArabic: (text: string) => {
      // Mock implementation that converts Latin to Arabic numerals
      return text.replace(/\d/g, (digit) => {
        const arabicMap: { [key: string]: string } = {
          '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
          '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
        };
        return arabicMap[digit] || digit;
      });
    },
    formatCurrency: (value: number) => {
      // Mock implementation that converts to Arabic numerals
      return value.toString().replace(/\d/g, (digit) => {
        const arabicMap: { [key: string]: string } = {
          '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
          '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
        };
        return arabicMap[digit] || digit;
      });
    }
  }
}));

// Mock translationUtility
vi.mock('@/core/helper/translationUtility', () => ({
  toPersianNumber: (value: string) => {
    // Mock implementation that converts Latin to Persian numerals
    return value.replace(/\d/g, (digit) => {
      const persianMap: { [key: string]: string } = {
        '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
        '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹'
      };
      return persianMap[digit] || digit;
    });
  }
}));

describe('SalesRevenueView', () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure a clean state
    vi.clearAllMocks();
  });

  // Test case 1: Component renders the loading state correctly.
  it('renders AjaxLoadingComponent when data is pending', () => {
    // Mock the hook to return a pending state
    (useSalesHooks as any).mockReturnValue({
      isPending: true,
      data: undefined,
      selectedDate: 'today',
      setSelectedDate: vi.fn(),
    });

    render(<SalesRevenueView />);
    
    // Expect the mocked AjaxLoadingComponent to be rendered
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  // Test case 2: Component renders with data correctly.
  it('renders TotalCard and MainCard with data', () => {
    // Mock a successful data retrieval state
    const mockData = {
      Data: {
        formattedTotalSalesAmount: '1,000,000',
        formattedTotalSalesRevenueAmount: '200,000',
        totalSalesAmountUOM: 'تومان',
        totalSalesRevenueAmountUOM: 'تومان',
        salesRevenueReport: [
          { salesDate: '2023-01-01', salesAmount: 10000, salesRevenueAmount: 2000 },
          { salesDate: '2023-01-02', salesAmount: 20000, salesRevenueAmount: 4000 },
        ],
      },
    };
    (useSalesHooks as any).mockReturnValue({
      isPending: false,
      data: mockData,
      selectedDate: 'today',
      setSelectedDate: vi.fn(),
    });

    render(<SalesRevenueView />);
    
    // Expect the mocked TotalCard and two MainCard components to be rendered
    expect(screen.getByTestId('mock-total-card')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-main-card')).toHaveLength(2);
    expect(screen.getByText('فروش و سود')).toBeInTheDocument();
  });

  // Test case 3: Component renders correctly with no sales data.
  it('renders no MainCards when there is no sales data', () => {
    // Mock the hook to return a state with an empty salesRevenueReport
    const mockData = {
      Data: {
        formattedTotalSalesAmount: '0',
        formattedTotalSalesRevenueAmount: '0',
        totalSalesAmountUOM: 'تومان',
        totalSalesRevenueAmountUOM: 'تومان',
        salesRevenueReport: [],
      },
    };
    (useSalesHooks as any).mockReturnValue({
      isPending: false,
      data: mockData,
      selectedDate: 'today',
      setSelectedDate: vi.fn(),
    });

    render(<SalesRevenueView />);
    
    // Expect TotalCard to be rendered but no MainCards
    expect(screen.getByTestId('mock-total-card')).toBeInTheDocument();
    expect(screen.queryAllByTestId('mock-main-card')).toHaveLength(0);
  });

  // Test case 4: User interaction with the DateFilter works as expected.
  it('handles date filter change correctly', () => {
    const mockSetSelectedDate = vi.fn();
    (useSalesHooks as any).mockReturnValue({
      isPending: false,
      data: null,
      selectedDate: 'yesterday',
      setSelectedDate: mockSetSelectedDate,
    });

    render(<SalesRevenueView />);
    
    // Find the mocked DateFilter component and simulate a click
    const dateFilter = screen.getByTestId('mock-date-filter');
    fireEvent.click(dateFilter);
    
    // Expect the setSelectedDate function to have been called with the new value
    expect(mockSetSelectedDate).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedDate).toHaveBeenCalledWith('yesterday');
  });

  // Test case 5: TotalCard displays correct data
  it('displays correct total card data', () => {
    const mockData = {
      Data: {
        formattedTotalSalesAmount: '1,000,000',
        formattedTotalSalesRevenueAmount: '200,000',
        totalSalesAmountUOM: 'تومان',
        totalSalesRevenueAmountUOM: 'تومان',
        salesRevenueReport: [],
      },
    };
    (useSalesHooks as any).mockReturnValue({
      isPending: false,
      data: mockData,
      selectedDate: 'today',
      setSelectedDate: vi.fn(),
    });

    render(<SalesRevenueView />);
    
    expect(screen.getByText('جمع فروش: 1,000,000 تومان')).toBeInTheDocument();
    expect(screen.getByText('جمع سود: 200,000 تومان')).toBeInTheDocument();
  });

  // Test case 6: MainCard displays correct sales data with NumberConverter
  it('displays correct sales data in MainCard with NumberConverter', () => {
    const mockData = {
      Data: {
        formattedTotalSalesAmount: '1,000,000',
        formattedTotalSalesRevenueAmount: '200,000',
        totalSalesAmountUOM: 'تومان',
        totalSalesRevenueAmountUOM: 'تومان',
        salesRevenueReport: [
          { salesDate: '2023-01-01T10:30:00', salesAmount: 10000, salesRevenueAmount: 2000 },
        ],
      },
    };
    (useSalesHooks as any).mockReturnValue({
      isPending: false,
      data: mockData,
      selectedDate: 'today',
      setSelectedDate: vi.fn(),
    });

    render(<SalesRevenueView />);
    
    // Check that the date is converted to Persian numerals (moment-jalaali format)
    expect(screen.getByTestId('card-value')).toHaveTextContent('١٤٠١/١٠/١١');
    
    // Check that the sales amounts are formatted with NumberConverter
    expect(screen.getByTestId('row-0')).toHaveTextContent('فروش: 1000 تومان');
    expect(screen.getByTestId('row-1')).toHaveTextContent('سود: 200 تومان');
  });

  // Test case 7: Handles undefined data gracefully
  it('handles undefined data gracefully', () => {
    (useSalesHooks as any).mockReturnValue({
      isPending: false,
      data: undefined,
      selectedDate: 'today',
      setSelectedDate: vi.fn(),
    });

    render(<SalesRevenueView />);
    
    // Should render TotalCard with default values
    expect(screen.getByTestId('mock-total-card')).toBeInTheDocument();
    expect(screen.getByText('جمع فروش: 0 تومان')).toBeInTheDocument();
    expect(screen.getByText('جمع سود: 0 تومان')).toBeInTheDocument();
  });

  // Test case 8: Handles null data gracefully
  it('handles null data gracefully', () => {
    (useSalesHooks as any).mockReturnValue({
      isPending: false,
      data: null,
      selectedDate: 'today',
      setSelectedDate: vi.fn(),
    });

    render(<SalesRevenueView />);
    
    // Should render TotalCard with default values
    expect(screen.getByTestId('mock-total-card')).toBeInTheDocument();
    expect(screen.getByText('جمع فروش: 0 تومان')).toBeInTheDocument();
    expect(screen.getByText('جمع سود: 0 تومان')).toBeInTheDocument();
  });

  // Test case 9: Date conversion handles various date formats
  it('handles various date formats correctly', () => {
    const mockData = {
      Data: {
        formattedTotalSalesAmount: '1,000,000',
        formattedTotalSalesRevenueAmount: '200,000',
        totalSalesAmountUOM: 'تومان',
        totalSalesRevenueAmountUOM: 'تومان',
        salesRevenueReport: [
          { salesDate: '2023-01-01', salesAmount: 10000, salesRevenueAmount: 2000 },
          { salesDate: '2023-12-31T23:59:59', salesAmount: 20000, salesRevenueAmount: 4000 },
          { salesDate: '', salesAmount: 30000, salesRevenueAmount: 6000 },
        ],
      },
    };
    (useSalesHooks as any).mockReturnValue({
      isPending: false,
      data: mockData,
      selectedDate: 'today',
      setSelectedDate: vi.fn(),
    });

    render(<SalesRevenueView />);
    
    // Should render 3 MainCards
    expect(screen.getAllByTestId('mock-main-card')).toHaveLength(3);
  });

  // Test case 10: Math.floor is applied correctly to sales amounts
  it('applies Math.floor correctly to sales amounts', () => {
    const mockData = {
      Data: {
        formattedTotalSalesAmount: '1,000,000',
        formattedTotalSalesRevenueAmount: '200,000',
        totalSalesAmountUOM: 'تومان',
        totalSalesRevenueAmountUOM: 'تومان',
        salesRevenueReport: [
          { salesDate: '2023-01-01', salesAmount: 12345, salesRevenueAmount: 2345 }, // 1234.5 -> 1234
        ],
      },
    };
    (useSalesHooks as any).mockReturnValue({
      isPending: false,
      data: mockData,
      selectedDate: 'today',
      setSelectedDate: vi.fn(),
    });

    render(<SalesRevenueView />);
    
    // Check that Math.floor is applied (12345 / 10 = 1234.5 -> 1234)
    expect(screen.getByTestId('row-0')).toHaveTextContent('فروش: 1234 تومان');
    expect(screen.getByTestId('row-1')).toHaveTextContent('سود: 234 تومان');
  });
});
