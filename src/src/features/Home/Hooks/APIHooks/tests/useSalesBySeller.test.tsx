// src/features/Home/Hooks/APIHooks/useSalesBySeller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useGetSalesBySeller from "../useSalesBySeller";

// Mock useFetchTopData
vi.mock("../useFetchTopData", () => ({
  __esModule: true,
  default: vi.fn(),
}));

// Import after mock
import useFetchTopData from "../useFetchTopData";

describe("useGetSalesBySeller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useFetchTopData with correct params", () => {
    (useFetchTopData as any).mockReturnValue({
        data: [
          {
            sellerCode: "test",
            sellerName: "test",
          },
        ],
        isPending: false,
        isError: false,
        error: null,
      });

    // Act
    const { result } = renderHook(() => useGetSalesBySeller("7"));

    // Assert: useFetchTopData called with correct config
    expect(useFetchTopData).toHaveBeenCalledWith({
      queryKey: ["getSalesBySeller", "7"],
      apiPath: expect.any(Function),
      selector: expect.any(Function),
      daysType: "7",
    });

    // Assert: values passed through
    expect(result.current.salesBySellerData).toEqual([
        { sellerCode: "test", sellerName: "test" },
      ]);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();

    // Extra check: apiPath generates correct endpoint
    const callArgs = (useFetchTopData as any).mock.calls[0][0];
    expect(callArgs.apiPath("30")).toBe(
      "/SalesBySeller/GetSalesBySeller?lastNDaysType=30"
    );
  });
});
