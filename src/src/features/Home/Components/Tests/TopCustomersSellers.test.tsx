// TopCustomersAndSellers.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TopCustomersAndSellers from "../TopCustomersSellers";

// ---- Mock MUI theme ----
vi.mock("@mui/material/styles", async () => {
  const actual = await vi.importActual<any>("@mui/material/styles");
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        background: { paper: "#fff" },
        text: { primary: "#000" },
      },
    }),
  };
});

// ---- Mock context ----
vi.mock("@/core/context/useThemeContext", () => ({
  useThemeContext: () => ({ isDarkMode: false }),
}));

// ---- Mock child components ----
vi.mock("@/core/components/icons", () => ({
  Icon: ({ name }: { name: string }) => (
    <div data-testid={`icon-${name}`} />
  ),
}));
vi.mock("@/core/components/dateFilterToggleTab", () => ({
  __esModule: true,
  default: ({ value }: { value: string }) => (
    <div data-testid="date-filter">Value: {value}</div>
  ),
}));
vi.mock("@/core/components/infoDialog", () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="info-dialog">Dialog Open</div> : null,
}));
vi.mock("../customerSellerList", () => ({
  __esModule: true,
  default: ({ fullName }: { fullName: string }) => (
    <div data-testid="customer-seller">{fullName}</div>
  ),
}));

// ---- Mock hook ----
const mockHandleDaysChange = vi.fn();
const mockHandleTopCustomersDaysChange = vi.fn();

vi.mock("../../Hooks/topC&SHooks", () => ({
  __esModule: true,
  default: () => ({
    handleDaysChange: mockHandleDaysChange,
    handleTopCustomersDaysChange: mockHandleTopCustomersDaysChange,
    daysTypeFilter: "LastYear",
    dateFilter: "Last7Days",
    salesBySellerData: {
      salesBySellerDto: [
        { sellerName: "Seller 1", soldQuantity: 5, soldPriceUOM: "USD", formattedSoldPrice: "$100" },
      ],
    },
    topCustomersByPurchaseData: [
      { customerName: "Customer 1", soldQuantity: 3, soldPriceUOM: "USD", formattedSoldPrice: "$50" },
    ],
  }),
}));

describe("TopCustomersAndSellers", () => {
  const handleClickOpen = vi.fn();
  const handleClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sellers section when isTopSeller=true", () => {
    render(
      <TopCustomersAndSellers
        isTopSeller
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        open={false}
      />
    );

    expect(screen.getByText("فروشندگان برتر")).toBeInTheDocument();
    expect(screen.getByTestId("customer-seller")).toHaveTextContent("Seller 1");
    expect(screen.getByTestId("date-filter")).toHaveTextContent("Value: Last7Days");
  });

  it("renders customers section when isTopSeller=false", () => {
    render(
      <TopCustomersAndSellers
        isTopSeller={false}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        open={false}
      />
    );

    expect(screen.getByText("مشتریان برتر")).toBeInTheDocument();
    expect(screen.getByTestId("customer-seller")).toHaveTextContent("Customer 1");
    expect(screen.getByTestId("date-filter")).toHaveTextContent("Value: LastYear");
  });

  it("calls handleClickOpen when info icon clicked", () => {
    render(
      <TopCustomersAndSellers
        isTopSeller
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        open={false}
      />
    );

    const infoIcon = screen.getByTestId("icon-infodialoghome");
    fireEvent.click(infoIcon);

    expect(handleClickOpen).toHaveBeenCalledWith({
      path: "topSeller",
      title: "فروشندگان برتر",
    });
  });

  it("shows dialog when open=true", () => {
    render(
      <TopCustomersAndSellers
        isTopSeller
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        open={true}
      />
    );

    expect(screen.getByTestId("info-dialog")).toBeInTheDocument();
  });
});
