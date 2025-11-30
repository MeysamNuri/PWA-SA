import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import Header from './Header';
import { useThemeContext } from '@/core/context/useThemeContext';
import useLayoutHooks from '../hooks';
import useNotificationLogs from '../../../features/Notifications/Hooks/APIHooks/useNotificationLogs';

// Mock hooks and components
vi.mock('@/core/context/useThemeContext');
vi.mock('../hooks'); // only mock the hook, not Header component
vi.mock('../../../features/Notifications/Hooks/APIHooks/useNotificationLogs');
vi.mock('@/core/components/icons', () => ({
  Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />,
}));

// Partial mock for MUI to preserve styled exports
vi.mock('@mui/material/styles', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as any,
    useTheme: () => ({
      palette: { background: { default: '#fff' }, text: { primary: '#000' } },
    }),
  };
});

describe('Header component', () => {
  const mockSetSidebarOpen = vi.fn();
  const mockHandleClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useThemeContext as unknown as any).mockReturnValue({
      isDarkMode: false,
    });

    (useLayoutHooks as unknown as any).mockReturnValue({
      sidebarOpen: false,
      setSidebarOpen: mockSetSidebarOpen,
      handleClick: mockHandleClick,
    });

    (useNotificationLogs as unknown as any).mockReturnValue({
      notificationsData: {
        items: [
          { id: 1, isRead: false },
          { id: 2, isRead: true },
        ],
      },
    });
  });

 it('renders and shows notification badge count correctly', () => {
  render(<Header />);
  // Match the Arabic numeral rendered in the badge
  expect(screen.getByText('١')).toBeInTheDocument();
  expect(screen.getByTestId('icon-sidebar')).toBeInTheDocument();
  expect(screen.getByTestId('icon-holoo')).toBeInTheDocument();
  expect(screen.getByTestId('icon-notification')).toBeInTheDocument();
});


  it('opens sidebar when sidebar button is clicked', () => {
    render(<Header />);
    const sidebarButton = screen.getByTestId('icon-sidebar').parentElement!;
    fireEvent.click(sidebarButton);
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(true);
  });

  it('calls handleClick when notification button is clicked', () => {
    render(<Header />);
    const notificationButton = screen.getByTestId('icon-notification').parentElement!;
    fireEvent.click(notificationButton);
    expect(mockHandleClick).toHaveBeenCalledWith('/notifications');
  });
});
