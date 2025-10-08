import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router'; // Note: Importing from "react-router"
import ProtectedRoute from '../ProtectedRoute';

// The key fix is to mock the "react-router" package directly,
// as this is what your component is importing.
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as any,
    // We spy on the Navigate and Outlet components to check if they are rendered
    Navigate: vi.fn(({ to, replace }) => <div data-testid="navigate" data-to={to} data-replace={replace ? "true" : "false"}>Navigate Mock</div>),
    Outlet: vi.fn(() => <div data-testid="outlet">Outlet Mock</div>),
  };
});

// Mock localStorage to control the authentication state.
const localStorageMock = {
  getItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('ProtectedRoute', () => {

  // Clean up mocks after each test
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Outlet component when the user is authenticated', () => {
    // Set up the mock to return a token, simulating an authenticated user
    localStorageMock.getItem.mockReturnValue('some-auth-token');

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute />
      </MemoryRouter>
    );

    // The component should render the mocked Outlet component
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  it('should navigate to the login page when the user is not authenticated', () => {
    // Set up the mock to return null, simulating an unauthenticated user
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute />
      </MemoryRouter>
    );

    // The component should render the mocked Navigate component with the correct props
    const navigateComponent = screen.getByTestId('navigate');
    expect(navigateComponent).toBeInTheDocument();
    expect(navigateComponent).toHaveAttribute('data-to', '/login');
    // We expect the replace attribute to be a string "true" in the mock
    expect(navigateComponent).toHaveAttribute('data-replace', 'true');
    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
  });
});
