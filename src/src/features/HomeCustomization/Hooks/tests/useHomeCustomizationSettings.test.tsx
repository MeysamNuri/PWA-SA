import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useHomeCustomizationSettings } from '../useHomeCustomizationSettings';
import { PAGE_NAME_MAPPING } from '../../types';

// Mock localStorage
const mockLocalStorage: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => mockLocalStorage[key] ?? null,
  setItem: (key: string, value: string) => { mockLocalStorage[key] = value; },
  removeItem: (key: string) => { delete mockLocalStorage[key]; },
  clear: () => { Object.keys(mockLocalStorage).forEach(key => delete mockLocalStorage[key]); },
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useHomeCustomizationSettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should load enabled components from localStorage', async () => {
    const savedSettings = JSON.stringify([
      { pageName: 'dynamicCard', isEnabled: true },
      { pageName: 'availablefunds', isEnabled: true },
      { pageName: 'salesrevenue', isEnabled: false },
    ]);
    localStorage.setItem('homeCustomization', savedSettings);

    const { result } = renderHook(() =>
      useHomeCustomizationSettings()
    );

    await waitFor(() => {
      expect(result.current.enabledComponents.sort()).toEqual(
        ['dynamicCard', 'availablefunds'].sort()
      );
    });
  });

  it('should fall back to all components when no saved settings', async () => {
    const { result } = renderHook(() =>
      useHomeCustomizationSettings()
    );

    await waitFor(() => {
      expect(result.current.enabledComponents.sort()).toEqual(
        Object.keys(PAGE_NAME_MAPPING).sort()
      );
    });
  });

  it('should handle invalid JSON gracefully', async () => {
    localStorage.setItem('homeCustomization', 'invalid-json');

    const { result } = renderHook(() =>
      useHomeCustomizationSettings()
    );

    await waitFor(() => {
      expect(result.current.enabledComponents.sort()).toEqual(
        Object.keys(PAGE_NAME_MAPPING).sort()
      );
    });
  });

  it('should update enabledComponents on storage event', async () => {
    const { result } = renderHook(() =>
      useHomeCustomizationSettings()
    );

    await waitFor(() => {
      // wait for initial state
      expect(result.current.enabledComponents.length).toBeGreaterThan(0);
    });

    // simulate storage event
    const newSettings = JSON.stringify([
      { pageName: 'dynamicCard', isEnabled: true },
      { pageName: 'availablefunds', isEnabled: false },
    ]);
    localStorage.setItem('homeCustomization', newSettings);

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'homeCustomization' }));
    });

    await waitFor(() => {
      expect(result.current.enabledComponents).toEqual(['dynamicCard']);
    });
  });

  it('isComponentEnabled should return true/false correctly', async () => {
    const savedSettings = JSON.stringify([
      { pageName: 'dynamicCard', isEnabled: true },
      { pageName: 'availablefunds', isEnabled: false },
    ]);
    localStorage.setItem('homeCustomization', savedSettings);

    const { result } = renderHook(() =>
      useHomeCustomizationSettings()
    );

    await waitFor(() => {
      expect(result.current.isComponentEnabled('dynamicCard')).toBe(true);
      expect(result.current.isComponentEnabled('availablefunds')).toBe(false);
    });
  });
});
