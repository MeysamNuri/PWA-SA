 
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useGetAvailableFunds from '../getAvailableFunds';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { IResponse } from '@/core/models/responseModel';
import type {IAvailableFundsResponse} from '../../../types'
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';
// --- Mocking Dependencies ---

// Mock the axios instance to control API responses
vi.mock('@/core/constant/axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

// Mock the react-toastify toast function
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

// Mock the translation utility
vi.mock('@/core/helper/translationUtility', () => ({
    getTranslation: (message: string) => `Translated: ${message}`,
}));

// Create a client for react-query
const queryClient = new QueryClient({
    // Disable retries to speed up tests
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

// A wrapper component to provide the QueryClientProvider to our hook
const TestComponentWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

// A simple component to render the hook's state for testing
const TestComponent = () => {
    const { availableFundsData, isPending, isError, error } = useGetAvailableFunds();

    if (isPending) {
        return <div data-testid="loading">Loading...</div>;
    }

    if (isError) {
        return <div data-testid="error">{error?.message}</div>;
    }

    if (availableFundsData) {
        return <div data-testid="data">{JSON.stringify(availableFundsData)}</div>;
    }

    return null;
};

// --- Test Suite ---
describe('useGetAvailableFunds', () => {
    // Reset mocks and clear the query cache before each test
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    it('should show a loading state initially and then render data on success', async () => {
        // Arrange
        // Now including all required properties for IAvailableFundsResponse
        const mockData: IResponse<IAvailableFundsResponse> = {
            Status: true,
            Message: [],
            Data: {
                availableFundsReportResponseDtos: [],
                totalBalance: 12345,
                totalBalanceUOM: 'ریال',
                formattedTotalBalance: '12,345',
                totalBalanceInDollar: 123,
            },
            RequestUrl: '/AvailableFunds/GetAvailableFunds',
            HttpStatusCode: 200,
        };
        // Mock a successful API response
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockData });

        // Act
        render(<TestComponent />, { wrapper: TestComponentWrapper });

        // Assert initial state: loading
        expect(screen.getByTestId('loading')).toBeInTheDocument();

        // Wait for the query to finish and the data to be rendered
        await waitFor(() => {
            expect(screen.getByTestId('data')).toBeInTheDocument();
            const renderedData = JSON.parse(screen.getByTestId('data').textContent || '');
            expect(renderedData).toEqual(mockData.Data);
        });

        // Ensure toast was not called
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('should handle an API error and show an error message', async () => {
        // Arrange
        const mockError = new Error('Network error');
        vi.mocked(axiosInstance.get).mockRejectedValueOnce(mockError);

        // Act
        render(<TestComponent />, { wrapper: TestComponentWrapper });

        // Assert initial state: loading
        expect(screen.getByTestId('loading')).toBeInTheDocument();

        // Wait for the error state to be rendered
        await waitFor(() => {
            expect(screen.getByTestId('error')).toBeInTheDocument();
            expect(screen.getByTestId('error')).toHaveTextContent(mockError.message);
        });

        // Ensure toast was not called on a network error
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('should call toast.error when the API status is false', async () => {
        // Arrange
        // Corrected the type of the mock data to allow Data to be null
        const mockData: IResponse<IAvailableFundsResponse | null> = {
            Status: false,
            Message: ['error message 1', 'error message 2'],
            Data: null,
            RequestUrl: '/AvailableFunds/GetAvailableFunds',
            HttpStatusCode: 400,
        };
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockData });

        // Act
        render(<TestComponent />, { wrapper: TestComponentWrapper });

        // Wait for the query to settle and the toast calls to happen
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledTimes(2);
            expect(toast.error).toHaveBeenCalledWith('Translated: error message 1');
            expect(toast.error).toHaveBeenCalledWith('Translated: error message 2');
        });

        // The data element should not be rendered
        expect(screen.queryByTestId('data')).not.toBeInTheDocument();
    });
});
