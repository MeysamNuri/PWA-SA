import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useGetBankBalance from '../getBankBalance';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { IResponse } from '@/core/models/responseModel';
import type {IBankBalanceResponse} from '../../../types'
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';

// --- Mocking Dependencies ---

// Mock the axios instance to control the API response.
vi.mock('@/core/constant/axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

// Mock the react-toastify toast function to check if it's called.
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

// Mock the translation utility to control the output.
vi.mock('@/core/helper/translationUtility', () => ({
    getTranslation: (message: string) => `Translated: ${message}`,
}));

// Create a new QueryClient for each test to ensure a clean state.
const queryClient = new QueryClient({
    // Disable retries to prevent tests from taking too long on failure.
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

// A wrapper component to provide the QueryClientProvider to the hook.
const TestComponentWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

// A simple component to use and display the hook's state for testing.
const TestComponent = () => {
    const { bankBalanceData, isPending, isError, error } = useGetBankBalance();

    if (isPending) {
        return <div data-testid="loading">Loading...</div>;
    }

    if (isError) {
        return <div data-testid="error">{error?.message}</div>;
    }

    if (bankBalanceData) {
        return <div data-testid="data">{JSON.stringify(bankBalanceData)}</div>;
    }

    return null;
};

// --- Test Suite ---
describe('useGetBankBalance', () => {
    // Reset mocks and clear the query cache before each test.
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    it('should show a loading state initially and then render data on success', async () => {
        // Arrange
        const mockData: IResponse<IBankBalanceResponse> = {
            Status: true,
            Message: [],
            Data: {
                bankAccountsBalanceOutputs: [],
                totalBalance: 1234,
                totalBalanceUOM: "ریال",
                formattedTotalBalance: "15",
                totalBalanceInDollar: 14444
            },
            RequestUrl: '/AvailableFunds/GetBankBalance',
            HttpStatusCode: 200,
        };
        // Mock a successful API response.
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockData });

        // Act
        render(<TestComponent />, { wrapper: TestComponentWrapper });

        // Assert initial state: loading
        expect(screen.getByTestId('loading')).toBeInTheDocument();

        // Wait for the query to finish and the data to be rendered.
        await waitFor(() => {
            expect(screen.getByTestId('data')).toBeInTheDocument();
            const renderedData = JSON.parse(screen.getByTestId('data').textContent || '');
            expect(renderedData).toEqual(mockData.Data);
        });

        // Ensure no error toasts were shown.
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('should handle an API error and call toast.error', async () => {
        // Arrange
        const mockData: IResponse<IBankBalanceResponse | null> = {
            Status: false,
            Message: ['Bank balance not found'],
            Data: null,
            RequestUrl: '/AvailableFunds/GetBankBalance',
            HttpStatusCode: 400,
        };
        // Mock a failed API response.
        vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockData });

        // Act
        render(<TestComponent />, { wrapper: TestComponentWrapper });

        // Wait for the query to settle and the toast calls to happen.
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledTimes(1);
            expect(toast.error).toHaveBeenCalledWith('Translated: Bank balance not found');
        });

        // The data element should not be rendered.
        expect(screen.queryByTestId('data')).not.toBeInTheDocument();
    });

    it('should handle a network error and show an error message', async () => {
        // Arrange
        const mockError = new Error('Network error');
        vi.mocked(axiosInstance.get).mockRejectedValueOnce(mockError);

        // Act
        render(<TestComponent />, { wrapper: TestComponentWrapper });

        // Assert initial state: loading
        expect(screen.getByTestId('loading')).toBeInTheDocument();

        // Wait for the error state to be rendered.
        await waitFor(() => {
            expect(screen.getByTestId('error')).toBeInTheDocument();
            expect(screen.getByTestId('error')).toHaveTextContent(mockError.message);
        });

        // Ensure no error toasts were shown for a network error.
        expect(toast.error).not.toHaveBeenCalled();
    });
});
