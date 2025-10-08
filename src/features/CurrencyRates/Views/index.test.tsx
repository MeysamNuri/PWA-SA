// CurrencyRatesView.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CurrencyRatesView from './index';
import useCurrencyRatesHook from '../Hooks/useCurrencyRates';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ExchangeRateItem } from '../types';

// Mock the custom hook to control its return values for different test scenarios.
vi.mock('../Hooks/useCurrencyRates');

// Mock all child components and helper functions to isolate the component being tested.
vi.mock('@/core/components/innerPagesHeader', () => ({
  default: vi.fn(({ title, path }) => (
    <div data-testid="inner-page-header">
      {title} - {path}
    </div>
  )),
}));

vi.mock('@/core/components/ToggleTab', () => ({
  default: vi.fn(({ value, onChange, options }) => (
    <div data-testid="toggle-tab" onClick={() => onChange('newTab')}>
      {options.map((option: { value: string, label: string }) => option.label).join(', ')} - {value}
    </div>
  )),
}));

vi.mock('@/core/components/ajaxLoadingComponent', () => ({
  default: () => <div data-testid="ajax-loading-component">Loading...</div>,
}));

vi.mock('@/core/components/profitNotFound', () => ({
  default: vi.fn(({ message }) => (
    <div data-testid="profit-not-found">{message}</div>
  )),
}));

vi.mock('@/core/components/MainCard/MainCard', () => ({
  default: vi.fn(({ headerTitle }) => (
    <div data-testid="main-card">{headerTitle}</div>
  )),
}));

vi.mock('@/core/helper/numberConverter', () => ({
  NumberConverter: {
    formatTime: vi.fn(() => '10:00'),
    latinToArabic: vi.fn((str) => str.replace(/\d/g, (d:any) => ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'][parseInt(d)])),
  },
}));

// Setup a React Query client for testing purposes.
const queryClient = new QueryClient();

// A wrapper to provide the QueryClientProvider context.
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('CurrencyRatesView', () => {
  beforeEach(() => {
    // Clear all mock calls before each test to ensure isolation.
    vi.clearAllMocks();
  });

  it('displays a loading component when data is pending', () => {
    // Mock the hook to return a loading state.
    vi.mocked(useCurrencyRatesHook).mockReturnValue({
      isPending: true,
      isError: false,
      error: null,
      filteredData: [],
      tabs: [],
      findDollar: null,
      handleTabClick: vi.fn(),
      selectedTab: 'goldRates',
    });

    render(<CurrencyRatesView />, { wrapper });

    // Expect the loading component to be in the document.
    expect(screen.getByTestId('ajax-loading-component')).toBeInTheDocument();
  });

  it('displays an error message when there is an error', () => {
    // Mock the hook to return an error state.
    const mockError = { message: 'Test error message' };
    vi.mocked(useCurrencyRatesHook).mockReturnValue({
      isPending: false,
      isError: true,
      error: mockError as any,
      filteredData: [],
      tabs: [],
      findDollar: null,
      handleTabClick: vi.fn(),
      selectedTab: 'goldRates',
    });

    render(<CurrencyRatesView />, { wrapper });

    // Expect the error message to be displayed.
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('displays "not found" message when data is empty', () => {
    // Mock the hook to return a successful state with no data.
    vi.mocked(useCurrencyRatesHook).mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      filteredData: [],
      tabs: [],
      findDollar: null,
      handleTabClick: vi.fn(),
      selectedTab: 'goldRates',
    });

    render(<CurrencyRatesView />, { wrapper });

    // Expect the "profit not found" component to be in the document.
    expect(screen.getByTestId('profit-not-found')).toBeInTheDocument();
    expect(screen.getByText('داده‌ای برای نمایش وجود ندارد.')).toBeInTheDocument();
  });

  it('renders a list of MainCard components when data is available', () => {
    // Mock some sample data.
    const mockData: ExchangeRateItem[] = [
      {     
        title: "test",
        name: "test 1",
        price: "15000",
        rateOfChange: "20",
        category: "gold",
        highestRate: "1",
        lowestRate: "0",
        sourceCreated: ""}
      
    ] as ExchangeRateItem[];

    // Mock the hook to return a successful state with data.
    vi.mocked(useCurrencyRatesHook).mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      filteredData: mockData,
      tabs: [{ value: 'goldRates', label: 'Gold' }],
      findDollar: {  title: "test",
        name: "test 1",
        price: "15000",
        rateOfChange: "20",
        category: "gold",
        highestRate: "1",
        lowestRate: "0",
        sourceCreated: "" } as ExchangeRateItem,
      handleTabClick: vi.fn(),
      selectedTab: 'goldRates',
    });

    render(<CurrencyRatesView />, { wrapper });

    // Expect the correct number of MainCard components to be rendered.
    const mainCards = screen.getAllByTestId('main-card');
    expect(mainCards).toHaveLength(mockData.length);
 
  });
});