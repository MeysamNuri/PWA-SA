import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useHomeHooks from "./homeHooks";

// ------------------ Mock React Router ------------------
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: {} }),
}));

// ------------------ Mock Zustand Store ------------------
const mockSetInfoDetails = vi.fn();
vi.mock("@/core/zustandStore", () => ({
  useInfoModalStore: (selector: any) =>
    selector({ setInfoDetails: mockSetInfoDetails }),
}));

// ------------------ Mock Theme Context ------------------
vi.mock("@/core/context/useThemeContext", () => ({
  useThemeContext: () => ({ isDarkMode: false }),
}));

// ------------------ Mock Home Customization ------------------
vi.mock("@/features/HomeCustomization/Hooks/useHomeCustomizationSettings", () => ({
  useHomeCustomizationSettings: () => ({
    isComponentEnabled: () => true,
  }),
}));

// ------------------ Mock API Hooks ------------------
vi.mock("./APIHooks/useDebitCreditBalanceAmounts", () => ({
  default: () => ({ data: { Data: { formattedTotalCreditAmount: 100, formattedTotalDebitAmount: 50 } } }),
}));

vi.mock("./APIHooks/useSalesRevenue", () => ({
  default: () => ({ data: { Data: [{ dateType: "TodayDate", formattedSalesAmount: 1000, salesAmountUOM: "USD" }] }, isPending: false }),
}));

vi.mock("./APIHooks/useNearDueCheques", () => ({
  default: () => ({ data: { Data: { formattedPayableChequesAmount: 200, formattedReceivableChequesAmount: 300 } }, isPending: false }),
}));

vi.mock("../Hooks/APIHooks/useCurrencyRates", () => ({
  default: vi.fn(() => ({
    data: {
      Data: {
        exchangeRateItem: [
          {
            name: "UsdDollar",
            title: "USD",
            price: "150",
            sourceCreated: new Date("2025-01-01T09:15:00"),
            rateOfChange: "2",
            category: "currency",
            highestRate: 160,
            lowestRate: 140,
          },
        ],
      },
    },
    isPending: false,
  })),
}));
vi.mock("@/features/AvailableFunds/Hooks/APIHooks/getAvailableFunds", () => ({
  default: () => ({ availableFundsData: { availableFundsReportResponseDtos: [{ formattedFundBalance: 5000, formattedBankBalance: 2000 }] }, isPending: false }),
}));

vi.mock("./APIHooks/useUnsettledInvoices", () => ({
  default: () => ({ data: {}, isPending: false, isError: false }),
}));

vi.mock("./defaultPageItemsHook", () => ({
  __esModule: true,
  default: () => ({
    homeDefaultCustomeList: [{ title: "salesrevenue" }],
    pageNameDataLoading: false,
  }),
}));

vi.mock("@/core/components/icons", () => ({
  getIconPath: () => "icon-path",
}));

vi.mock("intro.js", () => ({
  __esModule: true,
  default: () => ({
    setOptions: vi.fn(),
    start: vi.fn(),
  }),
}));

// ------------------ Tests ------------------
describe("useHomeHooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it("should return expected structure", () => {
    const { result } = renderHook(() => useHomeHooks());

    expect(result.current).toHaveProperty("saleAmount");
    expect(result.current).toHaveProperty("debitCredit");
    expect(result.current).toHaveProperty("cardsData");
    expect(result.current).toHaveProperty("handleClickOpen");
    expect(result.current).toHaveProperty("handleClose");
  });

  it("should toggle modal open/close using handlers", () => {
    const { result } = renderHook(() => useHomeHooks());

    expect(result.current.open).toBe(false);

    act(() => {
      result.current.handleClickOpen({ title: "Test Modal", path: "/test" });
    });

    expect(mockSetInfoDetails).toHaveBeenCalledWith({ title: "Test Modal", path: "/test" });
    expect(result.current.open).toBe(true);

    act(() => result.current.handleClose());
    expect(result.current.open).toBe(false);
  });

  it("should navigate correctly for currency rates", () => {
    const { result } = renderHook(() => useHomeHooks());

    act(() => result.current.handleCurrencyRatesClick({ name: "UsdDollar" } as any));
    expect(mockNavigate).toHaveBeenCalledWith("/currencyRates/currency");

    act(() => result.current.handleCurrencyRatesClick({ name: "SekeEmaami" } as any));
    expect(mockNavigate).toHaveBeenCalledWith("/currencyRates/coin");

    act(() => result.current.handleCurrencyRatesClick({ name: "GoldGram18" } as any));
    expect(mockNavigate).toHaveBeenCalledWith("/currencyRates/gold");

    act(() => result.current.handleCurrencyRatesClick());
    expect(mockNavigate).toHaveBeenCalledWith("/currencyRates");
  });

  it("should return parsedSortItems from localStorage if present", () => {
    const storedItems = [{ title: "salesrevenue" }];
    localStorage.setItem("homeCustomization", JSON.stringify(storedItems));

    const { result } = renderHook(() => useHomeHooks());
    expect(result.current.parsedSortItems).toEqual(storedItems);
  });

  it("should return correct cardsData length", () => {
    const { result } = renderHook(() => useHomeHooks());
    expect(result.current.cardsData.length).toBeGreaterThan(0);
  });
});
// complete test ===



