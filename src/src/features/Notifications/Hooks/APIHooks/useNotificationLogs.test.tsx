// useNotificationsLogAPIHook.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useNotificationsLogAPIHook from './useNotificationLogs';
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getTranslation } from '@/core/helper/translationUtility';

// Mocks
vi.mock('@/core/constant/axios');
vi.mock('react-toastify');
vi.mock('@/core/helper/translationUtility');

const queryClient = new QueryClient();

describe('useNotificationsLogAPIHook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch notification data successfully', async () => {
    const mockData = {
      Status: true,
      Message: [],
      Data: [{ id: 1, title: 'Test Notification' }]
    };
    (axiosInstance.get as unknown as any).mockResolvedValue({ data: mockData });

    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useNotificationsLogAPIHook(true, 1, 5), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.notificationsData).toEqual(mockData.Data);
    expect(result.current.isPending).toBe(false);
    expect(result.current.status).toBe('success');
  });

  it('should call toast.error for failed status', async () => {
    const mockData = {
      Status: false,
      Message: ['error_1'],
      Data: []
    };
    (axiosInstance.get as unknown as any).mockResolvedValue({ data: mockData });
    (getTranslation as unknown as any).mockImplementation((msg: string) => `Translated: ${msg}`);

    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    renderHook(() => useNotificationsLogAPIHook(), { wrapper });

    // Wait for useEffect to run
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Translated: error_1', { toastId: 'error_1' }));
  });

  it('should call refetch function', async () => {
    const mockData = { Status: true, Message: [], Data: [] };
    (axiosInstance.get as unknown as any).mockResolvedValue({ data: mockData });

    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useNotificationsLogAPIHook(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await act(async () => {
      await result.current.refetch();
    });

    expect(axiosInstance.get).toHaveBeenCalledTimes(2); // initial + refetch
  });
});
