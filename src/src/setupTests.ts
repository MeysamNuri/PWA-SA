import '@testing-library/jest-dom/vitest'
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock matchMedia for theme detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
global.localStorage = localStorageMock as Storage;

Object.defineProperty(import.meta, 'env', {
  writable: true,
  value: {
    ...import.meta.env,
    BASE_URL: '/',
  },
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock MUI theme to fix palette.button.main errors
vi.mock('@mui/material/styles', async () => {
  const actual = await vi.importActual('@mui/material/styles');
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        mode: 'light',
        primary: {
          main: '#484B51',
          light: '#565A62',
          dark: '#262626',
          contrastText: '#FFFFFF',
        },
        background: {
          default: '#ECEFF1',
          paper: '#FFFFFF',
        },
        text: {
          primary: '#262626',
          secondary: '#484B51',
          disabled: '#A0A4AB',
        },
        button: {
          main: '#E42628',
          light: '#F3F5F6',
          dark: '#b71c1c',
          contrastText: '#FFFFFF',
        },
        error: {
          main: '#E42628',
          light: '#F44336',
          dark: '#c62828',
          contrastText: '#FFFFFF',
        },
        success: {
          main: '#03CC77',
          dark: '#288542',
          light: '#68F3B8',
          contrastText: '#FFFFFF',
        },
        warning: {
          main: '#FF9800',
          light: '#FFB74D',
          dark: '#F57C00',
          contrastText: '#FFFFFF',
        },
        info: {
          main: '#2196F3',
          light: '#64B5F6',
          dark: '#1976D2',
          contrastText: '#FFFFFF',
        },
        divider: '#F3F5F6',
        action: {
          hover: 'rgba(0, 0, 0, 0.04)',
        },
        grey: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          700: '#616161',
          800: '#424242',
        },
      },
      shadows: [
        'none',
        '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
        '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
        '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
        '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
      ],
    }),
  };
});

// Mock ThemeContext to fix useThemeContext errors
vi.mock('@/core/context/useThemeContext', () => ({
  useThemeContext: () => ({
    isDarkMode: false,
    toggleTheme: vi.fn(),
    themeMode: 'light',
  }),
}));

// Mock console.error to suppress theme-related warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('theme') || args[0].includes('palette'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});