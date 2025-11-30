import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CustomizationItem from '../Components/CustomizationItem';
import { useSortable } from '@dnd-kit/sortable';
import { useThemeContext } from '@/core/context/useThemeContext';
import { useTheme } from '@mui/material';

// --- Mock heavy dependencies ---
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: vi.fn(),
}));

vi.mock('@/core/context/useThemeContext', () => ({
  useThemeContext: vi.fn(),
}));

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    useTheme: vi.fn(),
  };
})

vi.mock('@mui/icons-material', () => {
  const MockDragIndicator = () => <span data-testid="drag-indicator" />;
  return { DragIndicator: MockDragIndicator };
});

vi.mock('@/core/components/icons', () => ({
  Icon: ({ name }: any) => <span data-testid="custom-icon">{name}</span>,
}));

describe('CustomizationItem', () => {
  const mockSetNodeRef = vi.fn();
  const mockOnToggle = vi.fn();

  // Full HomeCustomizationItem mock with required 'sort'
  const item = {
    pageId: '1',
    pageName: 'sales',
    persianTitle: 'فروش',
    isEnabled: true,
    sort: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useSortable as any).mockReturnValue({
      attributes: {},
      listeners: {},
      setNodeRef: mockSetNodeRef,
      transform: null,
      transition: '0.2s',
      isDragging: false,
    });

    (useThemeContext as any).mockReturnValue({
      isDarkMode: false,
    });

    (useTheme as any).mockReturnValue({
      palette: {
        background: { paper: '#fff' },
        text: { primary: '#000', secondary: '#888' },
        action: { hover: '#eee' },
      },
    });
  });

  it('renders title and custom icon', () => {
    render(<CustomizationItem item={item} onToggle={mockOnToggle} />);

    // Check title
    expect(screen.getByText('فروش')).toBeInTheDocument();

    // Check custom Icon
    expect(screen.getByTestId('custom-icon')).toHaveTextContent('truecheckbox');

    // Check DragIndicator
    expect(screen.getByTestId('drag-indicator')).toBeInTheDocument();
  });

  it('calls onToggle when title is clicked', () => {
    render(<CustomizationItem item={item} onToggle={mockOnToggle} />);

    fireEvent.click(screen.getByText('فروش'));
    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });

  it('calls onToggle when icon button is clicked', () => {
    render(<CustomizationItem item={item} onToggle={mockOnToggle} />);

    const iconButton = screen.getByRole('button');
    fireEvent.click(iconButton);
    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });

  it('applies correct style when isDragging is true', () => {
    (useSortable as any).mockReturnValueOnce({
      attributes: {},
      listeners: {},
      setNodeRef: mockSetNodeRef,
      transform: { x: 10, y: 5 },
      transition: '0.2s',
      isDragging: true,
    });

    render(<CustomizationItem item={item} onToggle={mockOnToggle} />);

    const container = screen.getByText('فروش').parentElement;
    expect(container).toHaveStyle('opacity: 0.5');
    expect(container).toHaveStyle('transition: 0.2s');
  });
});
