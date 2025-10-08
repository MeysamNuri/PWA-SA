import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useUserProfile from './APIHooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'react-toastify';
// import { getTranslation } from '@/core/helper/translationUtility';
import axiosInstance from '@/core/constant/axios';

// --- Mocking Dependencies ---

// Mock the axiosInstance's get method by creating the mock function
// directly inside the factory. This is the most reliable way to avoid hoisting issues.
vi.mock('@/core/constant/axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

// Mock the react-toastify package similarly.
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

// Mock the translation utility, providing a default implementation.
vi.mock('@/core/helper/translationUtility', () => ({
    getTranslation: vi.fn((key) => `Translated: ${key}`),
}));

// --- Test Setup ---

// Create a test client with no retries to speed up tests
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

// A wrapper component to provide the QueryClientProvider context
interface WrapperProps {
    children: React.ReactNode;
}
const wrapper = ({ children }: WrapperProps) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

describe('useUserProfile', () => {
    // A successful API response
    const successfulResponse = {
        Status: true,
        Data: {
            // Mock data for IUserProfileDataRes
            accountStatus: 'Active',
            fullName: 'Test User',
            phoneNumber: '1234567890',
            // ...other fields
        },
        Message: [],
    };

    // A failed API response
    const failedResponse = {
        Status: false,
        Data: null,
        Message: ['user_not_found', 'invalid_session'],
    };

    beforeEach(() => {
        // Clear all mocks before each test to ensure a clean state
        vi.clearAllMocks();
        // Reset the query cache before each test
        queryClient.clear();
    });

    it('should be in a pending state initially', () => {
        // Arrange
        // Use vi.mocked to get a reference to the mock function
        vi.mocked(axiosInstance.get).mockReturnValue(new Promise(() => {}));

        // Act
        const { result } = renderHook(() => useUserProfile(), { wrapper });

        // Assert
        expect(result.current.isPending).toBe(true);
        expect(result.current.userProfileData).toBeUndefined();
        expect(result.current.isSuccess).toBe(false);
    });

    it('should return user profile data on successful API call', async () => {
        // Arrange
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: successfulResponse });

        // Act
        const { result } = renderHook(() => useUserProfile(), { wrapper });

        // Wait for the query to finish fetching data
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        // Assert
        expect(result.current.isPending).toBe(false);
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.userProfileData).toEqual(successfulResponse.Data);
        // Ensure toast.error was not called on a successful request
        expect(vi.mocked(toast.error)).not.toHaveBeenCalled();
    });

    it('should call toast.error and return null data on failed API status', async () => {
        // Arrange
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: failedResponse });

        // Act
        const { result } = renderHook(() => useUserProfile(), { wrapper });

        // Wait for the query to finish fetching data
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        // Assert
        expect(result.current.isPending).toBe(false);
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.userProfileData).toBeNull();

        // Check if toast.error was called for each message
        expect(vi.mocked(toast.error)).toHaveBeenCalledTimes(failedResponse.Message.length);
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Translated: user_not_found');
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Translated: invalid_session');
    });

    it('should handle API network errors gracefully', async () => {
        // Arrange
        const error = new Error('Network Error');
        vi.mocked(axiosInstance.get).mockRejectedValueOnce(error);

        // Act
        const { result } = renderHook(() => useUserProfile(), { wrapper });

        // Wait for the query to fail
        await waitFor(() => expect(result.current.status).toBe('error'));

        // Assert
        expect(result.current.isPending).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.userProfileData).toBeUndefined();
        // toast.error should not be called as this is a network error, not a business logic error
        expect(vi.mocked(toast.error)).not.toHaveBeenCalled();
    });
});
