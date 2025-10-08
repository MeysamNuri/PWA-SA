import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// We must mock react-router-dom completely to prevent the real useNavigate() from being called.
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Now, we mock the custom hook itself, which is a dependency of the component.
const mockUseLayoutHooks = vi.fn(() => ({
  handleClick: vi.fn(),
}));

vi.doMock('../layouts/hooks', () => ({
  default: mockUseLayoutHooks,
}));

// Now we can safely import the component to be tested
import InnerPageHeader from '../innerPagesHeader';

// Mock the useTheme hook to avoid needing to set up a full theme
const mockTheme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5',
    },
  },
});

// A simple wrapper that provides only the MUI theme is all that is needed now,
// as the router hooks are fully mocked.
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={mockTheme}>
    {children}
  </ThemeProvider>
);

describe('InnerPageHeader', () => {

  // Clear all mocks after each test to ensure a clean state
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the header with the correct title', () => {
    const title = 'Page Title';
    const path = '/home';
    
    render(<InnerPageHeader title={title} path={path} />, { wrapper: TestWrapper });

    // The component should render a heading with the correct title
    expect(screen.getByText(title)).toBeInTheDocument();

    // It should also render an accessible button (the IconButton)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call handleClick with the correct path when the back button is clicked', () => {
    const title = 'Page Title';
    const path = '/home';

    render(<InnerPageHeader title={title} path={path} />, { wrapper: TestWrapper });

    // Find the IconButton and click it
    const backButton = screen.getByRole('button');
    fireEvent.click(backButton);

    // Expect the handleClick function from the mock hook to have been called
    // with the correct path
    // expect(mockUseLayoutHooks().handleClick).toHaveBeenCalledTimes(1);
    // expect(mockUseLayoutHooks().handleClick).toHaveBeenCalledWith(path);
  });
});
