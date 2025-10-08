import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotFoundNotice from './notFoundNotification';
// import { useTheme } from '@mui/material/styles';
// import { useLocation } from 'react-router';
import useNoticeLogsHooks from '../Hooks/useNoticeHooks';
import moment from 'moment-jalaali';
import { toPersianNumber } from '@/core/helper/translationUtility';
import { NumberConverter } from '@/core/helper/numberConverter';


// --- Mocking Dependencies ---

// Mocking the useTheme hook from MUI
vi.mock('@mui/material/styles', () => ({
    useTheme: () => ({
        palette: {
            background: {
                default: '#f0f0f0',
                paper: '#ffffff',
            },
            primary: {
                light: '#6200EE',
            }
        },
    }),
}));

// Mocking react-router's useLocation hook to provide a consistent state
const mockUseLocation = vi.fn();
vi.mock('react-router', () => ({
    ...vi.importActual('react-router'),
    useLocation: () => mockUseLocation(),
}));

// Mocking the custom hook useNoticeLogsHooks
vi.mock('../Hooks/useNoticeHooks');
const mockUseNoticeLogsHooks = vi.mocked(useNoticeLogsHooks);

// Mocking helper functions to control their output
vi.mock('@/core/helper/translationUtility', () => ({
    // Update the mock to accept string | number
    toPersianNumber: vi.fn((val: string | number) => String(val)),
}));
vi.mock('@/core/helper/numberConverter', () => ({
    NumberConverter: {
        latinToArabic: vi.fn((val: string | number) => String(val)),
    },
}));
vi.mock('moment-jalaali');

// Mock all image imports to prevent Jest from trying to load them
vi.mock('@/core/assets/icones/time.svg', () => ({ default: 'time.svg' }));
vi.mock('@/core/assets/icones/calendar.svg', () => ({ default: 'calendar.svg' }));
vi.mock('/images/noticeHeaderPic.png', () => ({ default: 'noticeHeaderPic.png' }));

// Mocking the child component InnerPageHeader
vi.mock('@/core/components/innerPagesHeader', () => ({
    default: vi.fn(({ title }) => <h1 data-testid="inner-page-header">{title}</h1>),
}));


// --- Test Suite ---
describe('NotFoundNotice', () => {
    beforeEach(() => {
        // Clear all mocks and reset their implementations before each test
        vi.clearAllMocks();

        // Setup a consistent mock return value for useNoticeLogsHooks
        // It now includes all required properties as mock functions
        mockUseNoticeLogsHooks.mockReturnValue({
            formattedTime24HourNoSeconds: '10:30',
            handleBack: vi.fn(),
            handleUpdateNoticeById: vi.fn(),
            notificationsData:[]
        });

        // Setup a consistent mock for moment to return a predictable date format
        const mockMoment = vi.fn().mockReturnValue({
            format: vi.fn(() => '1402/05/11'),
        });
        vi.mocked(moment).mockImplementation(mockMoment as any);
        
        // Mock toPersianNumber to return the input directly for simple testing
        vi.mocked(toPersianNumber).mockImplementation((val) => String(val));
        
        // Mock NumberConverter to return the input directly for simple testing
        vi.mocked(NumberConverter.latinToArabic).mockImplementation((val) => String(val));
    });

    it('should render correctly with data from location state', () => {
        // Arrange
        const mockNotification = {
            created: '2023-08-02T10:30:00Z',
        };
        mockUseLocation.mockReturnValue({
            pathname: '/notice-details',
            state: { notification: mockNotification },
        });

        // Act
        render(<NotFoundNotice />);

        // Assert
        // Check if the header is rendered with the correct title
        const header = screen.getByTestId('inner-page-header');
        expect(header).toBeInTheDocument();
        expect(header).toHaveTextContent('پیام ها');

        // Check if the date and time are rendered
        expect(screen.getByText('1402/05/11')).toBeInTheDocument();
        expect(screen.getByText('10:30')).toBeInTheDocument();

        // Check for the presence of the main text content
        expect(screen.getByText(/گزارشات آنلاین هلو/)).toBeInTheDocument();
        expect(screen.getByText(/گزارشات پرکاربرد/)).toBeInTheDocument();

        // Check for the list items
        expect(screen.getByText('گردش بانک')).toBeInTheDocument();
        expect(screen.getByText('گردش صندوق')).toBeInTheDocument();
    });

    it('should handle undefined notification gracefully', () => {
        // Arrange
        mockUseLocation.mockReturnValue({
            pathname: '/notice-details',
            state: {},
        });
        
        // Act
        render(<NotFoundNotice />);
        
        // Assert
        // The component should still render the header
        expect(screen.getByTestId('inner-page-header')).toBeInTheDocument();

        // Check that a formatted date and time are rendered
        expect(screen.getByText('1402/05/11')).toBeInTheDocument();
        expect(screen.getByText('10:30')).toBeInTheDocument();

        // Main text content should be present
        expect(screen.getByText(/گزارشات آنلاین هلو/)).toBeInTheDocument();
    });
});
