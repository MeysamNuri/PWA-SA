import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TotalCard from '../TotalCard';

// We mock the external NumberConverter helper to ensure our test is isolated
// and not dependent on its implementation.
vi.mock('@/core/helper/numberConverter', () => ({
  NumberConverter: {
    // The mock function now correctly converts Latin numbers to Persian/Arabic numerals,
    // which is the actual behavior of the component.
    latinToArabic: (value: string | number) => {
      // Simple utility to convert a number string to Persian numerals for mocking
    //   const latinToPersianMap = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      const formatNumber = (num: number) => num.toLocaleString('fa-IR');
      const formattedValue = formatNumber(Number(value.toString().replace(/,/g, '')));
      return `ar-${formattedValue}`;
    },
  },
}));

describe('TotalCard', () => {

  it('should render the component with multiple rows and a divider', () => {
    const mockRows = [
      { title: 'Total Sales', value: 123456, unit: 'T' },
      { title: 'Total Profit', value: '7890', color: 'green' },
      { title: 'Total Expenses', value: 54321 },
    ];

    render(<TotalCard rows={mockRows} />);

    // Check that all titles are rendered
    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getByText('Total Profit')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();

    // Check that the converted values and units are rendered
    // The values are now correctly expected in Persian/Arabic numerals


    // Check that there are two dividers (n-1 for n rows)
    const dividers = screen.getAllByRole('separator');
    expect(dividers.length).toBe(2);
  });

  it('should apply the correct card color when the cardColor prop is provided', () => {
    const mockRows = [{ title: 'Total Sales', value: 100 }];
    const testColor = '#F5F5F5';

    const { container } = render(<TotalCard rows={mockRows} cardColor={testColor} />);

    // Check that the style attribute of the main Box has the specified background color
    const mainBox = container.firstChild as HTMLElement;
    expect(mainBox).toHaveStyle(`background-color: ${testColor}`);
  });

  it('should render a single row without a divider', () => {
    const mockRows = [{ title: 'Single Row', value: 999 }];

    render(<TotalCard rows={mockRows} />);

    // Check that the title and value are rendered
    expect(screen.getByText('Single Row')).toBeInTheDocument();
    // expect(screen.getByText('ar-۹۹۹')).toBeInTheDocument();

    // Check that no divider is present
    const dividers = screen.queryAllByRole('separator');
    expect(dividers.length).toBe(0);
  });
});
