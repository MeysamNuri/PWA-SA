import { describe, it, expect } from 'vitest';
import { CurrencyRatesRoutes } from './routes';
import CurrencyRatesView from './Views';
import ProtectedLayout from '@/core/layouts/ProtectedLayout';

// This test suite focuses on validating the structure of the CurrencyRatesRoutes configuration array.
describe('CurrencyRatesRoutes', () => {
  // Test case to check if the route array is correctly defined.
  it('should define the correct route structure', () => {
    // Assert that the CurrencyRatesRoutes is an array with a single top-level route object.
    expect(Array.isArray(CurrencyRatesRoutes)).toBe(true);
    expect(CurrencyRatesRoutes).toHaveLength(1);

    const mainRoute = CurrencyRatesRoutes[0];

    // Assert that the top-level route object has the expected properties.
    expect(mainRoute).toHaveProperty('path', '/currencyRates');
    expect(mainRoute).toHaveProperty('Component', ProtectedLayout);
    expect(mainRoute).toHaveProperty('children');

    // Assert that the children property is an array with four nested routes.
    const childRoutes: any = mainRoute.children;
    expect(Array.isArray(childRoutes)).toBe(true);
    expect(childRoutes).toHaveLength(4);

    // Test the main currency rates route
    const mainCurrencyRoute = childRoutes[0];
    expect(mainCurrencyRoute).toHaveProperty('path', '/currencyRates');
    expect(mainCurrencyRoute).toHaveProperty('Component', CurrencyRatesView);

    // Test the currency tab route
    const currencyTabRoute = childRoutes[1];
    expect(currencyTabRoute).toHaveProperty('path', '/currencyRates/currency');
    expect(currencyTabRoute).toHaveProperty('Component', CurrencyRatesView);

    // Test the coin tab route
    const coinTabRoute = childRoutes[2];
    expect(coinTabRoute).toHaveProperty('path', '/currencyRates/coin');
    expect(coinTabRoute).toHaveProperty('Component', CurrencyRatesView);

    // Test the gold tab route
    const goldTabRoute = childRoutes[3];
    expect(goldTabRoute).toHaveProperty('path', '/currencyRates/gold');
    expect(goldTabRoute).toHaveProperty('Component', CurrencyRatesView);
  });

  // Test case to verify all routes use the same component
  it('should use CurrencyRatesView component for all child routes', () => {
    const mainRoute = CurrencyRatesRoutes[0];
    const childRoutes: any = mainRoute.children;

    childRoutes.forEach((route: any) => {
      expect(route.Component).toBe(CurrencyRatesView);
    });
  });

  // Test case to verify the route paths are correctly formatted
  it('should have properly formatted route paths', () => {
    const mainRoute = CurrencyRatesRoutes[0];
    const childRoutes: any = mainRoute.children;

    const expectedPaths = [
      '/currencyRates',
      '/currencyRates/currency',
      '/currencyRates/coin',
      '/currencyRates/gold'
    ];

    const actualPaths = childRoutes.map((route: any) => route.path);
    
    expectedPaths.forEach((expectedPath, index) => {
      expect(actualPaths[index]).toBe(expectedPath);
    });
  });

  // Test case to verify the main route is protected
  it('should use ProtectedLayout for the main route', () => {
    const mainRoute = CurrencyRatesRoutes[0];
    expect(mainRoute.Component).toBe(ProtectedLayout);
  });

  // Test case to verify route structure matches expected pattern
  it('should follow the expected nested route pattern', () => {
    const mainRoute = CurrencyRatesRoutes[0];
    
    // Verify main route structure
    expect(mainRoute).toHaveProperty('path');
    expect(mainRoute).toHaveProperty('Component');
    expect(mainRoute).toHaveProperty('children');
    
    // Verify children are properly structured
    const childRoutes: any = mainRoute.children;
    childRoutes.forEach((childRoute: any) => {
      expect(childRoute).toHaveProperty('path');
      expect(childRoute).toHaveProperty('Component');
      expect(typeof childRoute.path).toBe('string');
      expect(typeof childRoute.Component).toBe('function');
    });
  });
});
