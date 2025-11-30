import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TopCustomersView from "./topCustomers";
import useTopCustomersAndSellersHooks from "../Hooks/topCustomersAndSellersHooks";
import useTopCustomersByPurchaseHook from "@/features/Home/Hooks/APIHooks/useTopCustomers";
import { ThemeProvider, createTheme } from "@mui/material";

// Mock child components (we only test rendering logic here)
vi.mock("@/core/components/DateFilter", () => ({
  default: ({ onChange }: { onChange: () => void }) => (
    <button onClick={onChange}>Mock DateFilter</button>
  ),
}));

vi.mock("@/core/components/innerPagesHeader", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/core/components/ajaxLoadingComponent", () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock("@/core/components/MainCard/MainCard", () => ({
  default: ({ headerTitle }: { headerTitle: string }) => (
    <div>MainCard: {headerTitle}</div>
  ),
}));

vi.mock("@/core/components/profitNotFound", () => ({
  default: ({ message }: { message: string }) => <div>{message}</div>,
}));

// Mock hooks
vi.mock("../Hooks/topCustomersAndSellersHooks");
vi.mock("@/features/Home/Hooks/APIHooks/useTopCustomers");

const mockUseTopCustomersAndSellersHooks =
  useTopCustomersAndSellersHooks as unknown as any;
const mockUseTopCustomersByPurchaseHook =
  useTopCustomersByPurchaseHook as unknown as any;

const theme = createTheme();

const renderWithTheme = (ui: React.ReactNode) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("TopCustomersView", () => {
  it("renders loading state", () => {
    mockUseTopCustomersAndSellersHooks.mockReturnValue({
      handleOnchange: vi.fn(),
      dateFilter: "LastYear",
      infoOBJ: {},
    });

    mockUseTopCustomersByPurchaseHook.mockReturnValue({
      isPending: true,
      topCustomersByPurchaseData: null,
    });

    renderWithTheme(<TopCustomersView />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders customer data when available", () => {
    mockUseTopCustomersAndSellersHooks.mockReturnValue({
      handleOnchange: vi.fn(),
      dateFilter: "LastYear",
      infoOBJ: {},
    });

    mockUseTopCustomersByPurchaseHook.mockReturnValue({
      isPending: false,
      topCustomersByPurchaseData: [
        { customerName: "John Doe", soldPrice: 100000, invoiceQuantity: 5 },
      ],
    });

    renderWithTheme(<TopCustomersView />);
    expect(screen.getByText("MainCard: John Doe")).toBeInTheDocument();
  });

  it("renders ProfitNotFound when no data", () => {
    mockUseTopCustomersAndSellersHooks.mockReturnValue({
      handleOnchange: vi.fn(),
      dateFilter: "LastYear",
      infoOBJ: {},
    });

    mockUseTopCustomersByPurchaseHook.mockReturnValue({
      isPending: false,
      topCustomersByPurchaseData: null,
    });

    renderWithTheme(<TopCustomersView />);
    expect(screen.getByText("اطلاعاتی دریافت نشد")).toBeInTheDocument();
  });
});
