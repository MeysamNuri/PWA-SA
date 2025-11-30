import { createContext } from 'react';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
    themeMode: 'light' | 'dark';
    isThemeLoaded: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
