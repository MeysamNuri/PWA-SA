import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import HomePageDefaultItems from './defaultPageItemsHook';
import { useGetPageName } from '@/features/HomeCustomization/Hooks/APIHooks/useGetPageName';
import { PAGE_NAME_MAPPING } from '@/features/HomeCustomization/types';

// Mock the API hook
vi.mock('@/features/HomeCustomization/Hooks/APIHooks/useGetPageName', () => ({
  useGetPageName: vi.fn(),
}));

describe('HomePageDefaultItems', () => {
  it('maps pageNameData correctly and returns homeDefaultCustomeList', async () => {
    // Arrange: mock data
    const mockData = {
      Data: [
        { pageId: '1', pageName: 'salesrevenue' },
        { pageId: '2', pageName: 'availablefunds' },
      ],
    };

    (useGetPageName as any).mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    // Act: render hook
    const { result } = renderHook(() => HomePageDefaultItems());

    // Wait for useEffect to run
    await act(async () => {});

    // Assert: default customization list is mapped
    expect(result.current.homeDefaultCustomeList).toEqual([
      {
        isEnabled: true,
        pageId: '1',
        pageName: 'salesrevenue',
        persianTitle: PAGE_NAME_MAPPING['salesrevenue'],
        sort: 0,
      },
      {
        isEnabled: true,
        pageId: '2',
        pageName: 'availablefunds',
        persianTitle: PAGE_NAME_MAPPING['availablefunds'],
        sort: 1,
      },
    ]);

    // Assert: loading state
    expect(result.current.pageNameDataLoading).toBe(false);
  });

  it('returns undefined homeDefaultCustomeList when data is empty', async () => {
    (useGetPageName as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const { result } = renderHook(() => HomePageDefaultItems());

    await act(async () => {});

    expect(result.current.homeDefaultCustomeList).toBeUndefined();
    expect(result.current.pageNameDataLoading).toBe(true);
  });
});
