import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomeCustomizationView from './index';
import { useHomeCustomization } from '../Hooks/useHomeCustomization';
import { useNavigate } from 'react-router';
import { useTheme } from '@mui/material';

// ---- Mock dependencies ----
vi.mock('../Hooks/useHomeCustomization');
vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
}));
vi.mock('@mui/material', async (original) => {
  const actual = await original();
  return {
    ...actual as any,
    useTheme: vi.fn(),
  };
});
vi.mock('@/core/components/innerPagesHeader', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));
vi.mock('../Components/CustomizationItem', () => ({
  __esModule: true,
  default: ({ item }: any) => <div data-testid="custom-item">{item.pageName}</div>,
}));

describe('HomeCustomizationView', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useTheme as any).mockReturnValue({
      palette: { background: { default: '#fff' } },
    });
  });

  it('renders loading spinner when isLoading is true', () => {
    (useHomeCustomization as any).mockReturnValue({
      isLoading: true,
      error: null,
    });

    render(<HomeCustomizationView />);

  });

  it('renders error message when error is true', () => {
    (useHomeCustomization as any).mockReturnValue({
      isLoading: false,
      error: new Error('something went wrong'),
    });

    render(<HomeCustomizationView />);
    expect(screen.getByText('خطا در بارگذاری اطلاعات')).toBeInTheDocument();
  });

  it('renders customization items when data is loaded', () => {
    (useHomeCustomization as any).mockReturnValue({
      isLoading: false,
      error: null,
      customizationItems: [
        { pageId: '1', pageName: 'sales' },
        { pageId: '2', pageName: 'inventory' },
      ],
      toggleItem: vi.fn(),
      reorderItems: vi.fn(),
      saveCustomization: vi.fn(),
      isUpdating: false,
    });

    render(<HomeCustomizationView />);
    expect(screen.getByText('سفارشی سازی خانه')).toBeInTheDocument();
    expect(screen.getAllByTestId('custom-item')).toHaveLength(2);
  });

  it('calls saveCustomization and navigates on save button click', async () => {
    const saveCustomization = vi.fn().mockResolvedValue(undefined);
    (useHomeCustomization as any).mockReturnValue({
      isLoading: false,
      error: null,
      customizationItems: [{ pageId: '1', pageName: 'sales' }],
      toggleItem: vi.fn(),
      reorderItems: vi.fn(),
      saveCustomization,
      isUpdating: false,
    });

    render(<HomeCustomizationView />);
    const button = screen.getByRole('button', { name: 'ذخیره تنظیمات' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(saveCustomization).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('shows loading text when saving (isUpdating = true)', () => {
    (useHomeCustomization as any).mockReturnValue({
      isLoading: false,
      error: null,
      customizationItems: [],
      toggleItem: vi.fn(),
      reorderItems: vi.fn(),
      saveCustomization: vi.fn(),
      isUpdating: true,
    });

    render(<HomeCustomizationView />);
    expect(screen.getByText('در حال ذخیره...')).toBeInTheDocument();
  });
});
