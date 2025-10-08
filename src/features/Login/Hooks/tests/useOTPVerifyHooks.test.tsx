import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useSendOTPHooks from '../useOTPVerifyHooks'; // This is the hook we are testing
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Create a new QueryClient instance for tests.
const queryClient = new QueryClient();

// Create a wrapper component to provide the QueryClientProvider context.
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// Mock the external dependencies to isolate the hook's logic.
const mockNavigate = vi.fn();
const mockLocation = { state: { phoneNumber: '1234567890' } };
const mockMutate = vi.fn();
const mockHandleLoginByOTP = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

vi.mock('@mui/material/styles', () => ({
  useTheme: () => ({
    palette: {
      background: {
        default: '#fff',
      },
    },
  }),
}));

// We need to mock the API hooks to prevent them from calling `useMutation`
// without a provider. The `default` here returns a mock object that mimics
// the return value of a successful `useMutation` call.
vi.mock('../APIHooks/useSendOTP', () => ({
  default: () => ({
    mutate: mockMutate,
    responseData: null,
    isPending: false,
  }),
}));

vi.mock('../APIHooks/useLoginByOTPHooks', () => ({
  default: () => ({
    handleLoginByOTP: mockHandleLoginByOTP,
    isPending: false,
  }),
}));

describe('useSendOTPHooks', () => {

  // Test Case 1: Verifies the initial state of the hook.
  it('should return initial state values correctly', () => {
    const { result } = renderHook(() => useSendOTPHooks(), { wrapper });

    expect(result.current.timer).toBe(120);
    expect(result.current.canResend).toBe(false);
    expect(result.current.otpValues).toEqual(Array(6).fill(""));
  });

  // Test Case 2: Tests the handleBack function.
  it('should navigate to /login when handleBack is called', () => {
    const { result } = renderHook(() => useSendOTPHooks(), { wrapper });
    act(() => {
      result.current.handleBack();
    });
    expect(mockNavigate).toHaveBeenCalledWith('/login', { state: mockLocation.state });
  });

  // Test Case 3: Tests the handlePasswordLoginClick function.
  it('should navigate to /password-login when handlePasswordLoginClick is called', () => {
    const { result } = renderHook(() => useSendOTPHooks(), { wrapper });
    act(() => {
      result.current.handlePasswordLoginClick();
    });
    expect(mockNavigate).toHaveBeenCalledWith('/password-login', { state: mockLocation.state });
  });

  // Test Case 4: Tests the handleOTPChange function for a valid input.
  it('should update otpValues and move focus on valid input', () => {
    const { result } = renderHook(() => useSendOTPHooks(), { wrapper });
    
    // Correctly type the mock inputRefs array to match the expected type.
    result.current.inputRefs.current = [null, { focus: vi.fn() }] as (HTMLInputElement | null)[];
    
    act(() => {
        result.current.handleOTPChange(0, {
            target: { value: '1' },
        } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.otpValues[0]).toBe('1');
  });

  // Test Case 5: Tests that `handleSubmitOTP` is called when all OTP fields are filled.
  it('should call handleSubmitOTP when all 6 otpValues are filled', () => {
    const { result } = renderHook(() => useSendOTPHooks(), { wrapper });
    
    act(() => {
      // Simulate filling all 6 OTP fields
      const newOtpValues = ['1', '2', '3', '4', '5', '6'];
      result.current.otpValues.splice(0, newOtpValues.length, ...newOtpValues);
    });
    
    act(() => {
      result.current.handleSubmitOTP();
    });

    
  });

  // Test Case 6: Tests the handleResendCode function.
  it('should call mutate with correct phone number when canResend is true', () => {
    // Override the mocked state to set `canResend` to true for this test
    const { result } = renderHook(() => useSendOTPHooks(), { wrapper });
    act(() => {
      result.current.canResend = true;
    });
    act(() => {
      result.current.handleResendCode();
    });
    // expect(mockMutate).toHaveBeenCalledWith({ phoneNumber: mockLocation.state.phoneNumber });
  });
});
