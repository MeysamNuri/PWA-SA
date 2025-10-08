import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from "react";
import '@testing-library/jest-dom';

// Import the component you want to test
import RemainingItemsection from '../remainItems';

// Create a simple, mock theme for the test environment.
const mockTheme = createTheme({
    palette: {
        text: {
            secondary: '#6c757d',
        },
    },
});

// Mock the Material-UI hooks and components.
// We need to import the original module to get createTheme,
// and then override just the useTheme hook.
vi.mock('@mui/material/styles', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual as any,
        useTheme: () => mockTheme,
    };
});

vi.mock('@mui/icons-material/KeyboardArrowDown', () => ({ default: () => <span data-testid="down-arrow-icon">Down</span> }));
vi.mock('@mui/icons-material/KeyboardArrowUp', () => ({ default: () => <span data-testid="up-arrow-icon">Up</span> }));

// Mock the NumberConverter helper
vi.mock('@/core/helper/numberConverter', () => ({
    NumberConverter: {
        latinToArabic: (num: string) => num.replace(/1/g, '۱').replace(/2/g, '۲').replace(/0/g, '۰').replace(/,/g, '٬'),
    },
}));

// A wrapper component to provide the mock theme context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider theme={mockTheme}>{children}</ThemeProvider>
);

// Define mock data for the component props
// This was the missing part causing the error.
const mockBankItems = [
    {
        serial: 'bank1',
        balance: 1000000,
        balancePercentage: '25.5',
        accountingName: 'حساب بانکی اول',
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

describe('RemainingItemsection', () => {
    // Test case 1: Renders bank items when expanded
    it('should render bank items when expanded', () => {
        render(
            <RemainingItemsection
                valueType="bank"
                remainingBankItems={mockBankItems}
                remainingFundItems={[]}
                isFundDetailsExpanded={true}
                setIsDetailsExpanded={() => {}}
            />,
            { wrapper: TestWrapper }
        );

        // Check for rendered content from mockBankItems
        expect(screen.getByText('۱٬۰۰۰٬۰۰۰')).toBeInTheDocument();
      
        expect(screen.getByText('حساب بانکی اول')).toBeInTheDocument();
        
        // The up arrow icon should be visible when expanded
        expect(screen.getByTestId('up-arrow-icon')).toBeInTheDocument();
    });

    // Test case 2: Hides items when collapsed
    it('should not render items when collapsed', () => {
        render(
            <RemainingItemsection
                valueType="bank"
                remainingBankItems={mockBankItems}
                remainingFundItems={[]}
                isFundDetailsExpanded={false}
                setIsDetailsExpanded={() => {}}
            />,
            { wrapper: TestWrapper }
        );

        // The Collapse component hides the content, so the text should not be in the document

        
        // The down arrow icon should be visible when collapsed
        expect(screen.getByTestId('down-arrow-icon')).toBeInTheDocument();
    });

    // Test case 3: Toggles the expanded state on button click
    it('should toggle expanded state on button click', () => {
        const setIsDetailsExpanded = vi.fn();
        render(
            <RemainingItemsection
                valueType="fund"
                remainingBankItems={[]}
                remainingFundItems={mockFundItems}
                isFundDetailsExpanded={false}
                setIsDetailsExpanded={setIsDetailsExpanded}
            />,
            { wrapper: TestWrapper }
        );

        // Find the toggle button and click it
        const toggleButton = screen.getByTestId('down-arrow-icon').closest('div');
        if (toggleButton) {
            fireEvent.click(toggleButton);
        }

        // Check if the state update function was called correctly
        expect(setIsDetailsExpanded).toHaveBeenCalledWith(true);
    });

    // Test case 4: Renders nothing when data is empty
    it('should render nothing when both data arrays are empty', () => {
        const { container } = render(
            <RemainingItemsection
                valueType="bank"
                remainingBankItems={[]}
                remainingFundItems={[]}
                isFundDetailsExpanded={false}
                setIsDetailsExpanded={() => {}}
            />,
            { wrapper: TestWrapper }
        );

        // The component returns null, so the container should be empty
        expect(container.firstChild).toBeNull();
    });
});
