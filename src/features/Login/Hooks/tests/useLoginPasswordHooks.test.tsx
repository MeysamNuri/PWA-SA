// usePasswordLoginHook.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import usePasswordLoginHook from '../useLoginPasswordHooks'; // Adjust path to the hook being tested

// Declare specific mock functions that will be returned by the mocked API hook
let mockLoginPasswordMutate: ReturnType<typeof vi.fn>;
let mockLoginPasswordData: any;
let mockLoginPasswordIsPending: boolean;

// Mock external dependencies
vi.mock('../APIHooks/useLoginPassword', () => ({
  default: () => ({
    mutate: mockLoginPasswordMutate,
    data: mockLoginPasswordData,
    isPending: mockLoginPasswordIsPending,
  }),
}));

const mockUseNavigate = vi.fn();
const mockUseLocation = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: () => mockUseLocation(),
}));


describe('usePasswordLoginHook', () => {
  let queryClient: QueryClient; // Declare queryClient here

  // Default mock values for react-router hooks
  const defaultMockLocation = {
    pathname: '/password-login',
    search: '',
    hash: '',
    state: { phoneNumber: '09123456789' },
    key: 'testkey',
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    vi.useFakeTimers(); // Enable fake timers for useEffect testing

    // Create a new QueryClient for each test to ensure isolation
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          // Disable retries and refetchOnWindowFocus for tests
          retry: false,
          refetchOnWindowFocus: false,
        },
      },
    });

    // Initialize global mock spies and their default return values for each test
    mockLoginPasswordMutate = vi.fn();
    mockLoginPasswordData = null;
    mockLoginPasswordIsPending = false;

    mockUseNavigate.mockClear(); // Clear navigate calls
    mockUseLocation.mockReturnValue(defaultMockLocation); // Set default location state
  });

  afterEach(() => {
    vi.useRealTimers(); // Restore real timers after each test
    queryClient.clear(); // Clear QueryClient cache after each test
  });

  // Define a wrapper component for renderHook
  const createWrapper = () => {
    return function Wrapper({ children }: { children: React.ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
  };

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => usePasswordLoginHook(), { wrapper: createWrapper() });

    expect(result.current.isFormValid).toBe(false);
    expect(result.current.formData).toEqual({ password: "" });
    expect(result.current.isPending).toBe(false);
    expect(result.current.location).toEqual(defaultMockLocation);
    expect(result.current.data).toBeNull();
  });

  it('should update formData and set isFormValid to true when password is entered', () => {
    const { result } = renderHook(() => usePasswordLoginHook(), { wrapper: createWrapper() });

    // Initially, form should be invalid
    expect(result.current.isFormValid).toBe(false);
    expect(result.current.formData.password).toBe("");

    // Simulate typing a password
    act(() => {
      result.current.handleChange({ target: { value: 'testpassword' } } as React.ChangeEvent<HTMLInputElement>);
    });

    // After typing, formData should update and form should be valid
    expect(result.current.formData.password).toBe("testpassword");
    expect(result.current.isFormValid).toBe(true);
  });

  it('should set isFormValid to false when password is cleared', () => {
    const { result } = renderHook(() => usePasswordLoginHook(), { wrapper: createWrapper() });

    // First, enter a password to make the form valid
    act(() => {
      result.current.handleChange({ target: { value: 'testpassword' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.isFormValid).toBe(true);

    // Then, clear the password
    act(() => {
      result.current.handleChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    });

    // After clearing, form should be invalid again
    expect(result.current.formData.password).toBe("");
    expect(result.current.isFormValid).toBe(false);
  });

  it('handleSubmitPassword should call mutate with correct payload', () => {
    const { result } = renderHook(() => usePasswordLoginHook(), { wrapper: createWrapper() });

    // Set a password in formData
    act(() => {
      result.current.handleChange({ target: { value: 'mysecretpass' } } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleSubmitPassword();
    });

    expect(mockLoginPasswordMutate).toHaveBeenCalledTimes(1);
    expect(mockLoginPasswordMutate).toHaveBeenCalledWith({
      phoneNumber: '09123456789',
      password: 'mysecretpass',
    });
  });

  it('handleBack should navigate to /login with current location state', () => {
    const { result } = renderHook(() => usePasswordLoginHook(), { wrapper: createWrapper() });

    act(() => {
      result.current.handleBack();
    });

    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledWith('/login', { state: defaultMockLocation.state });
  });

  it('handleFogetPassword should navigate to /forget-password with current location state', () => {
    const { result } = renderHook(() => usePasswordLoginHook(), { wrapper: createWrapper() });

    act(() => {
      result.current.handleFogetPassword();
    });

    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledWith('/forget-password', { state: defaultMockLocation.state });
  });

  it('should reflect isPending state from useLoginPassword hook', () => {
    // Simulate pending state from useLoginPassword
    act(() => {
      mockLoginPasswordIsPending = true;
    });

    const { result, rerender } = renderHook(() => usePasswordLoginHook(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);

    // Simulate no longer pending
    act(() => {
      mockLoginPasswordIsPending = false;
    });
    rerender();
    expect(result.current.isPending).toBe(false);
  });
});
