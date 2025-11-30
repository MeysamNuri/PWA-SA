import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ToggleTab, { CustomToggleTab } from '../ToggleTab';

// Mock the useTheme hook to provide a consistent, testable theme object
const mockTheme = {
  palette: {
    text: {
      secondary: '#666',
    },
    background: {
      paper: '#fff',
      default: '#f0f0f0',
    },
    button: {
      main: '#3f51b5',
    },
    success: {
      light: '#e8f5e9',
    },
    error: {
      light: '#ffebee',
    },
    action: {
      hover: '#e0e0e0',
    },
  },
};
vi.mock('@mui/material', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as any,
    useTheme: () => mockTheme,
  };
});

describe('CustomToggleTab', () => {
  const mockOptions = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with default "filter" variant', () => {
    const mockOnChange = vi.fn();
    render(
      <CustomToggleTab
        value="a"
        onChange={mockOnChange}
        options={mockOptions}
      />
    );

    // Check that all buttons are rendered
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();

    // The selected button should have the "contained" variant
    const selectedButton = screen.getByTestId('tab-a');
    expect(selectedButton).toHaveAttribute('class'); // check for class presence
    expect(selectedButton.className).toContain('MuiButton-contained');

    // An unselected button should have the "outlined" variant
    const unselectedButton = screen.getByTestId('tab-b');
    expect(unselectedButton.className).toContain('MuiButton-outlined');
  });

  it('should call onChange with the correct value when a button is clicked', () => {
    const mockOnChange = vi.fn();
    render(
      <CustomToggleTab
        value="a"
        onChange={mockOnChange}
        options={mockOptions}
      />
    );
    
    // Simulate a click on an unselected button
    const buttonB = screen.getByTestId('tab-b');
    fireEvent.click(buttonB);

    // Expect the onChange function to have been called with the correct value
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('b');
  });
});

describe('ToggleTab', () => {
  const mockOptions = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with default "tab" variant', () => {
    const mockOnChange = vi.fn();
    render(
      <ToggleTab
        value="a"
        onChange={mockOnChange}
        options={mockOptions}
      />
    );

    // Check that both buttons are rendered
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();

    // The selected button should have the correct background color from the theme
    const selectedButton = screen.getByTestId('tab-a');
    expect(selectedButton).toHaveStyle(`background: ${mockTheme.palette.background.paper}`);

    // An unselected button should have the correct background color
    const unselectedButton = screen.getByTestId('tab-b');
    expect(unselectedButton).toHaveStyle(`background: ${mockTheme.palette.background.default}`);
  });

  it('should call onChange with the correct value when a button is clicked', () => {
    const mockOnChange = vi.fn();
    render(
      <ToggleTab
        value="a"
        onChange={mockOnChange}
        options={mockOptions}
      />
    );

    // Simulate a click on an unselected button
    const buttonB = screen.getByTestId('tab-b');
    fireEvent.click(buttonB);

    // Expect the onChange function to have been called with the correct value
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('b');
  });
});
