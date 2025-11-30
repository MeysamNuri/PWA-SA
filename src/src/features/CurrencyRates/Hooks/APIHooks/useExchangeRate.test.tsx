import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useExchangeRateData from './useExchangeRate';
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';
import type { IResponse } from '@/core/types/responseModel';
import type { ExchangeRateItem } from '../../types';

// --- Mock axios ---
vi.mock('@/core/constant/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

// --- Mock toast ---
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

// --- Mock getTranslation ---
vi.mock('@/core/helper/translationUtility', () => ({
  getTranslation: vi.fn((msg) => msg),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useExchangeRateData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches exchange rate data successfully', async () => {
    const mockData: IResponse<ExchangeRateItem[]> = {
      Status: true,
      Message: [],
      Data: [
        {
          title: 'Test',
          name: 'USD',
          price: '30000',
          rateOfChange: '0.5',
          category: 'currency',
          highestRate: '30500',
          lowestRate: '29500',
          sourceCreated: '',
        },
      ],
      HttpStatusCode: 200,
      RequestUrl: '/mock-url',
    };

    (axiosInstance.get as unknown as any).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useExchangeRateData(), { wrapper });

    // Wait until data is fetched
    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls toast.error when Status is false', async () => {
    const mockErrorData: IResponse<ExchangeRateItem[]> = {
      Status: false,
      Message: ['خطا1', 'خطا2'],
      Data: [],
      HttpStatusCode: 400,
      RequestUrl: '/mock-url',
    };

    (axiosInstance.get as unknown as any).mockResolvedValue({ data: mockErrorData });

    const { result } = renderHook(() => useExchangeRateData(), { wrapper });

    // Wait for toast to be called
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledTimes(2);
    });

    expect(toast.error).toHaveBeenCalledWith('خطا1');
    expect(toast.error).toHaveBeenCalledWith('خطا2');

    expect(result.current.data).toEqual(mockErrorData);
    expect(result.current.isPending).toBe(false);
  });
});
