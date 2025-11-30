import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useLayoutHooks from './hooks';
import { useThemeContext } from '@/core/context/useThemeContext';
import { useUserSerialStore } from '@/core/zustandStore';
import useUserProfile from '@/features/UserProfile/Hooks/APIHooks';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as any,
    useNavigate: vi.fn(),
  };
});

vi.mock('@/core/context/useThemeContext');
vi.mock('@/core/zustandStore');
vi.mock('@/features/UserProfile/Hooks/APIHooks');
vi.mock('@/core/components/icons');

describe('useLayoutHooks', () => {
  const mockNavigate = vi.fn();
  const mockSetUserSerial = vi.fn();
  const mockRemoveItem = vi.fn();
  
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: mockRemoveItem,
        getItem: vi.fn(),
      },
      writable: true,
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();

    (useNavigate as any).mockReturnValue(mockNavigate);
    (useThemeContext as any).mockReturnValue({ isDarkMode: false });
    // Correctly mock the Zustand store to return the setUserSerial function
    (useUserSerialStore as any).mockReturnValue(mockSetUserSerial);
    (useUserProfile as any).mockReturnValue({
      userProfileData: {
        getUserProfileDtos: [{ serial: '12345' }],
      },
    });
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/home',
      },
      writable: true,
    });
  });

  it('should return initial state and functions', () => {
    const { result } = renderHook(() => useLayoutHooks());

    expect(result.current.sidebarOpen).toBe(false);
    expect(result.current.openMenu).toBe(null);
    expect(result.current.menuItems.length).toBeGreaterThan(0);
    expect(typeof result.current.setSidebarOpen).toBe('function');
    expect(typeof result.current.setOpenMenu).toBe('function');
    expect(typeof result.current.handleLogout).toBe('function');
    expect(typeof result.current.handleClick).toBe('function');
    expect(typeof result.current.handleClickMenu).toBe('function');
    expect(result.current.hideAppBar).toBe(false);
  });

  it('should call localStorage.removeItem and navigate to /login on handleLogout', () => {
    const { result } = renderHook(() => useLayoutHooks());

    act(() => {
      result.current.handleLogout();
    });

    expect(mockRemoveItem).toHaveBeenCalledWith('authToken');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should navigate to the correct path and call onClose on handleClick', () => {
    const mockOnClose = vi.fn();
    const { result } = renderHook(() => useLayoutHooks({ onClose: mockOnClose }));
    const path = '/test-path';

    act(() => {
      result.current.handleClick(path);
    });

    expect(mockNavigate).toHaveBeenCalledWith(path);
    expect(mockOnClose).toHaveBeenCalled();
  });

 // This part goes after your existing tests, but within the main describe block.

it('should navigate to /user-profile on handleUserProfile call', () => {
  // Render the hook
  const { result } = renderHook(() => useLayoutHooks());

  // Act on the hook by calling the function
  act(() => {
      result.current.handleUserProfile();
  });

  // Assert that the mock navigation function was called with the correct path
  expect(mockNavigate).toHaveBeenCalledWith('/user-profile');
});



  it('should call setUserSerial with the correct serial from userProfileData', () => {
    // We already correctly mocked useUserProfile and useUserSerialStore
    // The useEffect hook should be triggered on the first render
    renderHook(() => useLayoutHooks());
    
    // Assert that the mock function was called with the correct serial
    expect(mockSetUserSerial).toHaveBeenCalledWith('12345');
  });
});