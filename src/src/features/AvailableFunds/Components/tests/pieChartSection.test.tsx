import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PieChartSection from '../pieChartSection';

// --- MOCK DEPENDENCIES ---
// Mock the 'toPersianNumber' utility function to ensure tests are isolated.
// We'll make it return the number as a string for simplicity in testing.
vi.mock('@/core/helper/translationUtility', () => ({
  toPersianNumber: (num: any) => num?.toString(),
}));

// Mock the '@mui/material/styles' module, specifically the useTheme hook.
// This prevents errors related to not having a ThemeProvider in the test environment.
vi.mock('@mui/material/styles', () => ({
  useTheme: () => ({
    palette: {
      text: {
        secondary: '#000', // Mock a color from the theme
      },
    },
  }),
}));

// Mock the PieChart component from @mui/x-charts to make the test simpler
// and to be able to fire events on it easily. We will replace it with a
// simple div that we can interact with.
vi.mock('@mui/x-charts/PieChart', () => ({
  PieChart: ({ onItemClick, children, series }: any) => {
    // A mock component that renders the children and passes the onItemClick handler
    // via a data attribute for testing purposes.
    return (
      <div data-testid="mock-pie-chart" onClick={() => onItemClick(null, null, series[0].data[0])}>
        {children}
      </div>
    );
  },
}));

// --- TEST SUITE ---
describe('PieChartSection', () => {
  // Define a set of default props to use in our tests.
  const mockProps = {
    handlePieClick: vi.fn(),
    bankPercentage: 75.0,
    fundPercentage: 25.0,
    selectedSegment: 'bank',
    formatedBankDisplay: '1,234,567',
    formatedfundDisplay: '987,654',
    bankTotalBalanceUOM: 'ریال',
    fundTotalBalanceUOM: 'ریال',
    currencyTab: 'toman',
  };

  // Reset all mocks before each test to ensure a clean state.
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test Case 1: Component renders correctly with default props for toman currency.
  it('should render the component and display all text elements for toman currency', () => {
    // Render the component with the mock props.
    render(<PieChartSection {...mockProps} />);
    
    // Use screen.getByText to check for various text elements.
    // We expect the percentages, labels, and formatted numbers to be on the screen.
    expect(screen.getByText('بانک')).toBeInTheDocument();
    expect(screen.getByText('نقد')).toBeInTheDocument();
    // The previous getByText fails because it finds two elements.
    // We now use getAllByText to assert that both elements with "%75" are present.
    expect(screen.getAllByText('%75')).toHaveLength(2);
    // The fund percentage is only displayed once, so we can still use getByText.
    expect(screen.getByText('%25')).toBeInTheDocument();
    expect(screen.getByText('1,234,567')).toBeInTheDocument();
    expect(screen.getByText('987,654')).toBeInTheDocument();
    expect(screen.getAllByText('ریال')[0]).toBeInTheDocument();
  });

  // Test Case 2: Component renders correctly with dollar currency.
  it('should render the component and display all text elements for dollar currency', () => {
    // Render the component with dollar currency.
    render(<PieChartSection {...mockProps} currencyTab="dollar" />);
    
    // Use screen.getByText to check for various text elements.
    // We expect the percentages, labels, and formatted numbers to be on the screen.
    expect(screen.getByText('بانک')).toBeInTheDocument();
    expect(screen.getByText('نقد')).toBeInTheDocument();
    expect(screen.getAllByText('%75')).toHaveLength(2);
    expect(screen.getByText('%25')).toBeInTheDocument();
    expect(screen.getByText('1,234,567')).toBeInTheDocument();
    expect(screen.getByText('987,654')).toBeInTheDocument();
    // In dollar tab, should display $ instead of ریال
    expect(screen.getAllByText('$')).toHaveLength(2);
  });

  // Test Case 3: The percentage text inside the chart changes based on the 'selectedSegment' prop.
  it('should display the correct percentage inside the chart based on selectedSegment', () => {
    // Test for 'bank' segment being selected.
    const { rerender } = render(<PieChartSection {...mockProps} selectedSegment="bank" />);
    // To target the text inside the chart specifically, we find the mocked chart component
    // by its data-testid and then query for the text within that component.
    expect(within(screen.getByTestId('mock-pie-chart')).getByText('%75')).toBeInTheDocument();

    // Re-render the component with 'fund' segment selected.
    rerender(<PieChartSection {...mockProps} selectedSegment="fund" />);
    // Now we expect the text inside the chart to be "%25".
    expect(within(screen.getByTestId('mock-pie-chart')).getByText('%25')).toBeInTheDocument();
  });

  // Test Case 4: The onItemClick handler is called when the chart is clicked.
  it('should call the handlePieClick prop when the pie chart is clicked', () => {
    // Mock the handlePieClick function using vi.fn() to track its calls.
    const handlePieClickMock = vi.fn();
    render(<PieChartSection {...mockProps} handlePieClick={handlePieClickMock} />);
    
    // Find our mocked PieChart component by its test ID.
    const pieChart = screen.getByTestId('mock-pie-chart');
    
    // Simulate a user click on the component.
    fireEvent.click(pieChart);
    
    // Assert that the mock function was called exactly once.
    expect(handlePieClickMock).toHaveBeenCalledTimes(1);

    // You can also assert on the arguments passed to the function if needed.
    // For our mocked component, we know it's called with the first data object.
    expect(handlePieClickMock).toHaveBeenCalledWith(null, null, { id: 0, value: 75, color: '#92e6a7', label: 'بانک' });
  });
});
