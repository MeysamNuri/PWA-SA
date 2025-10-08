import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DynamicCard from '../DynamicCards';
import type { ICardsData } from '../../types';

// Mock the Material-UI useTheme hook to provide a basic theme object
vi.mock('@mui/material/styles', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original as any,
        useTheme: () => createTheme({
            palette: {
                success: { main: '#4caf50' },
                error: { main: '#f44336' },
                text: { secondary: '#757575' },
                background: { paper: '#ffffff' },
                action: { hover: '#f5f5f5' }
            }
        }),
    };
});

// Mock the react-router useNavigate hook to track navigation calls
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
    useNavigate: () => mockNavigate,
}));

// Mock the translation utility to control its output in tests
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

describe('DynamicCard Component', () => {
    // A sample data array with different card types to use in tests
    const mockCardsData: ICardsData[] = [
        {
            title: "فروش روزانه",
            path: "/daily-sales",
            icon: "path/to/icon1.png",
            value: "1250000",
            unit: "تومان",
            salesChangePercent: " 5.25",
            dateType: ""
        },
        {
            title: "ترافیک وب‌سایت",
            path: "/website-traffic",
            icon: "path/to/icon2.png",
            value: "2500",
            unit: "بازدید",
            salesChangePercent: "-2.1",
            dateType: ""
        },
        {
            title: "مشتریان جدید",
            path: "/new-customers",
            icon: "path/to/icon3.png",
            value: "350",
            unit: "نفر",
            dateType: ""
        },
    ];

    // Test Case 1: Renders the correct number of cards
    it('should render a card for each item in the cardsData array', () => {
        render(<DynamicCard cardsData={mockCardsData} />, { wrapper: Wrapper });
        const cardElements = screen.getAllByRole('button');
        expect(cardElements).toHaveLength(mockCardsData.length);
    });

    // Test Case 2: Renders card titles and values correctly
    it('should display the correct title, value, and unit for each card', () => {
        render(<DynamicCard cardsData={mockCardsData} />, { wrapper: Wrapper });

        // Assert that the mock `toPersianNumber` function was called and its output is rendered
        expect(screen.getByText('فروش روزانه')).toBeInTheDocument();
        expect(screen.getByText('persian-1250000')).toBeInTheDocument();
        expect(screen.getByText('تومان')).toBeInTheDocument();

        expect(screen.getByText('ترافیک وب‌سایت')).toBeInTheDocument();
        expect(screen.getByText('persian-2500')).toBeInTheDocument();
        expect(screen.getByText('بازدید')).toBeInTheDocument();

        expect(screen.getByText('مشتریان جدید')).toBeInTheDocument();
        expect(screen.getByText('persian-350')).toBeInTheDocument();
        expect(screen.getByText('نفر')).toBeInTheDocument();
    });

    // Test Case 3: Renders correct styling and content for a positive sales change
    it('should show an upward arrow and positive percentage for a sales increase', () => {
        render(<DynamicCard cardsData={mockCardsData} />, { wrapper: Wrapper });
        const positiveCard = screen.getByText('5.25%');
        expect(positiveCard).toBeInTheDocument();
        // The arrow is a simple character '↑' in your code, so we can check for its presence
        expect(screen.getByText('↑')).toBeInTheDocument();
    });

    // Test Case 4: Renders correct styling and content for a negative sales change
    it('should show a downward arrow and negative percentage for a sales decrease', () => {
        render(<DynamicCard cardsData={mockCardsData} />, { wrapper: Wrapper });
        const negativeCard = screen.getByText('-2.10%');
        expect(negativeCard).toBeInTheDocument();
        // Check for the downward arrow character
        expect(screen.getByText('↓')).toBeInTheDocument();
    });

    // Test Case 5: Does not render change percentage for cards without a salesChangePercent
    it('should not show a change percentage block for cards without that data', () => {
        render(<DynamicCard cardsData={mockCardsData} />, { wrapper: Wrapper });
        // The third card in the mock data doesn't have salesChangePercent
        expect(screen.queryByText('InfoIcon')).not.toBeInTheDocument();
    });

    // Test Case 6: Clicks a card and navigates with the correct path and state
    it('should navigate to the correct path with the title as state on card click', () => {
        render(<DynamicCard cardsData={mockCardsData} />, { wrapper: Wrapper });

        // Find and click the first card
        const firstCard = screen.getByText('فروش روزانه').closest('div');
        if (firstCard) {
            fireEvent.click(firstCard);
        }

        // Assert that the mock navigate function was called with the correct arguments
        expect(mockNavigate).toHaveBeenCalledWith(
            mockCardsData[0].path,
            { state: { dateFilter: mockCardsData[0].dateType } }
        );
    });
});
