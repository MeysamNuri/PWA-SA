import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Import the component you want to test
import ButtonComponent from '../Button';

// Create a simple, mock theme for the test environment.
// This is necessary because the component uses the `useTheme` hook.
const mockTheme = createTheme({
    palette: {
        button: {
            light: '#E0E0E0',
            main: '#2196F3',
        },
        text: {
            disabled: '#A0A0A0',
        },
        primary: {
            main: '#1976D2', // Added this line to resolve the TypeScript error
            contrastText: '#FFFFFF',
        },
    },
});

// A wrapper component that provides the mock theme context.
// We'll use this to render our ButtonComponent inside the theme.
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider theme={mockTheme}>{children}</ThemeProvider>
);

describe('ButtonComponent', () => {
    // Test case 1: Check if the button renders with the correct title.
    it('should render with the provided title', () => {
        const testTitle = 'Submit Form';
        render(<ButtonComponent title={testTitle} />, { wrapper: TestWrapper });

        // Use a case-insensitive regex to find the button by its title text.
        const buttonElement = screen.getByRole('button', { name: /Submit Form/i });
        
        // Assert that the button is in the document.
        expect(buttonElement).toBeInTheDocument();
    });

    // Test case 2: Check if the button is enabled when isFormValid is true.
    it('should be enabled when isFormValid is true', () => {
        const testTitle = 'Submit Form';
        render(<ButtonComponent title={testTitle} isFormValid={true} />, { wrapper: TestWrapper });

        const buttonElement = screen.getByRole('button', { name: /Submit Form/i });
        
        // The disabled prop is set to !isFormValid, so when true, it should not be disabled.
        expect(buttonElement).not.toBeDisabled();
    });

    // Test case 3: Check if the button is disabled when isFormValid is false.
    it('should be disabled when isFormValid is false', () => {
        const testTitle = 'Submit Form';
        render(<ButtonComponent title={testTitle} isFormValid={false} />, { wrapper: TestWrapper });

        const buttonElement = screen.getByRole('button', { name: /Submit Form/i });

        // The button should be disabled when the form is not valid.
        expect(buttonElement).toBeDisabled();
    });

    // Test case 4: Check for the loading state when isPending is true.
    it('should show a loading indicator', () => {
        const testTitle = 'Submit Form';
        render(<ButtonComponent title={testTitle} isPending={true} />, { wrapper: TestWrapper });

        // When the MUI button is in a loading state, it shows a CircularProgress.
        // We can check for the progressbar role to confirm the loading indicator is present.
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toBeInTheDocument();
    });
});