import * as reactRouter from 'react-router';


vi.spyOn(reactRouter, 'useNavigate').mockImplementation(() => mockNavigate);

describe('useHomeHooks - handleCurrencyRatesClick', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should navigate correctly for different currency names', () => {
    const { result } = renderHook(() => useHomeHooks());

    // USD/Dollar -> /currencyRates/currency
    act(() => result.current.handleCurrencyRatesClick({ name: 'UsdDollar' } as any));
    expect(mockNavigate).toHaveBeenCalledWith('/currencyRates/currency');

    // SekeEmaami -> /currencyRates/coin
    act(() => result.current.handleCurrencyRatesClick({ name: 'SekeEmaami' } as any));
    expect(mockNavigate).toHaveBeenCalledWith('/currencyRates/coin');

    // GoldGram18 -> /currencyRates/gold
    act(() => result.current.handleCurrencyRatesClick({ name: 'GoldGram18' } as any));
    expect(mockNavigate).toHaveBeenCalledWith('/currencyRates/gold');

    // Unknown currency -> /currencyRates
    act(() => result.current.handleCurrencyRatesClick({ name: 'Unknown' } as any));
    expect(mockNavigate).toHaveBeenCalledWith('/currencyRates');

    // No currencyData -> /currencyRates
    act(() => result.current.handleCurrencyRatesClick(undefined));
    expect(mockNavigate).toHaveBeenCalledWith('/currencyRates');
  });
});


//////////////////////

// ========================
// Mocks
// ========================

const mockUseLocation = { state: {} };

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation,
}));

const mockIntroStart = vi.fn();
const mockIntroSetOptions = vi.fn();

vi.mock("intro.js", () => ({
  default: vi.fn(() => ({
    start: mockIntroStart,
    setOptions: mockIntroSetOptions,
  })),
}));

vi.mock("../Hooks/APIHooks/useCurrencyRates", () => ({
  default: vi.fn(() => ({
    data: {
      Data: [
        {
          name: "UsdDollar",
          title: "USD",
          price: "100",
          sourceCreated: new Date("2025-01-01T10:00:00"),
          rateOfChange: "0",
          category: "currency",
          highestRate: 110,
          lowestRate: 90,
        },
        {
          name: "SekeEmaami",
          title: "سکه امامی",
          price: "2000",
          sourceCreated: new Date("2025-01-01T12:30:00"),
          rateOfChange: "1",
          category: "coin",
          highestRate: 2100,
          lowestRate: 1900,
        },
      ],
    },
    isPending: false,
  })),
}));



describe("useHomeHooks", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });


  it("calls introJs.start after 2500ms when firstLogin is true", () => {
    // Override location state
    mockUseLocation.state = { firstLogin: true };

    renderHook(() => useHomeHooks());

    // Not called immediately
    expect(mockIntroStart).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(mockIntroSetOptions).toHaveBeenCalledWith({
      steps: expect.any(Array),
      showProgress: true,
      exitOnOverlayClick: false,
      nextLabel: "بعدی",
      prevLabel: "قبلی",
      doneLabel: "تمام",
    });
    expect(mockIntroStart).toHaveBeenCalled();
  });

  it("does not call introJs.start if firstLogin is false", () => {
    mockUseLocation.state = { firstLogin: false };

    renderHook(() => useHomeHooks());

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(mockIntroStart).not.toHaveBeenCalled();
  });

  it("handles routeNavigate fallback for currency rates", () => {
    const { result } = renderHook(() => useHomeHooks());

    act(() => result.current.handleCurrencyRatesClick());

    expect(mockNavigate).toHaveBeenCalledWith("/currencyRates");
  });
});


