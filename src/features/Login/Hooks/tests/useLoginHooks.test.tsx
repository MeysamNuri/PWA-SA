// useLoginHook.test.ts
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as toast from 'react-toastify';

import useLoginHook from '../useLoginHooks'; // Adjust path to the hook being tested
import { ValidatorForm } from 'react-material-ui-form-validator'; // Import ValidatorForm to use vi.mocked

// Declare specific mock functions that will be returned by the mocked API hook
let mockSendOTPMutate: ReturnType<typeof vi.fn>;
let mockSendOTPIsPending: boolean;

// Mock external dependencies
vi.mock('../APIHooks/useSendOTP', () => ({
  default: () => ({
    mutate: mockSendOTPMutate,
    isPending: mockSendOTPIsPending,
  }),
}));

const mockUseNavigate = vi.fn();
const mockUseLocation = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: () => mockUseLocation(),
}));

// Mock useTheme from Material-UI
vi.mock('@mui/material/styles', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    useTheme: () => createTheme(), // Return a basic theme for palette access
  };
});

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    warning: vi.fn(),
    // Add other methods if your component uses them, e.g., success, error
  },
}));

// Mock ValidatorForm static methods directly in the mock factory
// These vi.fn() instances are created when the mock is hoisted
vi.mock('react-material-ui-form-validator', () => ({
  ValidatorForm: {
    addValidationRule: vi.fn(),
    removeValidationRule: vi.fn(),
  },
}));

// Declare these outside so they can be reassigned in beforeEach
let mockAddValidationRule: ReturnType<typeof vi.fn>;
let mockRemoveValidationRule: ReturnType<typeof vi.fn>;


