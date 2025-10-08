import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import HomeView from './homeView';

// Mock the custom hook to provide controlled, predictable data for testing.
// This prevents the test from needing to know how the hook works internally.
vi.mock('../Hooks/homeHooks', () => ({
    __esModule: true,
    default: vi.fn(() => ({
        // Mock data to be returned by the hook
        currencyTableData: [{
            name: "USD",
            title: "دلار",
            price: 50000
        }],
        currencyLoading: false,
        handleCurrencyRatesClick: vi.fn(),
        cardsData: [{
            title: "فروش",
            value: 1000
        }],
    })),
}));

// Mock each child component to ensure we're only testing the HomeView component itself.
// We use a simple component with a test ID to make it easy to find in the DOM.
vi.mock('../Components/DynamicCards', () => ({
    __esModule: true,
    default: vi.fn(({ cardsData }) => (
        <div data-testid="dynamic-card-mock">
            Mocked DynamicCard
            <span data-testid="dynamic-card-props">{JSON.stringify(cardsData)}</span>
        </div>
    )),
}));

vi.mock('../Components/Reports', () => ({
    __esModule: true,
    default: vi.fn(() => <div data-testid="reports-mock">Mocked Reports</div>),
}));

vi.mock('../Components/Currencies', () => ({
    __esModule: true,
    default: vi.fn(({ currencyTableData, currencyLoading }) => (
        <div data-testid="currencies-mock">
            Mocked Currencies
            <span data-testid="currencies-props">
                {JSON.stringify({ currencyTableData, currencyLoading })}
            </span>
        </div>
    )),
}));


// Create a simple wrapper with the necessary provider for the test
const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider theme={createTheme()}>
            {children}
        </ThemeProvider>
    );
};

describe('HomeView', () => {
    // This test ensures that the HomeView component renders all its child components.
    it('should render DynamicCard, Reports, and Currencies components', () => {
        render(<HomeView />, { wrapper: Wrapper });

        // Assert that each mocked component is present in the document.
        expect(screen.getByTestId('dynamic-card-mock')).toBeInTheDocument();
        expect(screen.getByTestId('reports-mock')).toBeInTheDocument();
        expect(screen.getByTestId('currencies-mock')).toBeInTheDocument();
    });

    // This test verifies that the HomeView component correctly passes props to its children.
    it('should pass correct props to its child components', () => {
        render(<HomeView />, { wrapper: Wrapper });

        // Retrieve the mocked props from the rendered components and compare them
        // to our expected mock data from the `useHomeHooks` hook.
        const dynamicCardProps = JSON.parse(screen.getByTestId('dynamic-card-props').textContent || '{}');
        const currenciesProps = JSON.parse(screen.getByTestId('currencies-props').textContent || '{}');

        // Assertions for DynamicCard props
        expect(dynamicCardProps).toEqual([{
            title: "فروش",
            value: 1000
        }]);

        // Assertions for Currencies props
        expect(currenciesProps).toEqual({
            currencyTableData: [{
                name: "USD",
                title: "دلار",
                price: 50000
            }],
            currencyLoading: false
        });
    });
});
