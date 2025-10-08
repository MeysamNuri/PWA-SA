import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from "react";

// Import the component you want to test
import InitialItemsSection from '../initialItems';

// Mock the useTheme hook from Material-UI
const mockTheme = createTheme({
    palette: {
        text: {
            secondary: '#6c757d',
        },
    },
});

vi.mock('@mui/material/styles', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual as any,
        useTheme: () => mockTheme,
    };
});

// Mock the NumberConverter helper since it's an external dependency
vi.mock('@/core/helper/numberConverter', () => ({
    NumberConverter: {
        latinToArabic: (num: string) => {
            // Updated the mock to correctly handle the Persian thousands separator (٬)
            return num.replace(/1/g, '۱').replace(/2/g, '۲').replace(/0/g, '۰').replace(/,/g, '٬');
        },
    },
}));

// A wrapper component to provide the mock theme context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider theme={mockTheme}>{children}</ThemeProvider>
);

// Define mock data for the component props
const mockBankItems = [
    {
        serial: 'bank1',
        balance: 1000000,
        balancePercentage: '25.5',
        accountingName: 'حساب بانکی اول',
    },
    {
        serial: 'bank2',
        balance: 2500000,
        balancePercentage: '74.5',
        accountingName: 'حساب بانکی دوم',
    },
];

const mockFundItems = [
    {
        serial: 'fund1',
        balance: 5000000,
        balancePercentage: '100',
        accountingName: 'صندوق سرمایه‌گذاری',
    },
];

describe('InitialItemsSection', () => {
    // Test case 1: Renders bank items when valueType is 'bank'
    it('should render bank items when valueType is "bank"', () => {
        render(
            <InitialItemsSection
                valueType="bank"
                initialBankItems={mockBankItems}
                initialFundItems={[]}
            />,
            { wrapper: TestWrapper }
        );

        // Check for rendered content from mockBankItems, now with the correct thousands separator
        expect(screen.getByText('۱٬۰۰۰٬۰۰۰')).toBeInTheDocument();
        expect(screen.getByText('حساب بانکی اول')).toBeInTheDocument();
     
    });

    // Test case 2: Renders fund items when valueType is 'fund'
    it('should render fund items when valueType is "fund"', () => {
        render(
            <InitialItemsSection
                valueType="fund"
                initialBankItems={[]}
                initialFundItems={mockFundItems}
            />,
            { wrapper: TestWrapper }
        );

        // Check for rendered content from mockFundItems, now with the correct thousands separator
        expect(screen.getByText('۵٬۰۰۰٬۰۰۰')).toBeInTheDocument();
    
        expect(screen.getByText('صندوق سرمایه‌گذاری')).toBeInTheDocument();
    });

    // Test case 3: Renders an empty state if no data is provided
    it('should render nothing when both data arrays are empty', () => {
        const { container } = render(
            <InitialItemsSection
                valueType="bank"
                initialBankItems={[]}
                initialFundItems={[]}
            />,
            { wrapper: TestWrapper }
        );

        // The component renders an empty fragment, so the container should not have children
        // that match the expected text content.
        expect(container.textContent).toBe('');
    });
});
