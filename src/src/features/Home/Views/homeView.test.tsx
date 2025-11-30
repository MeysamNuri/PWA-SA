import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import HomeView from './homeView';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // <-- React Query

// -------------------- MOCKS --------------------

// MUI Box
vi.mock('@mui/material', () => ({
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
}));

// Child components
vi.mock('../Components/Reports', () => ({
  default: ({ id }: { id: string }) => <div>Reports Component - {id}</div>,
}));
vi.mock('../Components/DynamicCards', () => ({
  default: ({ id }: { id: string }) => <div>DynamicCard Component - {id}</div>,
}));
vi.mock('../Components/Currencies', () => ({
  default: () => <div>Currencies Component</div>,
}));
vi.mock('../Components/UnsettledInvoices', () => ({
  default: () => <div>UnsettledInvoices Component</div>,
}));
vi.mock('../Components/TopCustomersSellers', () => ({
  default: ({ isTopSeller }: { isTopSeller: boolean }) => (
    <div>{isTopSeller ? 'Top Sellers Component' : 'Top Customers Component'}</div>
  ),
}));
vi.mock('@/core/components/profitNotFound', () => ({
  default: ({ message }: { message: string }) => <div>{message}</div>,
}));

// Hooks
vi.mock('../Hooks/homeHooks', () => ({
  default: vi.fn(),
}));
vi.mock('@/features/HomeCustomization/Hooks/useHomeCustomizationSettings', () => ({
  useHomeCustomizationSettings: vi.fn(),
}));

// Mock useNavigate
vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
}));

import useHomeHooks from '../Hooks/homeHooks';
import { useHomeCustomizationSettings } from '@/features/HomeCustomization/Hooks/useHomeCustomizationSettings';

// -------------------- Helper --------------------
const queryClient = new QueryClient();
const wrapper = (ui: React.ReactElement) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>{ui}</MemoryRouter>
  </QueryClientProvider>
);

describe('HomeView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ProfitNotFound when there are no parsed items', () => {
    (useHomeHooks as any).mockReturnValue({ parsedSortItems: [] });
    (useHomeCustomizationSettings as any).mockReturnValue({
      isComponentEnabled: vi.fn().mockReturnValue(true),
    });

    render(wrapper(<HomeView />));


  });

  it('renders components based on parsedSortItems', () => {
    (useHomeHooks as any).mockReturnValue({
      parsedSortItems: [
        { pageId: '1', pageName: 'salesrevenue' },
        { pageId: '2', pageName: 'currencyrates' },
        { pageId: '3', pageName: 'topsellers' },
      ],
      cardsData: [],
      open: false,
      handleClickOpen: vi.fn(),
      handleClose: vi.fn(),
      currencyTableData: [],
      currencyLoading: false,
      handleCurrencyRatesClick: vi.fn(),
      unsettledInvoicesData: { Data: [] },
      unsettledInvoicesLoading: false,
      unsettledInvoicesError: false,
    });

    (useHomeCustomizationSettings as any).mockReturnValue({
      isComponentEnabled: vi.fn().mockReturnValue(true),
    });

    render(wrapper(<HomeView />));

    expect(screen.getByText(/DynamicCard Component - salesrevenue/i)).toBeInTheDocument();
    expect(screen.getByText(/Currencies Component/i)).toBeInTheDocument();
    expect(screen.getByText(/Top Sellers Component/i)).toBeInTheDocument();
  });
});
