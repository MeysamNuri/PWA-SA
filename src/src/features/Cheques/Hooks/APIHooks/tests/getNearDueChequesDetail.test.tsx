import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import useNearDueChequesDetailHook from '../getNearDueChequesDetail'; // Adjust the import path as needed
import type { IBanksChequeDetails } from '../../../types'; // Adjust the import path as needed
import { toast } from 'react-toastify';

// Mock the toast library to prevent it from rendering in the test environment
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock the translation utility since it's a helper function
vi.mock('@/core/helper/translationUtility', () => ({
  getTranslation: (message: string) => message,
}));

// Create a new QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// A wrapper component to provide the QueryClient context
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// --- Mock Service Worker Setup for API mocking ---
const mockSuccessfulData: IBanksChequeDetails = {
  nearDueChequesDtos: [
    {
      accountName: 'Account 1',
      bankAccountNumber: "test",
      bankCode: "01",
      bankName: 'Bank A',
      chequeAmount: 100000,
      direction: "payable",
      chequeNumber: '12345',
      formattedChequeAmount: '1,000,000',
      chequeAmountUOM: 'ریال',
      issueDate: '1402/01/01',
      dueDate: '1402/01/30',
    },
  ],
};

const mockFailedResponse = {
  Status: false,
  Message: ['خطا در دریافت اطلاعات'],
  Data: null,
};

const server = setupServer(
  http.get('*/Cheque/GetNearDueChequesDetail', ({ request }) => {
    const url = new URL(request.url);
    const directionType = url.searchParams.get('directionType');

    // This is a simple way to simulate different responses based on parameters
    // Note: The original code had a 'failed' directionType, but the error handling is likely based on the `Status: false` field in the response body, not the HTTP status code.
    if (directionType === 'failed') {
      return HttpResponse.json(mockFailedResponse, { status: 200 });
    }
    
    if (directionType === 'error') {
      return HttpResponse.error();
    }
    
    // Default success response
    return HttpResponse.json({
      Status: true,
      Message: [],
      Data: mockSuccessfulData,
    }, { status: 200 });
  }),
);

// Start the mock server before all tests
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks(); // Clear the toast mock
});
// Clean up the server after all tests
afterAll(() => server.close());

// --- Test Suite ---
describe('useNearDueChequesDetailHook', () => {

  // Test case for a successful API call
  it('should fetch and return data on a successful API call', async () => {
    const { result } = renderHook(
      // Use 'credit' as the directionType to trigger the success mock
      () => useNearDueChequesDetailHook('credit', 'today'),
      { wrapper: TestWrapper }
    );

    // Initial state check
    expect(result.current.isPending).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.nearDueChequesDetailsData).toBeUndefined();

    // Wait for the query to finish loading
    await waitFor(() => expect(result.current.isPending).toBe(false));

    // Final state check
    // expect(result.current.error).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.nearDueChequesDetailsData).toEqual(mockSuccessfulData);
    expect(result.current.error).toBeNull();
    // Ensure toast.error was not called on success
    expect(toast.error).not.toHaveBeenCalled();
  });

  // Test case for a failed API call (HTTP status 200, but data.Status is false)
  it('should call toast.error and not return data if the API returns a failed status', async () => {
    // The hook in the original test was not configured to trigger the `failed` mock.
    // The `useNearDueChequesDetailHook` must be called with a parameter that the mock server can use to return a failed response.
    const { result } = renderHook(
      () => useNearDueChequesDetailHook('failed', 'today'),
      { wrapper: TestWrapper }
    );

    // Wait for the query to finish loading
    await waitFor(() => expect(result.current.isPending).toBe(false));

    // Final state check
    expect(result.current.isPending).toBe(false);
    // isError is false because the HTTP request itself was successful (status 200)
    expect(result.current.isError).toBe(false); 
  
    // Ensure toast.error was called with the correct message
    expect(toast.error).toHaveBeenCalledWith('خطا در دریافت اطلاعات');
  });

  // Test case for a network error (e.g., server offline)
  it('should handle a network error and set isError to true', async () => {
    const { result } = renderHook(
      () => useNearDueChequesDetailHook('error', 'today'),
      { wrapper: TestWrapper }
    );

    // Initial state
    expect(result.current.isPending).toBe(true);
    expect(result.current.isError).toBe(false);
    
    // Wait for the query to fail and for isPending to become false
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Final state check after the waitFor condition is met
    expect(result.current.isPending).toBe(false);
    expect(result.current.nearDueChequesDetailsData).toBeUndefined();
    expect(result.current.error).toBeDefined(); // The error object should be defined
    
    // Ensure toast.error was not called for a network error
    expect(toast.error).not.toHaveBeenCalled();
  });

  // Test case to verify the correct URL and parameters are used
  it('should pass all parameters to the API call', async () => {
    const directionType = 'debit';
    const daysType = 'week';
    const bankAccountNumber = '12345';
    const bankCode = '001';

    // We can use a spy on the server to check the request URL
    const requestHandler = vi.fn();
    server.use(http.get('*/Cheque/GetNearDueChequesDetail', ({ request }) => {
      requestHandler(request);
      return HttpResponse.json({
          Status: true,
          Message: [],
          Data: mockSuccessfulData,
      });
    }));

    renderHook(
      () => useNearDueChequesDetailHook(directionType, daysType, bankAccountNumber, bankCode),
      { wrapper: TestWrapper }
    );

    await waitFor(() => expect(requestHandler).toHaveBeenCalled());
    const [request] = requestHandler.mock.calls[0];
    const url = new URL(request.url);

    expect(url.searchParams.get('directionType')).toBe(directionType);
    expect(url.searchParams.get('daysType')).toBe(daysType);
    expect(url.searchParams.get('bankAccountNumber')).toBe(bankAccountNumber);
    expect(url.searchParams.get('bankCode')).toBe(bankCode);
  });
});