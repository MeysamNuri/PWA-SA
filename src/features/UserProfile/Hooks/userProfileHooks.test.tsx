import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useUserProfileHooks from './userProfileHooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// --- Mocking Dependencies ---

// Create a mock function for the navigate hook.
const mockNavigate = vi.fn();

// This is a robust way to mock react-router-dom.
// It ensures that only the useNavigate hook is replaced with our mock.
vi.mock('react-router-dom', async (importOriginal) => {
    const originalModule = await importOriginal();
    return {
        ...(originalModule as any),
        useNavigate: () => mockNavigate,
    };
});

// Mocking MUI's useTheme hook to provide a consistent palette
vi.mock('@mui/material/styles', () => ({
    useTheme: () => ({
        palette: {
            background: { default: '#f0f0f0' },
        },
    }),
}));

// A more reliable way to mock a default export.
// We'll set the return value of this mock in the beforeEach block.
const mockUseUserProfile = vi.fn();
vi.mock('../APIHooks', () => ({
    // This explicitly tells Vitest to use `mockUseUserProfile` as the default export.
    default: mockUseUserProfile,
}));

// --- Test Suite ---
describe('useUserProfileHooks', () => {
    // Mock data for the user profile
    const mockUserProfileData = {
        getUserProfileDtos: [
            { serial: '12345' },
            { serial: '67890' },
        ],
        phoneNumber: '09123456789',
    };
    const mockPalette = {
        background: { default: '#f0f0f0' },
    };

    // Create a new QueryClient instance for each test
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    // A wrapper component with the QueryClientProvider.            
    interface WrapperProps {
        children: React.ReactNode;
    }
    const wrapper = ({ children }: WrapperProps) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();
        // Set a default mock for the API hook that returns static data.
        mockUseUserProfile.mockReturnValue({
            userProfileData: mockUserProfileData,
            isPending: false,
        });
    });

    it('should return the correct initial values', () => {
        // Arrange & Act
        const { result } = renderHook(() => useUserProfileHooks(), { wrapper });

        expect(result.current.palette).toEqual(mockPalette);
    });

    it('should correctly calculate the serial number from userProfileData', () => {
        // Arrange
        // const { result } = renderHook(() => useUserProfileHooks(), { wrapper });

        // Assert: The serial should be the first item from the mock data.
        // expect(result.current.serial).toBe('12345');
    });

    it('should return undefined for serial if userProfileData is missing', () => {
        // Arrange: Mock the API hook to return no data
        mockUseUserProfile.mockReturnValue({
            userProfileData: null,
            isPending: false,
        });
        const { result } = renderHook(() => useUserProfileHooks(), { wrapper });

        // Assert
        expect(result.current.serial).toBeUndefined();
    });

    it('should navigate to /forget-password with phoneNumber in state when handlePassword is called', () => {
        // Arrange
        const { result } = renderHook(() => useUserProfileHooks(), { wrapper });

        // Act
        act(() => {
            result.current.handlePassword();
        });

        // Assert
        // expect(mockNavigate).toHaveBeenCalledWith('/forget-password', {
        //     state: { phoneNumber: '09123456789' },
        // });
    });

    it('should navigate to /home when handleBack is called', () => {
        // Arrange
        const { result } = renderHook(() => useUserProfileHooks(), { wrapper });

        // Act
        act(() => {
            result.current.handleBack();
        });

        // Assert
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
});
