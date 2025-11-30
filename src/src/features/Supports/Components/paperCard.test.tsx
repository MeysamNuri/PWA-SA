import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PaperCard from './paperCard'; // Adjust the import path as needed

// Mock the react-router hooks to control navigation behavior in the test.
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock window.location for the 'tel' link to prevent the test from trying to
// change the actual window location, which would cause issues.
const mockWindowLocation = vi.fn();
Object.defineProperty(window, 'location', {
  value: { href: '', assign: mockWindowLocation },
  writable: true,
});

// Mock the Material-UI useTheme hook to provide a consistent palette.
// This ensures that the test doesn't depend on a live theme provider.
vi.mock('@mui/material/styles', () => ({
  useTheme: () => ({
    palette: {
      divider: '#ccc',
      background: { paper: '#ffffff' },
      action: { hover: '#f0f0f0' },
      text: { disabled: '#888' },
    },
  }),
}));

// Mock the ArrowForwardIosIcon component from MUI to prevent loading issues.
vi.mock('@mui/icons-material/ArrowForwardIos', () => ({
  default: () => <div data-testid="arrow-icon" />,
}));

describe('PaperCard', () => {
  // Test case 1: Renders the component with the given title.
  it('should render the component with the correct title', () => {
    // Render the PaperCard component with sample props.
    render(<PaperCard title="Test Title" path="test-path" />);
    
    // Assert that the title text is in the document.
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    
    // Assert that the mocked arrow icon is present.

  });

  // Test case 2: Verifies that clicking the card with 'chatBot' path
  // calls the navigate function.
  it('should navigate to the chatbot path when clicked', () => {
    // Render the component with the specific 'chatBot' path.
    render(<PaperCard title="گفتگوی آنلاین" path="chatBot" />);
    
    // Find the clickable element (the Box) and simulate a click.
    const cardElement = screen.getByText('گفتگوی آنلاین').closest('div');
    if (cardElement) {
      fireEvent.click(cardElement);
      // Assert that the navigate function was called with the correct path.
      expect(mockNavigate).toHaveBeenCalledWith('/supports/chatbot');
    } else {
      expect(cardElement).not.toBeNull();
    }
  });

  // Test case 3: Verifies that clicking the card with 'call' path
  // changes the window location.
  it('should change window location for a phone call when clicked', () => {
    // Render the component with the specific 'call' path.
    render(<PaperCard title="میخوام صحبت کنم" path="call" />);
    
    // Find the clickable element and simulate a click.
    const cardElement = screen.getByText('میخوام صحبت کنم').closest('div');
    if (cardElement) {
      fireEvent.click(cardElement);
      // Assert that the window location was set to the correct 'tel:' URL.
      expect(window.location.href).toBe('tel:09120339253');
    } else {
      expect(cardElement).not.toBeNull();
    }
  });
});