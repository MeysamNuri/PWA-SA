import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TopSellersView from "./topSellers";
import useTopCustomersAndSellersHooks from "../Hooks/topCustomersAndSellersHooks";
import useGetSalesBySeller from "@/features/Home/Hooks/APIHooks/useSalesBySeller";
import { ThemeProvider, createTheme } from "@mui/material";

// 🧩 Mock child components (only render placeholders)
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

// 🧩 Mock hooks
vi.mock("../Hooks/topCustomersAndSellersHooks");
vi.mock("@/features/Home/Hooks/APIHooks/useSalesBySeller");

const mockUseTopCustomersAndSellersHooks =
  useTopCustomersAndSellersHooks as unknown as any;
const mockUseGetSalesBySeller = useGetSalesBySeller as unknown as any;

// 🎨 Mock MUI theme
const theme = createTheme();
const renderWithTheme = (ui: React.ReactNode) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("TopSellersView", () => {
  it("renders loading state", () => {
    mockUseTopCustomersAndSellersHooks.mockReturnValue({
      handleOnchange: vi.fn(),
      dateFilter: "LastYear",
      sellersInfoOBJ: {},
    });

    mockUseGetSalesBySeller.mockReturnValue({
      isPending: true,
      salesBySellerData: null,
    });

    renderWithTheme(<TopSellersView />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders sellers data when available", () => {
    mockUseTopCustomersAndSellersHooks.mockReturnValue({
      handleOnchange: vi.fn(),
      dateFilter: "LastYear",
      sellersInfoOBJ: {},
    });

    mockUseGetSalesBySeller.mockReturnValue({
      isPending: false,
      salesBySellerData: {
        salesBySellerDto: [
          { sellerName: "Alice", soldPrice: 200000, invoiceQuantity: 10 },
        ],
      },
    });

    renderWithTheme(<TopSellersView />);
    expect(screen.getByText("MainCard: Alice")).toBeInTheDocument();
  });

  it("renders ProfitNotFound when no seller data", () => {
    mockUseTopCustomersAndSellersHooks.mockReturnValue({
      handleOnchange: vi.fn(),
      dateFilter: "LastYear",
      sellersInfoOBJ: {},
    });

    mockUseGetSalesBySeller.mockReturnValue({
      isPending: false,
      salesBySellerData: { salesBySellerDto: [] },
    });

    renderWithTheme(<TopSellersView />);
    expect(screen.getByText("اطلاعاتی دریافت نشد")).toBeInTheDocument();
  });
});
