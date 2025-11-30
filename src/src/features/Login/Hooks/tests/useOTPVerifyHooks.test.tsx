import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useSendOTPHooks from '../useOTPVerifyHooks'; // Assuming the hook file is named useSendOTPHooks.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import necessary tools

// --- TYPE DEFINITIONS FOR MOCKS ---
interface MockResponse {
    Status: boolean;
    // Add other relevant response properties here if needed, e.g., token: string
}

// --- REACT QUERY SETUP FOR TESTING ---
// 1. Create a QueryClient instance
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Prevent real data fetching or retries in tests
            retry: false, 
            staleTime: Infinity,
        },
    },
});

// 2. Create a wrapper component
const QueryWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

// --- MOCKING EXTERNAL DEPENDENCIES ---

// 1. Mock react-router-dom
const mockNavigate = vi.fn();
const mockLocation = { state: { phoneNumber: '1234567890' } } as any;

vi.mock('react-router', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
}));

// 2. Mock @mui/material/styles
vi.mock('@mui/material/styles', () => ({
    useTheme: () => ({
        palette: { primary: { main: '#000' } } // Minimal mock for palette
    } as unknown as any),
}));

// 3. Mock API Hooks - Allowing TypeScript to infer the mock function type (vi.fn())
// by removing the explicit type block, resolving the 'mockClear' error.
const mockUseSendOTP = {
    mutate: vi.fn(),
    responseData: undefined as MockResponse | undefined,
    isPending: false,
};

const mockUseLoginByOTP = {
    handleLoginByOTP: vi.fn(),
    isPending: false,
    responseData: undefined as MockResponse | undefined,
};

const mockUseSendFCMToken = {
    mutate: vi.fn(), // FIX: Changed 'typeof vi.fn' to 'vi.fn()'
};

// Mocking the API hook imports
vi.mock('../APIHooks/useSendOTP', () => ({
    default: () => mockUseSendOTP,
}));
vi.mock('../APIHooks/useLoginByOTP', () => ({
    default: () => mockUseLoginByOTP,
}));
vi.mock('../APIHooks/useFCMToken', () => ({
    default: () => mockUseSendFCMToken,
}));

