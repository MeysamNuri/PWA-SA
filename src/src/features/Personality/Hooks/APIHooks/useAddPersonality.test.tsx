// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import useAddPersonality from './useAddPersonality'; // Adjust path as needed

// --- HOISTING FIX: Define all referenced mocks using vi.hoisted to prevent ReferenceError ---
// 1. Define the mock functions using vi.hoisted
const { mockAxiosPost, mockGetTranslation, mockToast } = vi.hoisted(() => {
    const mockAxiosPost = vi.fn();
    const mockGetTranslation = vi.fn((key: string) => `Translated: ${key}`);
    // HOISTED: Moved mockToast definition here to resolve the new ReferenceError
    const mockToast = {
        success: vi.fn(),
        error: vi.fn(),
    };
    return { mockAxiosPost, mockGetTranslation, mockToast };
});

// 2. Mock axiosInstance to control API responses, referencing the hoisted variable
vi.mock('@/core/constant/axios', () => ({
    default: {
        post: mockAxiosPost,
    },
}));

// 3. Mock translation utility, referencing the hoisted variable
vi.mock('@/core/helper/translationUtility', () => ({
    getTranslation: mockGetTranslation,
}));

// 4. Mock toast notifications, referencing the hoisted variable
vi.mock('react-toastify', () => ({
    toast: mockToast,
}));

// 5. Mock localStorage
const localStorageMock = (function () {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// --- MOCK TYPES (Simplified for testing) ---
// Note: In a real project, these would be imported from the core types files.

interface IResponse<T> {
    Status: boolean;
    Data: T;
    Message?: string[];
}
interface ApiError extends Error {
    response?: { data: any; status: number; };
}
interface IUserPersonalityPayload {
    userType: string;
    // Added other fields to satisfy potential strict checks in implementation
    score: number;
    description: string;
}

type IUserPersonalityResponse = { personalityId: string } | null;


// --- REACT QUERY TEST SETUP ---

// Function to create a fresh QueryClient for each test
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: { retry: false, staleTime: Infinity },
        mutations: { retry: false },
    },
});

// Wrapper component to provide the QueryClient context
function TestWrapper({ children, client }: { children: React.ReactNode, client: QueryClient }) {
    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
}

// --- TEST SUITE ---

describe('useAddPersonality', () => {
    let queryClient: QueryClient;
    const payload: IUserPersonalityPayload = { userType: 'ENTJ', score: 95, description: 'Test Description' };

    beforeEach(() => {
        // Reset mocks and create a fresh client before each test
        vi.clearAllMocks();
        localStorageMock.clear();
        queryClient = createTestQueryClient();

        // Spy on queryClient methods used in onSuccess
        vi.spyOn(queryClient, 'invalidateQueries');
        vi.spyOn(queryClient, 'removeQueries');
    });

    // Scenario 1: Successful API call with Status: true
    it('should handle successful API response and run all onSuccess logic', async () => {
        const successResponse: IResponse<IUserPersonalityResponse> = {
            Status: true,
            Data: { personalityId: 'P123' },
            Message: [],
        };
        
        mockAxiosPost.mockResolvedValueOnce({ data: successResponse });

        const { result } = renderHook(() => useAddPersonality(), {
            wrapper: ({ children }) => <TestWrapper client={queryClient}>{children}</TestWrapper>,
        });

        // 1. Trigger the mutation
        result.current.handleAddPersonality(payload);

        // 2. Await completion
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        
        // 3. Check API call
        expect(mockAxiosPost).toHaveBeenCalledWith('/Personality/AddPersonlityUser', payload);
        
        // 4. Check localStorage updates
        expect(localStorage.setItem).toHaveBeenCalledWith('userPersonalityType', 'ENTJ');
        expect(localStorage.setItem).toHaveBeenCalledWith('userPersonalityId', 'P123');
        expect(localStorage.setItem).toHaveBeenCalledWith('personalitySelectedAt', expect.any(String));

        // 5. Check query invalidation/removal
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['userPersonality'] });
        expect(queryClient.removeQueries).toHaveBeenCalledWith({ queryKey: ['userPersonality'] });

        // 6. Check success toast
        expect(mockToast.success).toHaveBeenCalledWith('شخصیت شما با موفقیت انتخاب شد');
        expect(mockToast.error).not.toHaveBeenCalled();
    });
    
    // Scenario 2: Successful API call but application status is false (business error)
    it('should handle API response where Status is false and show error messages', async () => {
        const failedAppResponse: IResponse<IUserPersonalityResponse> = {
            Status: false,
            Data: null,
            Message: ['ERROR_CODE_1', 'ERROR_CODE_2'],
        };
        
        mockAxiosPost.mockResolvedValueOnce({ data: failedAppResponse });

        const { result } = renderHook(() => useAddPersonality(), {
            wrapper: ({ children }) => <TestWrapper client={queryClient}>{children}</TestWrapper>,
        });

        // 1. Trigger the mutation
        result.current.handleAddPersonality(payload);

        // 2. Await completion (react-query considers this success because HTTP status is 200)
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        // 3. Check error toast for each message
        expect(mockGetTranslation).toHaveBeenCalledWith('ERROR_CODE_1');
        expect(mockGetTranslation).toHaveBeenCalledWith('ERROR_CODE_2');
        expect(mockToast.error).toHaveBeenCalledTimes(2);
        expect(mockToast.error).toHaveBeenCalledWith('Translated: ERROR_CODE_1');

        // 4. Ensure success side effects were skipped
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(queryClient.invalidateQueries).not.toHaveBeenCalledWith({ queryKey: ['userPersonality'] });
        expect(mockToast.success).not.toHaveBeenCalled();
    });

    // Scenario 3: Failed API call (network or HTTP error)
    it('should handle network/HTTP failure and run onError logic', async () => {
        const networkError: ApiError = {
            name: 'AxiosError',
            message: 'Network Error',
            // Mock a standard Axios error structure
            response: {
                status: 404,
                data: 'Not Found',
            }
        } as ApiError;

        mockAxiosPost.mockRejectedValueOnce(networkError);

        const { result } = renderHook(() => useAddPersonality(), {
            wrapper: ({ children }) => <TestWrapper client={queryClient}>{children}</TestWrapper>,
        });

        // 1. Trigger the mutation
        result.current.handleAddPersonality(payload);

        // 2. Await failure
        await waitFor(() => expect(result.current.status).toBe('error'));
        
        // 3. Check error toast from onError
        expect(mockToast.error).toHaveBeenCalledWith('خطا در انتخاب شخصیت. لطفاً دوباره تلاش کنید.');
        
        // 4. Ensure success side effects were skipped
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
        expect(mockToast.success).not.toHaveBeenCalled();
    });

});
