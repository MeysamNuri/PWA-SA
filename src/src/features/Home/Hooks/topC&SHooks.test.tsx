import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useTopCustomersAndSellers from "./topC&SHooks";
import { DateFilterType } from "@/core/types/dateFilterTypes";
import useGetSalesBySeller from "../Hooks/APIHooks/useSalesBySeller";
import useTopCustomersByPurchaseHook from "../Hooks/APIHooks/useTopCustomers";
import { useNavigate } from "react-router";

// 🧩 Mock dependencies
vi.mock("../Hooks/APIHooks/useSalesBySeller");
vi.mock("../Hooks/APIHooks/useTopCustomers");
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

describe("useTopCustomersAndSellers", () => {
  const mockUseGetSalesBySeller = useGetSalesBySeller as unknown as any;
  const mockUseTopCustomersByPurchaseHook =
    useTopCustomersByPurchaseHook as unknown as any;
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    mockUseGetSalesBySeller.mockReturnValue({ salesBySellerData: "sellerData" });
    mockUseTopCustomersByPurchaseHook.mockReturnValue({
      topCustomersByPurchaseData: "customerData",
    });
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  it("should initialize with default state values", () => {
    const { result } = renderHook(() => useTopCustomersAndSellers());

    expect(result.current.dateFilter).toBe(DateFilterType.Last7Days);
    expect(result.current.daysTypeFilter).toBe(DateFilterType.Last3Months);
    expect(result.current.salesBySellerData).toBe("sellerData");
    expect(result.current.topCustomersByPurchaseData).toBe("customerData");
  });

  it("should update dateFilter when handleDaysChange is called", () => {
    const { result } = renderHook(() => useTopCustomersAndSellers());

    act(() => {
      result.current.handleDaysChange(null, DateFilterType.Last30Days);
    });

    expect(result.current.dateFilter).toBe(DateFilterType.Last30Days);
  });

  it("should update daysTypeFilter when handleTopCustomersDaysChange is called", () => {
    const { result } = renderHook(() => useTopCustomersAndSellers());

    act(() => {
      result.current.handleTopCustomersDaysChange(null, DateFilterType.LastYear);
    });

    expect(result.current.daysTypeFilter).toBe(DateFilterType.LastYear);
  });

  it("should navigate to /top-sellers with dateFilter state", () => {
    const { result } = renderHook(() => useTopCustomersAndSellers());

    act(() => {
      result.current.handleDetailsNavigate("/top-sellers");
    });

    expect(mockNavigate).toHaveBeenCalledWith("/top-sellers", {
      state: DateFilterType.Last7Days,
    });
  });

  it("should navigate to other paths with daysTypeFilter state", () => {
    const { result } = renderHook(() => useTopCustomersAndSellers());

    act(() => {
      result.current.handleDetailsNavigate("/top-customers");
    });

    expect(mockNavigate).toHaveBeenCalledWith("/top-customers", {
      state: DateFilterType.Last3Months,
    });
  });
});
