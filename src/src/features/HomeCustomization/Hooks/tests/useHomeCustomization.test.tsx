import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useHomeCustomization } from '../useHomeCustomization';

// 🔧 Mock hooks and dependencies
vi.mock('../APIHooks/useGetPageName', () => ({
  useGetPageName: vi.fn(),
}));

vi.mock('../APIHooks/useGetDisplaySetting', () => ({
  useGetDisplaySetting: vi.fn(),
}));

vi.mock('../APIHooks/useUpdatePageVisibility', () => ({
  useUpdateDisplaySetting: vi.fn(),
}));

// 🔧 Import mocked versions
import { useGetPageName } from '../APIHooks/useGetPageName';
import { useGetDisplaySetting } from '../APIHooks/useGetDisplaySetting';
import { useUpdateDisplaySetting } from '../APIHooks/useUpdatePageVisibility';

// ✅ Helper to create QueryClientProvider wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// ✅ Mock data
const mockPageNameData = {
  Data: [
    { pageId: '1', pageName: 'Page1' },
    { pageId: '2', pageName: 'Page2' },
    { pageId: '3', pageName: 'Page3' },
  ],
};

const mockDisplaySettingData = {
  Data: {
    displaySetting: [
      { pageName: 'Page1', sort: 0 },
      { pageName: 'Page2', sort: 1 },
      { pageName: 'Page3', sort: 2 },
    ],
  },
};

// ✅ Setup before each test
beforeEach(() => {
  vi.clearAllMocks();

  (useGetPageName as any).mockReturnValue({
    data: mockPageNameData,
    isLoading: false,
    error: null,
  });

  (useGetDisplaySetting as any).mockReturnValue({
    data: mockDisplaySettingData,
  });

  (useUpdateDisplaySetting as any).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue({ Status: true }),
    isPending: false,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('useHomeCustomization Hook', () => {
  it('should initialize with items from API data', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useHomeCustomization(), { wrapper });

    await waitFor(() => {
      expect(result.current.customizationItems).toHaveLength(3);
    });

    expect(result.current.customizationItems[0].pageName).toBe('Page1');
    expect(result.current.isLoading).toBe(false);
  });

  it('should toggle item isEnabled state', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useHomeCustomization(), { wrapper });

    await waitFor(() => {
      expect(result.current.customizationItems.length).toBe(3);
    });

    const firstItem = result.current.customizationItems[0];
    expect(firstItem.isEnabled).toBe(true);

    act(() => {
      result.current.toggleItem(firstItem.pageId);
    });

    const toggled = result.current.customizationItems.find(
      (i) => i.pageId === firstItem.pageId
    );
    expect(toggled?.isEnabled).toBe(false);
  });

  it('should reorder items correctly', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useHomeCustomization(), { wrapper });

    await waitFor(() => {
      expect(result.current.customizationItems.length).toBe(3);
    });

    const initialOrder = result.current.customizationItems.map((i) => i.pageId);
    expect(initialOrder).toEqual(['1', '2', '3']);

    act(() => {
      result.current.reorderItems('3', '1');
    });

    const reordered = result.current.customizationItems.map((i) => i.pageId);
    expect(reordered).toEqual(['3', '1', '2']);
  });

  it('should call API and save to localStorage on saveCustomization', async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({ Status: true });
    (useUpdateDisplaySetting as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useHomeCustomization(), { wrapper });

    await waitFor(() => {
      expect(result.current.customizationItems.length).toBe(3);
    });

    await act(async () => {
      await result.current.saveCustomization();
    });

    expect(mockMutateAsync).toHaveBeenCalledTimes(1);
    const stored = JSON.parse(localStorage.getItem('homeCustomization') || '[]');
    expect(Array.isArray(stored)).toBe(true);
    expect(localStorage.getItem('homeCustomization')).not.toBeNull();
    
  });
});
