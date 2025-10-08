
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PieChartSection from '../pieChartSection';

// Mock the Material-UI PieChart component to simplify testing.
// We don't need to test the internal workings of the library,
// just that our component passes the correct props to it.
vi.mock('@mui/x-charts/PieChart', () => ({
    PieChart: vi.fn(({ onItemClick, series, ...props }) => (
        <svg
            data-testid="mock-pie-chart"
            onClick={() => onItemClick(null, { dataIndex: 0 })}
            {...props}
        >
            {/* Mocking the text element to test the displayed percentage */}
            <text data-testid="chart-text" x={50} y={50}>
                {series[0]?.data[0]?.value}
            </text>
        </svg>
    )),
}));

// Mock the custom helper function to control its output and simplify assertions.
vi.mock('@/core/helper/translationUtility', () => ({
    toPersianNumber: (num:any) => num, // Simply return the number for easy testing
}));


describe('PieChartSection', () => {

    // Define mock props to be used in tests.
    const mockProps = {
        handlePieClick: vi.fn(),
        bankPercentage: 75,
        fundPercentage: 25,
        selectedSegment: 'bank',
        formatedBankDisplay: '10,000,000 ریال',
        formatedfundDisplay: '5,000,000 ریال',
    };

    it('renders the component without crashing', () => {
        render(<PieChartSection {...mockProps} />);
        expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
    });

    it('displays the correct bank and fund information', () => {
        render(<PieChartSection {...mockProps} />);

        // Check if the formatted display texts are present
        expect(screen.getByText('10,000,000 ریال')).toBeInTheDocument();
        expect(screen.getByText('5,000,000 ریال')).toBeInTheDocument();

        // Check for the percentage labels (using the mocked toPersianNumber)
        expect(screen.getByText('%75')).toBeInTheDocument();
        expect(screen.getByText('%25')).toBeInTheDocument();
    });

    it('displays the correct percentage in the center of the chart based on selectedSegment', () => {
        // Test with selectedSegment set to 'bank'
        const { rerender } = render(<PieChartSection {...mockProps} />);
        const bankText = screen.getByText(/%75/);
        expect(bankText).toBeInTheDocument();

        // Test with selectedSegment set to 'fund'
        rerender(<PieChartSection {...mockProps} selectedSegment="fund" />);
        const fundText = screen.getByText(/%25/);
        expect(fundText).toBeInTheDocument();
    });

    it('calls handlePieClick when the chart is clicked', () => {
        render(<PieChartSection {...mockProps} />);
        
        // Find the mocked chart element by its test ID and click it.
        const mockPieChart = screen.getByTestId('mock-pie-chart');
        fireEvent.click(mockPieChart);
        
        // Assert that the mock function was called.
        expect(mockProps.handlePieClick).toHaveBeenCalledTimes(1);
    });
});
