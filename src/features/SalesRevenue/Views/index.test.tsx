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
      {rows.map((row, index) => <div key={index}>{row.title}</div>)}
    </div>
  ),
}));

// Mock MainCard component
vi.mock('@/core/components/MainCard/MainCard', () => ({
  __esModule: true,
  default: ({ headerTitle }: { headerTitle: string }) => (
    <div data-testid="mock-main-card">{headerTitle}</div>
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
});
