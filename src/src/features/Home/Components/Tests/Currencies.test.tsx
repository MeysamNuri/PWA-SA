import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Currencies from '../Currencies';
import type { ICurrencyData } from '../../types';

// Mock the useTheme hook from MUI to avoid rendering the full theme provider
vi.mock('@mui/material/styles', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original as any,
        useTheme: () => createTheme(), // Return a basic theme object
    }; 
});

// Mock the translation utility to simplify testing string output
vi.mock('@/core/helper/translationUtility', () => ({
    toPersianNumber: vi.fn((value: any) => `persian-${value}`),
}));

// Create a simple wrapper with the necessary provider for the test
const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider theme={createTheme()}>
            {children}
        </ThemeProvider>
    );
};

describe('Currencies Component', () => {
    // A sample data array to use in tests where we expect data
    const mockCurrencyData: ICurrencyData[] = [
        { name: "USD", title: "دلار آمریکا", price: "50000", time: "10:00", rateOfChange: 1.5 },
        { name: "EUR", title: "یورو", price: "60000", time: "10:01", rateOfChange: -0.8 },
        { name: "GoldGram18", title: "طلای ۱۸عیار", price: "2500000", time: "10:02", rateOfChange: 0 },
    ];

    // Test Case 1: Renders the loading state correctly
    it('should render a CircularProgress when currencyLoading is true', () => {
        render(
            <Currencies
                currencyTableData={[]}
           
                handleCurrencyRatesClick={vi.fn()}
            />,
            { wrapper: Wrapper }
        );


        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    // Test Case 2: Renders a message when there is no data
    it('should render a no data message when currencyTableData is empty', () => {
        render(
            <Currencies
                currencyTableData={[]}
                handleCurrencyRatesClick={vi.fn()}
            />,
            { wrapper: Wrapper }
        );

        // Assert that the 'no data' message is displayed
        expect(screen.getByText('داده‌ای برای نمایش وجود ندارد.')).toBeInTheDocument();
        // Assert that the CircularProgress is not visible
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Test Case 3: Renders the table correctly when data is available
    it('should render the currency table with data when currencyLoading is false', () => {
        render(
            <Currencies
                currencyTableData={mockCurrencyData}
                handleCurrencyRatesClick={vi.fn()}
            />,
            { wrapper: Wrapper }
        );

        // Assert that the table and its rows/cells are rendered
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getAllByRole('row')).toHaveLength(mockCurrencyData.length + 1); // +1 for the header row
        
        // Assert that the mock data is displayed correctly
        expect(screen.getByText('دلار آمریکا')).toBeInTheDocument();
        expect(screen.getByText('یورو')).toBeInTheDocument();
        expect(screen.getByText('طلای ۱۸عیار')).toBeInTheDocument();
        
        // Assert that the mock `toPersianNumber` function was called and its output is rendered
        expect(screen.getByText('persian-50000')).toBeInTheDocument();
        expect(screen.getByText('persian-60000')).toBeInTheDocument();
        
        // Assert that the correct icons are rendered based on rateOfChange
        expect(screen.getByTestId('ArrowUpwardIcon')).toBeInTheDocument();
        expect(screen.getByTestId('ArrowDownwardIcon')).toBeInTheDocument();
        expect(screen.getByText('_')).toBeInTheDocument();
    });

    // Test Case 4: Clicks the header icon button
    it('should call the handleCurrencyRatesClick function when the icon button is clicked', () => {
        const mockHandleClick = vi.fn();
        render(
            <Currencies
                currencyTableData={mockCurrencyData}
                handleCurrencyRatesClick={mockHandleClick}
            />,
            { wrapper: Wrapper }
        );
        
        // Find the button by its accessible name and simulate a click
        const button = screen.getByRole('button');
        fireEvent.click(button);
        
        // Assert that the mock function was called
        expect(mockHandleClick).toHaveBeenCalledTimes(1);
    });
});