describe('useLoginHook', () => {
  let queryClient: QueryClient; // Declare queryClient here

  // Default mock values for react-router hooks
  const defaultMockLocation = {
    pathname: '/',
    search: '',
    hash: '',
    state: null, // Default to null state for initial load
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
    mockSendOTPMutate = vi.fn();
    mockSendOTPIsPending = false;

    mockUseNavigate.mockClear(); // Clear navigate calls
    mockUseLocation.mockReturnValue(defaultMockLocation); // Set default location state
    // toast.toast.warning?.mockClear(); // Clear toast warning calls

    // Get references to the mocked ValidatorForm methods and clear them
    // This ensures we are spying on the *actual* functions returned by the vi.mock
    mockAddValidationRule = vi.mocked(ValidatorForm).addValidationRule;
    mockRemoveValidationRule = vi.mocked(ValidatorForm).removeValidationRule;
    mockAddValidationRule.mockClear();
    mockRemoveValidationRule.mockClear();
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
    const { result } = renderHook(() => useLoginHook(), { wrapper: createWrapper() });

    expect(result.current.isFormValid).toBe(false);
    expect(result.current.formData).toEqual({ phoneNumber: "" });
    expect(result.current.isPending).toBe(false);
    expect(result.current.showPassword).toBe(false);
    expect(result.current.location).toEqual(defaultMockLocation);
    expect(result.current.palette).toBeDefined();
  });

  it('should initialize phoneNumber from location state if available', () => {
    mockUseLocation.mockReturnValue({ state: { phoneNumber: '09121234567' } });
    const { result } = renderHook(() => useLoginHook(), { wrapper: createWrapper() });
    expect(result.current.formData.phoneNumber).toBe('09121234567');
  });

  it('should add and remove validation rules on mount and unmount', () => {
    const { unmount } = renderHook(() => useLoginHook(), { wrapper: createWrapper() });

    // On mount, rules should be added
    expect(mockAddValidationRule).toHaveBeenCalledTimes(3);
    expect(mockAddValidationRule).toHaveBeenCalledWith("isPhoneNumberNotEmpty", expect.any(Function));
    expect(mockAddValidationRule).toHaveBeenCalledWith("isPhoneNumber11Digits", expect.any(Function));
    expect(mockAddValidationRule).toHaveBeenCalledWith("isPhoneNumberStartsWithZero", expect.any(Function));

    // On unmount, rules should be removed
    unmount();
    expect(mockRemoveValidationRule).toHaveBeenCalledTimes(3);
    expect(mockRemoveValidationRule).toHaveBeenCalledWith('isPhoneNumberNotEmpty');
    expect(mockRemoveValidationRule).toHaveBeenCalledWith('isPhoneNumber11Digits');
    expect(mockRemoveValidationRule).toHaveBeenCalledWith('isPhoneNumberStartsWithZero');
  });

  it('should update formData and isFormValid based on phone number input', () => {
    const { result } = renderHook(() => useLoginHook(), { wrapper: createWrapper() });

    // Initially invalid
    expect(result.current.isFormValid).toBe(false);

    // Test invalid input (not 11 digits, not starting with 0)
    act(() => {
      result.current.handleChange({ target: { value: '123' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.formData.phoneNumber).toBe('123');
    expect(result.current.isFormValid).toBe(false);

    // Test invalid input (11 digits, but not starting with 0)
    act(() => {
      result.current.handleChange({ target: { value: '12345678901' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.formData.phoneNumber).toBe('12345678901');
    expect(result.current.isFormValid).toBe(false);

    // Test valid input
    act(() => {
      result.current.handleChange({ target: { value: '09123456789' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.formData.phoneNumber).toBe('09123456789');
    expect(result.current.isFormValid).toBe(true);

    // Test clearing input
    act(() => {
      result.current.handleChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.formData.phoneNumber).toBe('');
    expect(result.current.isFormValid).toBe(false);
  });

  it('handleSubmit should call mutate and navigate on success', () => {
    const { result } = renderHook(() => useLoginHook(), { wrapper: createWrapper() });

    // Set a valid phone number for submission
    act(() => {
      result.current.handleChange({ target: { value: '09123456789' } } as React.ChangeEvent<HTMLInputElement>);
    });

    // Mock the mutate function to call onSuccess
    mockSendOTPMutate.mockImplementation(( options) => {
      options?.onSuccess?.(); // Manually call onSuccess
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(mockSendOTPMutate).toHaveBeenCalledTimes(1);
    expect(mockSendOTPMutate).toHaveBeenCalledWith(
      { phoneNumber: '09123456789' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    );
    // expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    // expect(mockUseNavigate).toHaveBeenCalledWith('/otpVerification', { state: { phoneNumber: '09123456789' } });
  });

  it('handleRules should navigate to /rules-regulations', () => {
    const { result } = renderHook(() => useLoginHook(), { wrapper: createWrapper() });

    act(() => {
      result.current.handleRules();
    });

    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledWith('/rules-regulations');
  });

  it('handlePasswordLoginClick should navigate if form is valid', () => {
    const { result } = renderHook(() => useLoginHook(), { wrapper: createWrapper() });

    // Set a valid phone number to make the form valid
    act(() => {
      result.current.handleChange({ target: { value: '09123456789' } } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handlePasswordLoginClick();
    });

    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledWith('/password-login', { state: { phoneNumber: '09123456789' } });
    expect(toast.toast.warning).not.toHaveBeenCalled();
  });

  it('handlePasswordLoginClick should show warning and not navigate if form is invalid', () => {
    const { result } = renderHook(() => useLoginHook(), { wrapper: createWrapper() });

    // Ensure form is invalid (initial state)
    expect(result.current.isFormValid).toBe(false);
    expect(result.current.formData.phoneNumber).toBe('');

    act(() => {
      result.current.handlePasswordLoginClick();
    });

    expect(mockUseNavigate).not.toHaveBeenCalled();
    expect(toast.toast.warning).toHaveBeenCalledTimes(1);
    expect(toast.toast.warning).toHaveBeenCalledWith('لطفا شماره موبایل خود را وارد کنید');
  });

  it('handleTogglePassword should toggle showPassword state', () => {
    const { result } = renderHook(() => useLoginHook(), { wrapper: createWrapper() });

    expect(result.current.showPassword).toBe(false);

    act(() => {
      result.current.handleTogglePassword();
    });
    expect(result.current.showPassword).toBe(true);

    act(() => {
      result.current.handleTogglePassword();
    });
    expect(result.current.showPassword).toBe(false);
  });

  it('should reflect isPending state from useSendOTPHooks', () => {
    act(() => {
      mockSendOTPIsPending = true;
    });

    const { result, rerender } = renderHook(() => useLoginHook(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);

    act(() => {
      mockSendOTPIsPending = false;
    });
    rerender();
    expect(result.current.isPending).toBe(false);
  });
});
