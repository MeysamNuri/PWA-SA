import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotificationsView from './index';
import useNotificationLogs from '../Hooks/APIHooks/useNotificationLogs';

// --- Mocking Dependencies ---

// Mocking the useTheme hook from MUI
vi.mock('@mui/material/styles', () => ({
    useTheme: () => ({
        palette: {
            background: {
                default: '#f0f0f0',
            },
        },
    }),
}));

// Mock the API hook to control the loading state and returned data
vi.mock('../Hooks/APIHooks/useNotificationLogs');
const mockUseNotificationLogs = vi.mocked(useNotificationLogs);

// Mock the child components to prevent them from rendering their full content.
// This isolates the test to only the NotificationsView component's logic.
vi.mock('../Components/cards', () => ({
    default: vi.fn(({ notificationsData }) => (
        <div data-testid="notice-cards">
            {JSON.stringify(notificationsData)}
        </div>
    )),
}));

vi.mock('@/core/components/innerPagesHeader', () => ({
    default: vi.fn(({ title }) => (
        <h1 data-testid="inner-page-header">{title}</h1>
    )),
}));

vi.mock('@/core/components/ajaxLoadingComponent', () => ({
    default: vi.fn(() => <div data-testid="loading-component">Loading...</div>),
}));


// --- Test Suite ---
describe('NotificationsView', () => {
    beforeEach(() => {
        // Clear all mocks before each test to ensure a clean state
        vi.clearAllMocks();
    });

    it('should render the loading component when data is pending', () => {
        // Arrange: Mock the hook to return a pending state with all required properties.
        mockUseNotificationLogs.mockReturnValue({
            notificationsData: undefined,
            isPending: true,
            isSuccess: false,
            status: 'pending',
            refetch: vi.fn(),
        });

        // Act: Render the component
        render(<NotificationsView />);

        // Assert: The loading component should be visible
        const loadingComponent = screen.getByTestId('loading-component');
        expect(loadingComponent).toBeInTheDocument();

        // Assert: Other components should not be present
        expect(screen.queryByTestId('inner-page-header')).not.toBeInTheDocument();
        expect(screen.queryByTestId('notice-cards')).not.toBeInTheDocument();
    });

    it('should render the header and cards when data has loaded', () => {
        // Arrange: Mock the hook to return mock data that matches the INotificationResponse type.
        const mockNotificationsData = [{
            id: 1,
            message: 'Test message',
            title: 'Test Title',
            description: 'Test Description',
            link: '/test-link',
            body: 'Test Body',
            createdAt: '2023-01-01T00:00:00Z',
            isRead: false,
            image: null,
            userId: 1,
            backgroundColor: '#fff',
            viewDate: null,
            created: '2023-01-01T00:00:00Z',
            url: '/test-url'
        }];
        
        mockUseNotificationLogs.mockReturnValue({
            notificationsData: mockNotificationsData as any[],
            isPending: false,
            isSuccess: true,
            status: 'success',
            refetch: vi.fn(),
        });

        // Act: Render the component
        render(<NotificationsView />);

        // Assert: The header and cards should be visible with correct props
        const header = screen.getByTestId('inner-page-header');
        expect(header).toBeInTheDocument();
        expect(header).toHaveTextContent('پیام ها'); // Check header title

        const noticeCards = screen.getByTestId('notice-cards');
        expect(noticeCards).toBeInTheDocument();
        expect(noticeCards).toHaveTextContent(JSON.stringify(mockNotificationsData)); // Check data is passed correctly

        // Assert: The loading component should not be present
        expect(screen.queryByTestId('loading-component')).not.toBeInTheDocument();
    });
});
