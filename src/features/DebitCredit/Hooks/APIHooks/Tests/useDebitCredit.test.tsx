import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import useDebitCreditTotals from '../useDebitCredit';
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';

// Mock toast
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn()
  }
}));

// Mock axios
vi.mock('@/core/constant/axios', () => ({
  default: {
    get: vi.fn()
  }
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useDebitCreditTotals', () => {
  it('returns data on success', async () => {
    const mockData = {
      totalCreditAmount: 5000000,
      formattedTotalCreditAmount: '5,000,000',
      totalCreditAmountUOM: 'ریال',
      totalDebitAmount: 3000000,
      formattedTotalDebitAmount: '3,000,000',
      totalDebitAmountUOM: 'ریال',
      balanceAmount: 2000000,
      formattedBalanceAmount: '2,000,000'
    };

    (axiosInstance.get as any).mockResolvedValue({
      data: {
        Status: true,
        Message: [],
        Data: mockData
      }
    });

    const { result } = renderHook(() => useDebitCreditTotals(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
      expect(result.current.data?.Data).toEqual(mockData);
    });
  });

  it('shows toast when Status is false', async () => {
    (axiosInstance.get as any).mockResolvedValue({
        data: {
            Status: false,
            Message: ['Error1', 'Error2'],
            Data: null
        }
    });

    renderHook(() => useDebitCreditTotals(), {
        wrapper: createWrapper()
    });

    await waitFor(() => {
        expect(toast.error).toHaveBeenCalledTimes(2);
    });
});

});
