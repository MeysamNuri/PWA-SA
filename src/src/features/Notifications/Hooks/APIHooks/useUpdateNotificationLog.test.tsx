// useUpdateNotificationLogHooks.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useUpdateNotificationLogHooks from './useUpdateNotificationLog';
import axiosInstance from '@/core/constant/axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock axios
vi.mock('@/core/constant/axios');

const queryClient = new QueryClient();

describe('useUpdateNotificationLogHooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful mutation', async () => {
    const mockResponse = { Status: true, Message: [], Data: [] };
    (axiosInstance.post as unknown as any).mockResolvedValue({ data: mockResponse });

    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUpdateNotificationLogHooks(), { wrapper });

    await act(async () => {
      result.current.handleUpdateNotice('123');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.responseData).toEqual(mockResponse);
    expect(axiosInstance.post).toHaveBeenCalledWith('/Notification/UpdateNotificationLog?ids=123');
  });

  it('should handle mutation error', async () => {
    const mockError = { message: 'Failed' };
    (axiosInstance.post as unknown as any).mockRejectedValue(mockError);

    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUpdateNotificationLogHooks(), { wrapper });

    await act(async () => {
        result.current.handleUpdateNotice('123');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(false));
    expect(result.current.responseData).toBeUndefined();
  });
});
