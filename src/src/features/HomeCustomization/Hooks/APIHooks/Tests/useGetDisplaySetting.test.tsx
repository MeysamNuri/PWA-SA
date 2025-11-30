import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGetDisplaySetting } from '../useGetDisplaySetting';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';


// --- Mock dependencies ---
vi.mock('@tanstack/react-query');
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));
vi.mock('@/core/helper/translationUtility', () => ({
  getTranslation: vi.fn((msg: string) => `translated: ${msg}`),
}));

describe('useGetDisplaySetting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data when query succeeds', async () => {
    const mockData = {
      Status: true,
      Data: { displaySetting: [{ pageName: 'sales' }] },
    };

    (useQuery as any).mockReturnValue({
      data: mockData,
      isPending: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useGetDisplaySetting());

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('shows toast errors when data.Status is false', async () => {
    const mockData = {
      Status: false,
      Message: ['Error1', 'Error2'],
      Data: { displaySetting: [] },
    };

    (useQuery as any).mockReturnValue({
      data: mockData,
      isPending: false,
      isError: false,
      error: null,
    });

    renderHook(() => useGetDisplaySetting());

    // Wait for useEffect to run
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledTimes(2);
      expect(toast.error).toHaveBeenCalledWith('translated: Error1', { toastId: 'Error1' });
      expect(toast.error).toHaveBeenCalledWith('translated: Error2', { toastId: 'Error2' });
    });
  });

  it('handles missing data gracefully', async () => {
    (useQuery as any).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useGetDisplaySetting());

    expect(result.current.data).toBeUndefined();
    expect(result.current.isPending).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });
});
