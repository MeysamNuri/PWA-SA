import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DateFilterToggleTab from '../dateFilterToggleTab'; // Adjust the import path

const theme = createTheme();

describe('DateFilterToggleTab', () => {
  const mockOptions = [
    { label: 'Option A', value: 'optionA' },
    { label: 'Option B', value: 'optionB' },
    { label: 'Option C', value: 'optionC' },
  ];
  const mockOnChange = vi.fn();

  it('should render all options as toggle buttons', () => {
    render(
      <ThemeProvider theme={theme}>
        <DateFilterToggleTab
          value="optionA"
          onChange={mockOnChange}
          options={mockOptions}
        />
      </ThemeProvider>
    );

    // Assert that each option's label is rendered as a button
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('should have the correct option selected based on the `value` prop', () => {
    render(
      <ThemeProvider theme={theme}>
        <DateFilterToggleTab
          value="optionB"
          onChange={mockOnChange}
          options={mockOptions}
        />
      </ThemeProvider>
    );

    // The selected button will have a class `Mui-selected`
    const selectedButton = screen.getByText('Option B');
    expect(selectedButton).toHaveClass('Mui-selected');

    const unselectedButton = screen.getByText('Option A');
    expect(unselectedButton).not.toHaveClass('Mui-selected');
  });

  it('should call the onChange handler with the correct value when a button is clicked', () => {
    render(
      <ThemeProvider theme={theme}>
        <DateFilterToggleTab
          value="optionA"
          onChange={mockOnChange}
          options={mockOptions}
        />
      </ThemeProvider>
    );

    // Click on the 'Option C' button
    const optionCButton = screen.getByText('Option C');
    fireEvent.click(optionCButton);

    // Assert that the onChange function was called with the correct value
    // The second argument of the `onChange` is the new value
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.any(Object), // The mock event object
      'optionC'
    );
  });
});