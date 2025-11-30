// useForgetPasswordHook.test.ts
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useForgetPasswordHook from '../useForgetPasswordHooks'; // Adjust path to the hook being tested
import { ValidatorForm } from 'react-material-ui-form-validator'; // Import ValidatorForm to use vi.mocked

// Declare specific mock functions that will be returned by the mocked API hook
let mockHandleChangePasswordByOTP: ReturnType<typeof vi.fn>;
let mockIsPendingForgetPassword: boolean;

// Mock external dependencies
vi.mock('../APIHooks/useForgetPassword', () => ({
  default: () => ({
    handleChangePasswordByOTP: mockHandleChangePasswordByOTP,
    isPending: mockIsPendingForgetPassword,
  }),
}));

const mockUseLocation = vi.fn();
vi.mock('react-router', () => ({
  useLocation: () => mockUseLocation(),
}));

// Mock ValidatorForm static methods directly in the mock factory
vi.mock('react-material-ui-form-validator', () => ({
  ValidatorForm: {
    addValidationRule: vi.fn(),
    removeValidationRule: vi.fn(),
  },
}));

// Declare these outside so they can be reassigned in beforeEach
let mockAddValidationRule: ReturnType<typeof vi.fn>;
let mockRemoveValidationRule: ReturnType<typeof vi.fn>;


