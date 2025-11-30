import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomeView from './homeView';

// -----------------------
// Mock AjaxLoadingComponent
// -----------------------
vi.mock('@/core/components/ajaxLoadingComponent', () => ({
  default: () => <div data-testid="loading">Loading...</div>,
}));

// -----------------------
// Mock getComponentMap
// -----------------------
const mockGetComponentMap = vi.fn();
vi.mock('../Hooks/componentMapHook', () => ({
  getComponentMap: (...args: any[]) => mockGetComponentMap(...args),
}));

// -----------------------
// Mock useHomeCustomizationSettings
// -----------------------
const mockUseHomeCustomizationSettings = vi.fn();
vi.mock('@/features/HomeCustomization/Hooks/useHomeCustomizationSettings', () => ({
  useHomeCustomizationSettings: () => mockUseHomeCustomizationSettings(),
}));

// -----------------------
// Mock useTopProductsData
// -----------------------
const mockUseTopProductsData = vi.fn();
vi.mock('../Hooks/topProductsHooks', () => ({
  default: () => mockUseTopProductsData(),
}));

// -----------------------
// Mock useHomeHooks
// -----------------------
const mockUseHomeHooks = vi.fn();
vi.mock('../Hooks/homeHooks', () => ({
  default: () => mockUseHomeHooks(),
}));

describe('HomeView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -----------------------
  // TEST 1 — Loading State
  // -----------------------
  it('shows loading component when loading=true', () => {
    mockUseHomeHooks.mockReturnValue({
      parsedSortItems: [],
      currencyLoading: true,
      unsettledInvoicesLoading: true,
      availablefundsLoading: true,
      nearChequesLoading: true,
      pageNameDataLoading: true,
      salesRevenueLoading: true,
    });

    mockUseTopProductsData.mockReturnValue({ loading: true });
    mockUseHomeCustomizationSettings.mockReturnValue({
      isComponentEnabled: () => true,
    });

    render(<HomeView />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  // -----------------------
  // TEST 2 — Renders a mapped component
  // -----------------------
  it('renders component from getComponentMap', () => {
    mockUseHomeHooks.mockReturnValue({
      parsedSortItems: [{ pageId: 1, pageName: 'salesrevenue' }],
      currencyLoading: false,
      unsettledInvoicesLoading: false,
      availablefundsLoading: false,
      nearChequesLoading: false,
      pageNameDataLoading: false,
      salesRevenueLoading: false,
    });

    mockUseTopProductsData.mockReturnValue({ loading: false });

    mockUseHomeCustomizationSettings.mockReturnValue({
      isComponentEnabled: () => true,
    });

    mockGetComponentMap.mockReturnValue({
      salesrevenue: {
        Component: () => <div data-testid="mapped-component">Shown</div>,
        props: {},
      },
    });

    render(<HomeView />);
    expect(screen.getByTestId('mapped-component')).toBeInTheDocument();
  });

  // -----------------------
  // TEST 3 — Disabled component
  // -----------------------
  it('does not render component if isComponentEnabled=false', () => {
    mockUseHomeHooks.mockReturnValue({
      parsedSortItems: [{ pageId: 1, pageName: 'salesrevenue' }],
      currencyLoading: false,
      unsettledInvoicesLoading: false,
      availablefundsLoading: false,
      nearChequesLoading: false,
      pageNameDataLoading: false,
      salesRevenueLoading: false,
    });

    mockUseTopProductsData.mockReturnValue({ loading: false });

    mockUseHomeCustomizationSettings.mockReturnValue({
      isComponentEnabled: () => false,
    });

    mockGetComponentMap.mockReturnValue({
      salesrevenue: {
        Component: () => <div data-testid="mapped-component">Hidden</div>,
        props: {},
      },
    });

    render(<HomeView />);

    expect(screen.queryByTestId('mapped-component')).not.toBeInTheDocument();
  });
});
