import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from "react";

// Import the component you want to test
import NotFound from '../NotFound';

// Mock the useNavigate hook from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual as any,
        useNavigate: () => mockNavigate,
    };
});

// Create a simple, mock theme for the test environment.
// This is necessary because the component uses the `useTheme` hook.
const mockTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#f5f5f5',
        },
        text: {
            primary: '#000000',
            secondary: '#6c757d',
        },
        error: {
            main: '#dc3545',
        },
        primary: {
            main: '#007bff',
            dark: '#0056b3',
            contrastText: '#ffffff',
        },
    },
});

// A wrapper component that provides the mock theme context.
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider theme={mockTheme}>{children}</ThemeProvider>
);

describe('NotFound', () => {
    // Test case 1: Renders all the correct text elements.
    it('should render the "404 Not Found" page with all text elements', () => {
        // Render the component within the mock theme provider
        render(<NotFound />, { wrapper: TestWrapper });

        // Assert that the main 404 text is in the document
        expect(screen.getByText('404')).toBeInTheDocument();

        // Assert that the main header is in the document (in Persian)
        expect(screen.getByText('صفحه مورد نظر پیدا نشد')).toBeInTheDocument();

        // Assert that the body text is in the document (in Persian)
        expect(screen.getByText('متاسفیم، صفحه‌ای که به دنبال آن بودید وجود ندارد.')).toBeInTheDocument();

        // Assert that the button to go back home is in the document
        expect(screen.getByRole('button', { name: 'بازگشت به صفحه اصلی' })).toBeInTheDocument();
    });

    // Test case 2: Button click triggers navigation to the home page.
    it('should navigate to the home page when the button is clicked', () => {
        // Render the component
        render(<NotFound />, { wrapper: TestWrapper });

        // Find the "back to home" button
        const homeButton = screen.getByRole('button', { name: 'بازگشت به صفحه اصلی' });

        // Simulate a user click on the button
        fireEvent.click(homeButton);

        // Assert that the mock navigate function was called with the correct path
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
