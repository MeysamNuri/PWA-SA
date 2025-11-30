import { describe, it, expect, vi } from 'vitest';
import { getComponentMap } from './componentMapHook';

// Mock components
vi.mock('../Components/UnsettledInvoices', () => ({
  default: function UnsettledInvoices() { return null; },
}));
vi.mock('../Components/TopCustomersSellers', () => ({
  default: function TopCustomersAndSellers() { return null; },
}));
vi.mock('../Components/Reports', () => ({
  default: function Reports() { return null; },
}));
vi.mock('../Components/DynamicCards', () => ({
  default: function DynamicCard() { return null; },
}));
vi.mock('../Components/Currencies', () => ({
  default: function Currencies() { return null; },
}));

// Import mocked components
import UnsettledInvoices from '../Components/UnsettledInvoices';

import DynamicCard from '../Components/DynamicCards';
import Currencies from '../Components/Currencies';

// Import type
import useHomeHooks from '../Hooks/homeHooks';

describe('getComponentMap', () => {
  const mockProps = {
    // 🔥 only fields used by getComponentMap
    cardsData: [{ id: 1 }],
    open: true,
    handleClickOpen: vi.fn(),
    handleClose: vi.fn(),
    currencyTableData: [{ code: 'USD' }],
    currencyLoading: false,
    handleCurrencyRatesClick: vi.fn(),
    unsettledInvoicesData: { Data: [{ invoiceId: 10 }] },
    unsettledInvoicesLoading: false,
    unsettledInvoicesError: null,

    // 🔥 all unused fields → set to dummy values
    saleAmount: [],
    debitCredit: [],
    availableFundsData: [],
    nearDueCheques: [],
    topNMostSoldProducts: [],
    topNMostRevenuableProducts: [],
    pageNameData: [],
    pageNameDataLoading: false,
    topCustomersData: [],
    topSellersData: [],
  } as unknown as ReturnType<typeof useHomeHooks>;

  it('returns correct component map keys', () => {
    const map = getComponentMap(mockProps);

    expect(Object.keys(map)).toEqual([
      'salesrevenue',
      'availablefunds',
      'debitcredit',
      'cheques',
      'topNMostsoldproducts',
      'topNMostrevenuableproducts',
      'currencyrates',
      'unsettledinvoices',
      'topcustomers',
      'topsellers',
    ]);
  });

  it('maps salesrevenue to DynamicCard with correct props', () => {
    const map = getComponentMap(mockProps);
    const entry = map.salesrevenue;

    expect(entry.Component).toBe(DynamicCard);
    expect(entry.props.id).toBe('salesrevenue');
    expect(entry.props.cardsData).toBe(mockProps.cardsData);
    expect(entry.props.open).toBe(true);
  });

  it('maps currencyrates to Currencies with correct props', () => {
    const map = getComponentMap(mockProps);
    const entry = map.currencyrates;

    expect(entry.Component).toBe(Currencies);
    expect(entry.props.currencyTableData).toBe(mockProps.currencyTableData);
    expect(entry.props.currencyLoading).toBe(false);
  });

  it('maps unsettledinvoices correctly', () => {
    const map = getComponentMap(mockProps);
    const entry = map.unsettledinvoices;

    expect(entry.Component).toBe(UnsettledInvoices);
    expect(entry.props.data).toEqual([{ invoiceId: 10 }]);
    expect(entry.props.isLoading).toBe(false);
  });

  it('maps topsellers & topcustomers correctly', () => {
    const map = getComponentMap(mockProps);

    expect(map.topcustomers.props.isTopSeller).toBe(false);
    expect(map.topsellers.props.isTopSeller).toBe(true);
  });
});
