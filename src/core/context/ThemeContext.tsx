import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext } from './ThemeContext.ts';

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme-mode');
        return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
    
    const [isThemeLoaded, setIsThemeLoaded] = useState(false);

    useEffect(() => {
        // Set theme immediately to prevent flash
        const savedTheme = localStorage.getItem('theme-mode');
        const initialTheme = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        setIsDarkMode(initialTheme);
        setIsThemeLoaded(true);
        
        // Update document attribute immediately
        document.documentElement.setAttribute('data-mui-color-scheme', initialTheme ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        if (!isThemeLoaded) return;
        
        localStorage.setItem('theme-mode', isDarkMode ? 'dark' : 'light');
        
        // Update document attribute for CSS variables
        document.documentElement.setAttribute('data-mui-color-scheme', isDarkMode ? 'dark' : 'light');
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('theme-changed', { 
            detail: { mode: isDarkMode ? 'dark' : 'light' } 
        }));
    }, [isDarkMode, isThemeLoaded]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const value: {
        isDarkMode: boolean;
        toggleTheme: () => void;
        themeMode: 'light' | 'dark';
        isThemeLoaded: boolean;
    } = {
        isDarkMode,
        toggleTheme,
        themeMode: isDarkMode ? 'dark' : 'light',
        isThemeLoaded
    };

    // Don't render children until theme is loaded
    if (!isThemeLoaded) {
        return null;
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
