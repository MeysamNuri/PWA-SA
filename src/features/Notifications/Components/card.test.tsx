import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NoticeCards from './cards'; // Adjust the import path as needed
import type { INotificationResponse } from '../types'; // Adjust the import path as needed

// Mock the core dependencies
vi.mock('@mui/material', () => ({
    Box: vi.fn(({ children }) => <div data-testid="mock-box">{children}</div>),
    Card: vi.fn(({ onClick, children }) => <div data-testid="mock-card" onClick={onClick}>{children}</div>),
    Typography: vi.fn(({ children }) => <span data-testid="mock-typography">{children}</span>),
    IconButton: vi.fn(({ children }) => <button data-testid="mock-icon-button">{children}</button>),
    useTheme: vi.fn(() => ({
        palette: {
            primary: {
                light: '#000',
                main: '#333'
            }
        }
    })),
}));

// Mock the icon and helper functions
vi.mock('@mui/icons-material/ArrowBackIosNew', () => ({
    default: () => <svg data-testid="mock-arrow-icon" />,
}));
vi.mock('@/core/helper/numberConverter', () => ({
    NumberConverter: {
        latinToArabic: vi.fn((val) => val),
    },
}));
vi.mock('moment-jalaali', () => ({
    default: vi.fn(() => ({
        format: vi.fn(() => '1402/01/01'), // Mock the formatted date
    })),
}));

// Mock the custom hook to control its return values
const mockHandleUpdateNoticeById = vi.fn();
vi.mock('../Hooks/useNoticeHooks', () => ({
    default: () => ({
        handleUpdateNoticeById: mockHandleUpdateNoticeById,
    }),
}));

const mockNotifications: INotificationResponse[] = [
    {
        id: "1",
        title: "test",
        description: "test",
        link: "",
        body: "",
        isRead: false,
        backgroundColor: "red",
        viewDate: "",
        jalaliDate: "",
        created: "",
        url: "",
    },

];

describe('NoticeCards', () => {
    // Test case to ensure the component renders correctly with data
    it('should render a list of notice cards when data is provided', () => {
        render(<NoticeCards notificationsData={mockNotifications} />);

        // Assert that the "no messages" text is not present
        const noMessagesText = screen.queryByText('هیچ پیامی موجود نیست');
        expect(noMessagesText).not.toBeInTheDocument();
    });

    // Test case to ensure the component renders a message when data is empty
    it('should render a "no messages" message when the notificationsData array is empty', () => {
        render(<NoticeCards notificationsData={[]} />);

        // Assert that the "no messages" text is present
        const noMessagesText = screen.getByText('هیچ پیامی موجود نیست');
        expect(noMessagesText).toBeInTheDocument();

        // Assert that no cards are rendered
        const noticeCards = screen.queryAllByTestId('mock-card');
        expect(noticeCards).toHaveLength(0);
    });

    // Test case to ensure the component renders a message when data is undefined
    it('should render a "no messages" message when notificationsData is undefined', () => {
        render(<NoticeCards />);

        // Assert that the "no messages" text is present
        const noMessagesText = screen.getByText('هیچ پیامی موجود نیست');
        expect(noMessagesText).toBeInTheDocument();

        // Assert that no cards are rendered
        const noticeCards = screen.queryAllByTestId('mock-card');
        expect(noticeCards).toHaveLength(0);
    });

    // Test case to check if handleUpdateNoticeById is called on click
    it('should call handleUpdateNoticeById when a card is clicked', () => {
        render(<NoticeCards notificationsData={mockNotifications} />);

        // Get all the mock cards
        const noticeCards = screen.getAllByTestId('mock-card');

        // Simulate a click on the first card
        fireEvent.click(noticeCards[0]);

        // Assert that the mock function was called with the correct notice object
        expect(mockHandleUpdateNoticeById).toHaveBeenCalledTimes(1);
        expect(mockHandleUpdateNoticeById).toHaveBeenCalledWith(mockNotifications[0]);
    });
});