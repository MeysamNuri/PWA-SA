import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import useCurrencyTableData from "./currencyDataHooks";
import type { ExchangeRateItem } from "../types";

// 1️⃣ Properly mock the default export
vi.mock("./APIHooks/useCurrencyRates", () => ({
  default: vi.fn(),
}));

import useCurrencyRates from "./APIHooks/useCurrencyRates";

// 2️⃣ Type the mocked function
const mockedUseCurrencyRates = useCurrencyRates as unknown as ReturnType<typeof vi.fn>;

// 3️⃣ Helper component to capture hook output
function TestComponent(props: { onData: (data: any) => void }) {
  const result = useCurrencyTableData();
  props.onData(result);
  return null;
}

// 4️⃣ Tests
describe("useCurrencyTableData", () => { 
  beforeEach(() => {
    // Overwrite the mock implementation in each test
    (mockedUseCurrencyRates as any).mockImplementation(() => ({
      data: undefined,
      isPending: true,
    }));
  });

  const mockData: ExchangeRateItem[] = [
    {
      name: "UsdDollar",
      title: "USD",
      price: "500000",
      rateOfChange: "2",
      category: "Currency",
      highestRate: "510000",
      lowestRate: "490000",
      sourceCreated: "2025-11-29T12:30:00Z",
    },
    {
      name: "SekeEmaami",
      title: "Gold Coin",
      price: "20000000",
      rateOfChange: "-1",
      category: "Gold",
      highestRate: "20500000",
      lowestRate: "19800000",
      sourceCreated: "2025-11-29T12:40:00Z",
    },
    {
      name: "OtherCurrency",
      title: "Other",
      price: "12345",
      rateOfChange: "0",
      category: "Currency",
      highestRate: "13000",
      lowestRate: "12000",
      sourceCreated: "2025-11-29T12:50:00Z",
    },
  ];

  it("returns filtered and formatted currency table data", () => {
    (mockedUseCurrencyRates as any).mockReturnValue({
      data: { Data: mockData },
      isPending: false,
    });

    let captured: any = null;
    render(<TestComponent onData={(d) => (captured = d)} />);

    expect(captured.currencyLoading).toBe(false);
    expect(captured.currencyTableData).toHaveLength(2);

    const usd = captured.currencyTableData.find((i: any) => i.name === "UsdDollar");
    expect(usd.price).toBe("50,000");
    expect(usd.time).toBe("12:30");
    expect(usd.rateOfChange).toBe(2);

    const gold = captured.currencyTableData.find((i: any) => i.name === "SekeEmaami");
    expect(gold.price).toBe("2,000,000");
    expect(gold.time).toBe("12:40");
    expect(gold.rateOfChange).toBe(-1);
  });

  it("handles empty data and loading state", () => {
    (mockedUseCurrencyRates as any).mockReturnValue({
      data: undefined,
      isPending: true,
    });

    let captured: any = null;
    render(<TestComponent onData={(d) => (captured = d)} />);

    expect(captured.currencyLoading).toBe(true);
    expect(captured.currencyTableData).toHaveLength(0);
  });

  it("handles invalid price and date", () => {
    (mockedUseCurrencyRates as any).mockReturnValue({
      data: {
        Data: [
          {
            name: "UsdDollar",
            title: "USD",
            price: "invalid",
            rateOfChange: "abc",
            category: "Currency",
            highestRate: "0",
            lowestRate: "0",
            sourceCreated: "invalid-date",
          },
        ],
      },
      isPending: false,
    });

    let captured: any = null;
    render(<TestComponent onData={(d) => (captured = d)} />);

    const usd = captured.currencyTableData[0];
    expect(usd.price).toBe("-");
    expect(usd.time).toBe("-");
    expect(usd.rateOfChange).toBe(0);
  });
});
