// src/features/Home/Hooks/APIHooks/tests/useTopCustomers.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useTopCustomersByPurchaseHook from "../useTopCustomers";
import type { ITopCustomersByPurchaseRes } from "../../../types";

// Mock useFetchTopData
vi.mock("../useFetchTopData", () => ({
  __esModule: true,
  default: vi.fn(),
}));

// Import after mocking
import useFetchTopData from "../useFetchTopData";

describe("useTopCustomersByPurchaseHook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useFetchTopData with correct params", () => {
    // Arrange: mock return value
    (useFetchTopData as any).mockReturnValue({
      data: [
        {
          customerName: "Customer A",
          soldQuantity: 5,
          soldPriceUOM: "USD",
          formattedSoldPrice: "50",
        },
      ] as ITopCustomersByPurchaseRes[],
      isPending: false,
      isError: false,
      error: null,
    });

    // Act
    const { result } = renderHook(() =>
      useTopCustomersByPurchaseHook("30")
    );

    // Assert: called with correct config
    expect(useFetchTopData).toHaveBeenCalledWith({
      queryKey: ["topCustomersByPurchase", "30"],
      apiPath: expect.any(Function),
      selector: expect.any(Function),
      daysType: "30",
    });

    // Assert: apiPath produces correct URL
    const args = (useFetchTopData as any).mock.calls[0][0];
    expect(args.apiPath("7")).toBe(
      "/SalesBySeller/GetTopNCustomersByPurchaseVolume?daysType=7"
    );

    // Assert: values passed through
    expect(result.current.topCustomersByPurchaseData).toEqual([
      {
        customerName: "Customer A",
        soldQuantity: 5,
        soldPriceUOM: "USD",
        formattedSoldPrice: "50",
      },
    ]);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
