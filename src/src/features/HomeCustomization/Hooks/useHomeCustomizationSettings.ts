import { useState, useEffect } from 'react';
import type { HomeCustomizationItem } from '../types';
import { PAGE_NAME_MAPPING } from '../types';

export const useHomeCustomizationSettings = () => {
  const [enabledComponents, setEnabledComponents] = useState<string[]>([]);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('homeCustomization');
    if (savedSettings) {
      try {
        const parsedSettings: HomeCustomizationItem[] = JSON.parse(savedSettings);
        const enabledPageNames = parsedSettings
          .filter(item => item.isEnabled)
          .map(item => item.pageName);
        setEnabledComponents(enabledPageNames);
      } catch {
        setEnabledComponents(Object.keys(PAGE_NAME_MAPPING));
      }
    } else {
      setEnabledComponents(Object.keys(PAGE_NAME_MAPPING));
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      loadSettings();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isComponentEnabled = (pageName: string) => enabledComponents.includes(pageName);

  return {
    enabledComponents,
    isComponentEnabled,
  };
};
