import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from "react";

// Import the component you want to test
import DateFilter from '../DateFilter';

// Mock the custom types/enums since they are not available in the test environment.
// Corrected to use PascalCase string values to match the component's defaultOptions.
enum DateFilterType {
    Today = "Today",
    Yesterday = "Yesterday",
    Last7Days = "Last7Days",
    Last30Days = "Last30Days",
}


// Create a simple, mock theme for the test environment.
// This is necessary because the component uses the `useTheme` hook.
const mockTheme = createTheme({
    palette: {
        mode: 'light', // Set default mode to light for testing
        button: {
            main: '#E42628',
        },
        text: {
            secondary: '#484B51',
        },
        background: {
            default: '#ECEFF1',
        },
        divider: '#F3F5F6',
    },
});

// A wrapper component that provides the mock theme context.
const TestWrapper: React.FC<{ children: React.ReactNode; darkMode?: boolean }> = ({ children, darkMode = false }) => {
    const theme = createTheme({
        ...mockTheme,
        palette: {
            ...mockTheme.palette,
            mode: darkMode ? 'dark' : 'light',
        },
    });
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

describe('DateFilter', () => {
    // Test case 1: Renders with default options and correct labels.
    it('should render with default options', () => {
        render(<DateFilter value={DateFilterType.Today} onChange={() => {}} />, { wrapper: TestWrapper });

        expect(screen.getByRole('button', { name: '۳۰ روز گذشته' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '۷ روز گذشته' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'دیروز' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'فروش امروز' })).toBeInTheDocument();
    });

    // Test case 2: Renders with custom options.
    it('should render with custom options when provided', () => {
        const customOptions = [
            { label: "Option A", value: "a" },
            { label: "Option B", value: "b" }
        ];
        render(<DateFilter value="a" onChange={() => {}} options={customOptions} />, { wrapper: TestWrapper });

        expect(screen.getByRole('button', { name: 'Option A' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Option B' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: '۳۰ روز گذشته' })).not.toBeInTheDocument();
    });

    // Test case 3: Calls onChange with the correct value when a button is clicked.
    it('should call onChange with the correct value when a button is clicked', () => {
        const handleChange = vi.fn();
        render(<DateFilter value={DateFilterType.Today} onChange={handleChange} />, { wrapper: TestWrapper });

        const last7DaysButton = screen.getByRole('button', { name: '۷ روز گذشته' });
        fireEvent.click(last7DaysButton);

        expect(handleChange).toHaveBeenCalledTimes(1);
        // Corrected the expectation to match the PascalCase value from the component's enum.
        expect(handleChange).toHaveBeenCalledWith(DateFilterType.Last7Days);
    });

    // Test case 4: Correctly applies active styles in light mode.
    it('should apply active styles to the selected button in light mode', () => {
        const { getByText } = render(<DateFilter value={DateFilterType.Today} onChange={() => {}} />, { wrapper: TestWrapper });

        const todayButton = getByText('فروش امروز');
        const last30DaysButton = getByText('۳۰ روز گذشته');

        // The active button should have the main button color, while the inactive one has the secondary text color.
        // Updated expectations to use RGB format for color codes.
        expect(todayButton).toHaveStyle('color: rgb(228, 38, 40)');
        expect(last30DaysButton).toHaveStyle('color: rgb(72, 75, 81)');
    });

    // Test case 5: Correctly applies active styles in dark mode.
    it('should apply active styles to the selected button in dark mode', () => {
        const { getByText } = render(<DateFilter value={DateFilterType.Today} onChange={() => {}} />, {
            wrapper: ({ children }) => <TestWrapper darkMode>{children}</TestWrapper>
        });

        const todayButton = getByText('فروش امروز');
        // In dark mode, the active button color is also `button.main`.
        // Updated expectation to use RGB format for color code.
        expect(todayButton).toHaveStyle('color: rgb(228, 38, 40)');
    });

    // Test case 6: Handles different alignment props.
    it('should render with right alignment by default', () => {
        const { container } = render(<DateFilter value={DateFilterType.Today} onChange={() => {}} />, { wrapper: TestWrapper });
        
        const boxElement = container.firstChild as HTMLElement;
        expect(boxElement).toHaveStyle('justify-content: flex-end');
    });

    it('should render with center alignment when specified', () => {
        const { container } = render(<DateFilter value={DateFilterType.Today} onChange={() => {}} align="center" />, { wrapper: TestWrapper });

        const boxElement = container.firstChild as HTMLElement;
        expect(boxElement).toHaveStyle('justify-content: center');
    });

    it('should render with left alignment when specified', () => {
        const { container } = render(<DateFilter value={DateFilterType.Today} onChange={() => {}} align="left" />, { wrapper: TestWrapper });

        const boxElement = container.firstChild as HTMLElement;
        expect(boxElement).toHaveStyle('justify-content: flex-start');
    });
});