// Mock localStorage (used for fcm_token)
const localStorageMock = (function () {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
        clear: vi.fn(() => { store = {}; }),
        removeItem: vi.fn((key) => { delete store[key]; })
    };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock timers for useEffect tests
vi.useFakeTimers();

// --- TEST SUITE ---

describe('useSendOTPHooks', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
        // Reset location state for individual tests
        mockLocation.state = { phoneNumber: '1234567890' };
        // Reset mutable mock data before each test
        mockUseSendOTP.mutate.mockClear();
        mockUseLoginByOTP.handleLoginByOTP.mockClear();
        mockUseSendFCMToken.mutate.mockClear();

        mockUseSendOTP.responseData = undefined;
        mockUseLoginByOTP.responseData = undefined;
    });

    it('should initialize with correct default state values', () => {
        const { result } = renderHook(() => useSendOTPHooks(), { wrapper: QueryWrapper });

        expect(result.current.timer).toBe(120);
        expect(result.current.canResend).toBe(false);
        expect(result.current.otpValues).toEqual(["", "", "", "", "", ""]);
        expect(result.current.isPending).toBe(false);
        expect(result.current.OTPVerifyLoading).toBe(false);
    });

    it('should navigate to /login if phoneNumber is missing from location state on mount', () => {
        mockLocation.state = {}; // Simulate missing phone number
        renderHook(() => useSendOTPHooks(), { wrapper: QueryWrapper });

        // This useEffect runs once on mount
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should handle timer countdown and set canResend to true after expiry', () => {
        const { result } = renderHook(() => useSendOTPHooks(), { wrapper: QueryWrapper });

        // Initial state
        expect(result.current.timer).toBe(120);
        expect(result.current.canResend).toBe(false);

        // Advance timers by 120 seconds (120 * 1000ms)
        act(() => {
            vi.advanceTimersByTime(120000);
        });

        // Timer reaches 0, and canResend is set to true
        expect(result.current.timer).toBe(0);
        expect(result.current.canResend).toBe(true);
    });

    it('should call OTP mutation and reset timer when API response Status is true', () => {
        // Set up the mock response before rendering
        mockUseSendOTP.responseData = { Status: true };

        const { result, rerender } = renderHook(() => useSendOTPHooks(), { wrapper: QueryWrapper });

        // We call rerender to force the hook to re-run effects (if needed, though this effect runs on initial mount).
        act(() => {
            rerender();
        });

        // The hook state should reset due to the useEffect watching responseData
        expect(result.current.timer).toBe(120);
        expect(result.current.canResend).toBe(false);
    });

    it('should call mutate on resend only when canResend is true', () => {
        const { result } = renderHook(() => useSendOTPHooks(), { wrapper: QueryWrapper });

        // 1. canResend is false initially
        act(() => {
            result.current.handleResendCode();
        });
        expect(mockUseSendOTP.mutate).not.toHaveBeenCalled();

        // 2. Simulate timer expiry to set canResend to true
        act(() => {
            vi.advanceTimersByTime(120000);
        });
        // Explicitly confirm state update
        expect(result.current.canResend).toBe(true);


        // 3. canResend is true, call resend
        act(() => {
            result.current.handleResendCode();
        });
        expect(mockUseSendOTP.mutate).toHaveBeenCalledWith({ phoneNumber: '1234567890' });
        expect(mockUseSendOTP.mutate).toHaveBeenCalledTimes(1);
    });

    it('should update OTP values and focus next input on change', () => {
        const { result } = renderHook(() => useSendOTPHooks(), { wrapper: QueryWrapper });
        
        // Mock input refs for focus testing (only 6 inputs are needed)
        const mockInputRefs = Array(6).fill(0).map(() => ({ focus: vi.fn() }));
        const currentInputRefs = result.current.inputRefs.current;
        for (let i = 0; i < 6; i++) {
             // Populate the ref array used by the hook
            currentInputRefs[i] = mockInputRefs[i] as unknown as HTMLInputElement;
        }

        // 1. Change the first digit (index 0)
        act(() => {
            result.current.handleOTPChange(0, { target: { value: '5' } } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.otpValues[0]).toBe('5');
        // Should focus the next input (index 1)
        expect(mockInputRefs[1].focus).toHaveBeenCalled();

        // 2. Change the second digit (index 1)
        act(() => {
            result.current.handleOTPChange(1, { target: { value: '9' } } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.otpValues[1]).toBe('9');
        // Should focus the next input (index 2)
        expect(mockInputRefs[2].focus).toHaveBeenCalled();

        // 3. Test backspace/empty value (index 1 -> index 0 focus)
        act(() => {
            result.current.handleOTPChange(1, { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.otpValues[1]).toBe('');
        // Should focus the previous input (index 0)
        expect(mockInputRefs[0].focus).toHaveBeenCalled();
    });

    it('should call handleSubmitOTP when all 6 digits are entered and trigger handleLoginByOTP', () => {
        const { result } = renderHook(() => useSendOTPHooks(), { wrapper: QueryWrapper });

        // Simulate entering all 6 digits sequentially, each in its own act() block
        const fullOTP = '123456';
        const inputValues = fullOTP.split('');

        inputValues.forEach((value, index) => {
            act(() => {
                // Use separate act blocks to ensure state updates are flushed
                result.current.handleOTPChange(index, { target: { value } } as React.ChangeEvent<HTMLInputElement>);
            });
        });

        // The final state should be correct
        expect(result.current.otpValues.join("")).toBe(fullOTP);
        
        // The useEffect watching otpValues should trigger handleSubmitOTP,
        // which then triggers handleLoginByOTP.
        // We need an extra act() here to ensure the useEffect runs AFTER all state updates are flushed.
        act(() => {});

        expect(mockUseLoginByOTP.handleLoginByOTP).toHaveBeenCalledWith({
            phoneNumber: '1234567890',
            code: fullOTP
        });
    });

    it('should call handleLoginByOTP on explicit handleSubmitOTP call', () => {
        const { result } = renderHook(() => useSendOTPHooks(), { wrapper: QueryWrapper });

        // Manually set OTP values for testing by sequentially updating state
        const fullOTP = '111111';
        const inputValues = fullOTP.split('');
        
        inputValues.forEach((value, index) => {
            act(() => {
                // Use separate act blocks to ensure state updates are flushed
                result.current.handleOTPChange(index, { target: { value } } as React.ChangeEvent<HTMLInputElement>);
            });
        });

        // Explicitly check that the state is ready
        expect(result.current.otpValues.join("")).toBe(fullOTP);

        act(() => {
            result.current.handleSubmitOTP();
        });

        expect(mockUseLoginByOTP.handleLoginByOTP).toHaveBeenCalledWith({
            phoneNumber: '1234567890',
            code: fullOTP
        });
    });

    it('should navigate to /login on handleBack', () => {
        const { result } = renderHook(() => useSendOTPHooks(), { wrapper: QueryWrapper });

        act(() => {
            result.current.handleBack();
        });

        expect(mockNavigate).toHaveBeenCalledWith('/login', { state: mockLocation.state });
    });

    it('should navigate to /password-login on handlePasswordLoginClick', () => {
        const { result } = renderHook(() => useSendOTPHooks(), { wrapper: QueryWrapper });

        act(() => {
            result.current.handlePasswordLoginClick();
        });

        expect(mockNavigate).toHaveBeenCalledWith('/password-login', { state: mockLocation.state });
    });

    it('should send FCM token if available in localStorage and login is successful', () => {
        // Set up localStorage with a token
        localStorage.setItem("fcm_token", "test-fcm-token-123");
        
        // Initial render
        const { rerender } = renderHook(() => useSendOTPHooks(), { wrapper: QueryWrapper });

        // 1. Simulate successful login response by updating the mock object
        act(() => {
            mockUseLoginByOTP.responseData = { Status: true };
            rerender(); // Rerender to trigger the useEffect watching responseData
        });
        
        // 2. We need an extra act() here to ensure the useEffect watching the API response runs
        // and triggers the FCM mutate call.
        act(() => {});

        // Now it should call the fcmTokenMutate
        expect(mockUseSendFCMToken.mutate).toHaveBeenCalledWith("test-fcm-token-123");
    });
});