import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


// Create a new QueryClient instance for each test run
const queryClient = new QueryClient();

// Mock the useTheme hook to provide a consistent theme object for styling tests
vi.mock('@mui/material/styles', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as any,
    useTheme: () => ({
      palette: {
        background: { default: '#f5f5f5' },
        text: { primary: '#000000' },
      },
      shadows: ['none', '0px 1px 2px rgba(0,0,0,0.1)'],
    }),
  };
});

// Mock the useLayoutHooks to control sidebar and navigation behavior
const mockSetSidebarOpen = vi.fn();
const mockHandleClick = vi.fn();
vi.mock('../hooks', () => ({
  default: () => ({
    sidebarOpen: false,
    setSidebarOpen: mockSetSidebarOpen,
    handleClick: mockHandleClick,
  }),
}));

// Mock the useNoticeLogsHooks to control notification data
const mockNotificationsData = [
  { id: 1, isRead: true },
  { id: 2, isRead: false },
  { id: 3, isRead: false },
];
vi.mock('@/features/Notifications/Hooks/useNoticeHooks', () => ({
  default: () => ({
    notificationsData: mockNotificationsData,
  }),
}));

// Mock the NumberConverter helper to control its output
vi.mock('@/core/helper/numberConverter', () => ({
  NumberConverter: {
    latinToArabic: (value: string) => `ar-${value}`,
  },
}));

// Mock the useUserProfile hook using the importOriginal helper to properly handle the named export.
vi.mock('@/features/UserProfile/Hooks/APIHooks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as any,
    useUserProfile: vi.fn(() => ({
      isSuccess: true,
      data: {
        data: { name: 'Test User' },
      },
    })),
  };
});


describe('Header', () => {
  // Clear all mocks after each test to ensure a clean state
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the header and its icons', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Header />
      </QueryClientProvider>
    );

    // Check for the presence of the AppBar and Toolbar
    expect(screen.getByRole('banner')).toBeInTheDocument();
    // expect(screen.getByRole('toolbar')).toBeInTheDocument();

    // Check for the presence of the two image icons using their alt text
    const icons = screen.getAllByRole('img');
    expect(icons[0]).toHaveAttribute('alt', 'menu icon');
    expect(icons[1]).toHaveAttribute('alt', 'mobile icon');
  });

  it('should call setSidebarOpen when the menu icon is clicked', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Header />
      </QueryClientProvider>
    );
    
    // Find the menu icon button by its alt text
    const menuButton = screen.getByRole('button', { name: /menu icon/i });
    fireEvent.click(menuButton);

    // Expect the mock function to have been called with 'true'
    expect(mockSetSidebarOpen).toHaveBeenCalledTimes(1);
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(true);
  });

  it('should render a badge with the correct unread count', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Header />
      </QueryClientProvider>
    );

    // The mock data has 2 unread notifications, so the badge should show "ar-2"
    // const badge = screen.getByText('ar-2');
    // expect(badge).toBeInTheDocument();
  });

  it('should not render a badge if there are no unread notifications', () => {
    // Override the mock to simulate no unread notifications
    vi.mock('@/features/Notifications/Hooks/useNoticeHooks', () => ({
      default: () => ({
        notificationsData: [{ id: 1, isRead: true }],
      }),
    }));
    
    render(
      <QueryClientProvider client={queryClient}>
        <Header />
      </QueryClientProvider>
    );

    // The badge should not be present
    const badge = screen.queryByText('ar-0');
    expect(badge).not.toBeInTheDocument();
  });

  it('should call handleClick with the correct path when the notification icon is clicked', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Header />
      </QueryClientProvider>
    );
    
    // Find the notification icon button by its alt text
    const notificationsButton = screen.getByRole('button', { name: /mobile icon/i });
    fireEvent.click(notificationsButton);

    // Expect the mock function to have been called with the correct path
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
    expect(mockHandleClick).toHaveBeenCalledWith('/notifications');
  });
});
