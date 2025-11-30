import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react'; // <-- import waitFor here
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetPageName } from '../useGetPageName';
import axiosInstance from '@/core/constant/axios';
import type { GetPageNameResponse } from '../../../types';

// Mock axios
vi.mock('@/core/constant/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useGetPageName', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('should fetch page name successfully', async () => {
    const mockData: GetPageNameResponse = { Data: [],HttpStatusCode:200,Message:"",RequestUrl:"",Status:true};
    (axiosInstance.get as any).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useGetPageName(), { wrapper });

    // Wait until the query is successful
    await waitFor(() => {
      if (!result.current.isSuccess) throw new Error('Not ready yet');
    });

    expect(result.current.data).toEqual(mockData);
    expect(axiosInstance.get).toHaveBeenCalledWith('/UserAuth/GetPageName');
  });

  it('should handle error', async () => {
    (axiosInstance.get as any).mockRejectedValue(new Error('Network Error'));

 
  });
});
