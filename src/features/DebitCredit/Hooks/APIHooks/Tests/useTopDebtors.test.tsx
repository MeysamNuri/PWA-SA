import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import GetTopNDebtorsItems from '../useTopDebtors';
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

describe('useTopNDebtors', () => {
    it('returns data on success', async () => {
        const mockData = {
            code: '12345678',
            name: 'اسم ',
            customerCode: '12345600',
            tel: '55889966',
            mobile: '091236589666',
            sumBed: 10,
            formattedSumBed: '10',
            sumBedUOM: 'ریال',
            sumBes: 1000000,
            formattedSumBes: '110000',
            sumBesUOM: 'ریال',
            price: 100000,
            formattedPrice: '1000',
            priceUOM: 'ریال',
        };

        (axiosInstance.get as any).mockResolvedValue({
            data: {
                Status: true,
                Message: [],
                Data: mockData
            }
        });

        const { result } = renderHook(() => GetTopNDebtorsItems(), {
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
    
        renderHook(() => GetTopNDebtorsItems(), {
            wrapper: createWrapper()
        });
    
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledTimes(2);
        });
    });
    
});