describe('useForgetPasswordHook', () => {
  let queryClient: QueryClient; // Declare queryClient here

  // Default mock values for react-router hooks
  const defaultMockLocation = {
    pathname: '/forget-password',
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
    mockHandleChangePasswordByOTP = vi.fn();
    mockIsPendingForgetPassword = false;

    mockUseLocation.mockReturnValue(defaultMockLocation); // Set default location state

    // Get references to the mocked ValidatorForm methods and clear them
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
    const { result } = renderHook(() => useForgetPasswordHook(), { wrapper: createWrapper() });

    expect(result.current.showPassword).toBe(false);
    expect(result.current.showConfirmPassword).toBe(false);
    expect(result.current.otpValues).toEqual(['', '', '', '', '', '']);
    expect(result.current.formData).toEqual({ initialPassword: "", confirmedPassword: "" });
    expect(result.current.isPending).toBe(false);
    expect(result.current.location).toEqual(defaultMockLocation);
  });

  it('should add and remove validation rules on mount and unmount', () => {
    const { unmount } = renderHook(() => useForgetPasswordHook(), { wrapper: createWrapper() });

    // On mount, rules should be added
    expect(mockAddValidationRule).toHaveBeenCalledTimes(3);
    expect(mockAddValidationRule).toHaveBeenCalledWith("isPasswordMinLength", expect.any(Function));
    expect(mockAddValidationRule).toHaveBeenCalledWith("isPasswordHasCapital", expect.any(Function));
    expect(mockAddValidationRule).toHaveBeenCalledWith("isPasswordMatch", expect.any(Function));

    // On unmount, rules should be removed
    unmount();
    expect(mockRemoveValidationRule).toHaveBeenCalledTimes(3);
    expect(mockRemoveValidationRule).toHaveBeenCalledWith('isPasswordMinLength');
    expect(mockRemoveValidationRule).toHaveBeenCalledWith('isPasswordHasCapital');
    expect(mockRemoveValidationRule).toHaveBeenCalledWith('isPasswordMatch');
  });

  it('handleOTPChange should update otpValues and manage focus', () => {
    const { result } = renderHook(() => useForgetPasswordHook(), { wrapper: createWrapper() });

    const mockInputRefs = {
      current: [
        document.createElement('input'),
        document.createElement('input'),
        document.createElement('input'),
        document.createElement('input'),
        document.createElement('input'),
        document.createElement('input'),
      ],
    };
    // Manually set the inputRefs for the hook's instance
    act(() => {
      result.current.inputRefs.current = mockInputRefs.current;
      mockInputRefs.current.forEach(input => vi.spyOn(input, 'focus')); // Spy on focus method
    });

    // Test typing a digit and moving focus forward
    act(() => {
      result.current.handleOTPChange(0, { target: { value: '1' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.otpValues).toEqual(['1', '', '', '', '', '']);
    expect(mockInputRefs.current[1].focus).toHaveBeenCalledTimes(1);

    // Test typing another digit and moving focus forward
    act(() => {
      result.current.handleOTPChange(1, { target: { value: '2' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.otpValues).toEqual(['1', '2', '', '', '', '']);
    expect(mockInputRefs.current[2].focus).toHaveBeenCalledTimes(1);

    // Test backspacing and moving focus backward
    act(() => {
      result.current.handleOTPChange(1, { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.otpValues).toEqual(['1', '', '', '', '', '']);
    expect(mockInputRefs.current[0].focus).toHaveBeenCalledTimes(1);

    // Test non-digit input (should be ignored)
    act(() => {
      result.current.handleOTPChange(2, { target: { value: 'a' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.otpValues).toEqual(['1', '', '', '', '', '']); // Should not change
    expect(mockInputRefs.current[3].focus).not.toHaveBeenCalled(); // Focus should not move
  });

  it('handleinitialPasswordChange should update initialPassword in formData', () => {
    const { result } = renderHook(() => useForgetPasswordHook(), { wrapper: createWrapper() });

    act(() => {
      result.current.handleinitialPasswordChange({ target: { value: 'NewPass123' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.formData.initialPassword).toBe('NewPass123');
  });

  it('handleConfirmedPasswordChange should update confirmedPassword in formData', () => {
    const { result } = renderHook(() => useForgetPasswordHook(), { wrapper: createWrapper() });

    act(() => {
      result.current.handleConfirmedPasswordChange({ target: { value: 'NewPass123' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.formData.confirmedPassword).toBe('NewPass123');
  });

  it('handleSubmitChangePassword should call handleChangePasswordByOTP with correct payload', () => {
    const { result } = renderHook(() => useForgetPasswordHook(), { wrapper: createWrapper() });

    // Set mock data by calling each state-updating function in its own act block
    act(() => { result.current.handleOTPChange(0, { target: { value: '1' } } as React.ChangeEvent<HTMLInputElement>); });
    act(() => { result.current.handleOTPChange(1, { target: { value: '2' } } as React.ChangeEvent<HTMLInputElement>); });
    act(() => { result.current.handleOTPChange(2, { target: { value: '3' } } as React.ChangeEvent<HTMLInputElement>); });
    act(() => { result.current.handleOTPChange(3, { target: { value: '4' } } as React.ChangeEvent<HTMLInputElement>); });
    act(() => { result.current.handleOTPChange(4, { target: { value: '5' } } as React.ChangeEvent<HTMLInputElement>); });
    act(() => { result.current.handleOTPChange(5, { target: { value: '6' } } as React.ChangeEvent<HTMLInputElement>); });
    act(() => { result.current.handleinitialPasswordChange({ target: { value: 'NewPass123' } } as React.ChangeEvent<HTMLInputElement>); });
    act(() => { result.current.handleConfirmedPasswordChange({ target: { value: 'NewPass123' } } as React.ChangeEvent<HTMLInputElement>); });

    act(() => {
      result.current.handleSubmitChangePassword();
    });

    expect(mockHandleChangePasswordByOTP).toHaveBeenCalledTimes(1);
    expect(mockHandleChangePasswordByOTP).toHaveBeenCalledWith({
      confirmPassword: 'NewPass123',
      newPassword: 'NewPass123',
      otpCode: '123456',
      phoneNumber: '09123456789',
    });
  });

  it('handleTogglePassword should toggle showPassword state', () => {
    const { result } = renderHook(() => useForgetPasswordHook(), { wrapper: createWrapper() });

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

  it('handleToggleConfirmPassword should toggle showConfirmPassword state', () => {
    const { result } = renderHook(() => useForgetPasswordHook(), { wrapper: createWrapper() });

    expect(result.current.showConfirmPassword).toBe(false);
    act(() => {
      result.current.handleToggleConfirmPassword();
    });
    expect(result.current.showConfirmPassword).toBe(true);
    act(() => {
      result.current.handleToggleConfirmPassword();
    });
    expect(result.current.showConfirmPassword).toBe(false);
  });

  it('should reflect isPending state from useForgetPasswordHooks', () => {
    act(() => {
      mockIsPendingForgetPassword = true;
    });

    const { result, rerender } = renderHook(() => useForgetPasswordHook(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);

    act(() => {
      mockIsPendingForgetPassword = false;
    });
    rerender();
    expect(result.current.isPending).toBe(false);
  });
});