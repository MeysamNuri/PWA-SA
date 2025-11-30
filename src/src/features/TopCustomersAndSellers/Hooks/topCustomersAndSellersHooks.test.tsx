import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useTopCustomersAndSellersHooks from "../Hooks/topCustomersAndSellersHooks";
import { DateFilterType } from "@/core/types/dateFilterTypes";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router";

// 🧩 Mock dependencies
vi.mock("@mui/material/styles", () => ({
  useTheme: vi.fn(),
}));

vi.mock("react-router", () => ({
  useLocation: vi.fn(),
}));

describe("useTopCustomersAndSellersHooks", () => {
  it("should initialize with location.state if available", () => {
    (useTheme as any).mockReturnValue({ palette: { mode: "light" } });
    (useLocation as any).mockReturnValue({ state: DateFilterType.Last30Days });

    const { result } = renderHook(() => useTopCustomersAndSellersHooks());

    expect(result.current.dateFilter).toBe(DateFilterType.Last30Days.toString());
    expect(result.current.palette).toEqual({ mode: "light" });
    expect(result.current.infoOBJ.title).toBe("مشتریان برتر");
    expect(result.current.sellersInfoOBJ.title).toBe("فروشندگان برتر");
  });

  it("should default to Last7Days when no location.state", () => {
    (useTheme as any).mockReturnValue({ palette: { mode: "dark" } });
    (useLocation as any).mockReturnValue({ state: undefined });

    const { result } = renderHook(() => useTopCustomersAndSellersHooks());

    expect(result.current.dateFilter).toBe(DateFilterType.Last7Days.toString());
  });

  it("should update dateFilter when handleOnchange is called", () => {
    (useTheme as any).mockReturnValue({ palette: {} });
    (useLocation as any).mockReturnValue({ state: undefined });

    const { result } = renderHook(() => useTopCustomersAndSellersHooks());

    act(() => {
      result.current.handleOnchange(DateFilterType.Last3Months);
    });

    expect(result.current.dateFilter).toBe(DateFilterType.Last3Months);
  });
});
