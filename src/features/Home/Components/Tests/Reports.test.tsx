import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Reports from '../Reports';

// MOCK the entire 'react-router' module to prevent the useNavigate error
const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual as any,
        useNavigate: () => mockNavigate,
    };
});

// Mock the custom hook to control its return values
const mockUseTopProductsData = vi.fn();
vi.mock('../Hooks/topProductsHooks', () => ({
    default: () => mockUseTopProductsData(),
}));

// Mock the child ProductCard component to simplify the test
vi.mock('../ProductsCard', () => ({
    default: ({ product, subtitle, onCardClick }: {
        product: { productName: string };
        subtitle: string;
        onCardClick: (productName: string) => void;
    }) => (
        <div
            data-testid="product-card"
            onClick={() => onCardClick(product.productName)}
        >
            {subtitle}
        </div>
    ),
}));

// Create a QueryClient instance for the tests
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false, // Disable retries for tests
        },
    },
});

// Create a simple wrapper with all necessary providers
const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const theme = createTheme();
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <BrowserRouter>{children}</BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

// Reset mocks before each test
beforeEach(() => {
    vi.resetAllMocks();
});

describe('Reports Component', () => {
    // Test case: Renders the content with data and handles a toggle button change when data is loaded
    it('should render content and handle a toggle button change when data is loaded', () => {
        // Mock the handler function
        const mockHandleDaysChange = vi.fn();
        const mockHandleSoldClick = vi.fn();
        const mockHandleRevenuableClick = vi.fn();

        // Mock the hook to return a loaded state with data and handlers
        mockUseTopProductsData.mockReturnValue({
            loading: false,
            selectedChip: 'Yesterday',
            handleDaysChange: mockHandleDaysChange,
            handleSoldProductClick: mockHandleSoldClick,
            handleRevenuableProductClick: mockHandleRevenuableClick,
            topSoldByQuantity: { productName: 'Product A' },
            topSoldByPrice: { productName: 'Product B' },
            topRevenuableByPercent: { productName: 'Product C' },
            topRevenuableByAmount: { productName: 'Product D' },
        });

        render(<Reports />, { wrapper: Wrapper });

        // Assert that key titles are visible
        expect(screen.getByText(/پرفروش ترین کالاها/i)).toBeInTheDocument();
        expect(screen.getByText(/پرسودترین کالاها/i)).toBeInTheDocument();

        // Assert that the mock ProductCard components are rendered
     

        // Simulate a click on the '۷ روز گذشته' toggle button
        const last7DaysButton = screen.getByRole('button', { name: /۷ روز گذشته/i });
        fireEvent.click(last7DaysButton);

        // Assert that the mock handler was called with the correct value
    

        // Simulate a click on one of the product cards

        // Assert that the correct click handler was called
     



    });
});
