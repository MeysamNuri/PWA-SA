import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpdateDisplaySetting } from '../useUpdatePageVisibility';
import axiosInstance from '@/core/constant/axios';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

// --- Mock dependencies ---
vi.mock('@tanstack/react-query');
vi.mock('@/core/constant/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useUpdateDisplaySetting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls mutationFn and shows success toast when Status is true', async () => {
    const payload = { DisplaySetting: [] };
    const mockResponse = { Status: true, Data: [] };

    (axiosInstance.post as any).mockResolvedValue({ data: mockResponse });
    (useMutation as any).mockImplementation(({ mutationFn, onSuccess }: any) => ({
      mutateAsync: async (p: any) => {
        const data = await mutationFn(p);
        onSuccess(data);
        return data;
      },
      isPending: false,
    }));

    const { result } = renderHook(() => useUpdateDisplaySetting());

    await act(async () => {
      const res = await result.current.mutateAsync(payload);
      expect(res).toEqual(mockResponse);
    });

    expect(toast.success).toHaveBeenCalledWith('تنظیمات صفحه با موفقیت ذخیره شد');
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('shows error toast when Status is false with messages', async () => {
    const payload = { DisplaySetting: [] };
    const mockResponse = { Status: false, Message: ['خطا1', 'خطا2'] };

    (axiosInstance.post as any).mockResolvedValue({ data: mockResponse });
    (useMutation as any).mockImplementation(({ mutationFn, onSuccess }: any) => ({
      mutateAsync: async (p: any) => {
        const data = await mutationFn(p);
        onSuccess(data);
        return data;
      },
      isPending: false,
    }));

    const { result } = renderHook(() => useUpdateDisplaySetting());

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    expect(toast.error).toHaveBeenCalledTimes(2);
    expect(toast.error).toHaveBeenCalledWith('خطا1');
    expect(toast.error).toHaveBeenCalledWith('خطا2');
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('shows error toast on mutation error', async () => {
    const payload = { DisplaySetting: [] };
    const mockError = new Error('Network Error');

    (axiosInstance.post as any).mockRejectedValue(mockError);
    (useMutation as any).mockImplementation(({ mutationFn, onError }: any) => ({
      mutateAsync: async (p: any) => {
        try {
          await mutationFn(p);
        } catch (e) {
          onError(e);
        }
      },
      isPending: false,
    }));

    const { result } = renderHook(() => useUpdateDisplaySetting());

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    expect(toast.error).toHaveBeenCalledWith(
      'خطا در ذخیره تنظیما ت. لطفاً دوباره تلاش کنید.'
    );
    expect(toast.success).not.toHaveBeenCalled();
  });
});
