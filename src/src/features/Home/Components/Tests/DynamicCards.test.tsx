import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DynamicCard from "../DynamicCards";
import { useNavigate } from "react-router";
import { useThemeContext } from "@/core/context/useThemeContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// --- Mock hooks ---
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@/core/context/useThemeContext", () => ({
  useThemeContext: vi.fn(),
}));

// --- Mock InfoDialogs & Icon components ---
vi.mock("@/core/components/infoDialog", () => ({
    default: ({ open }: { open: boolean }) =>
      open ? <div data-testid="info-dialog">Dialog Open</div> : null,
  }));
  
  vi.mock("@/core/components/icons", () => ({
    Icon: ({ name }: { name: string }) => (
      <div data-testid={`icon-${name}`} role="button" />
    ),
  }));
  

// --- Sample data ---
const mockCardsData = [
  {
    name: "sales",
    title: "Sales",
    icon: "sales-icon.png",
    path: "/sales",
    value: "1200",
    unit: "ریال",
    salesChangePercent: "10",
  },
  {
    name: "inventory",
    title: "Inventory",
    icon: "inventory-icon.png",
    path: "/inventory",
    value: "500",
    unit: "عدد",
  },
];

describe("DynamicCard", () => {
  const mockNavigate = vi.fn();
  const mockHandleClickOpen = vi.fn();
  const mockHandleClose = vi.fn();

  // Create new query client for each test to avoid cache pollution
  const createWrapper = (ui: React.ReactNode) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useThemeContext as any).mockReturnValue({ isDarkMode: false });
    vi.clearAllMocks();
  });

  it("renders filtered card items correctly", () => {
    createWrapper(
      <DynamicCard
        cardsData={mockCardsData}
        open={false}
        id="sales"
        handleClickOpen={mockHandleClickOpen}
        handleClose={mockHandleClose}
      />
    );

    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.queryByText("Inventory")).not.toBeInTheDocument();
    expect(screen.getByText("10.00%")).toBeInTheDocument();
  });

  it("calls navigate when card is clicked", () => {
    createWrapper(
      <DynamicCard
        cardsData={mockCardsData}
        open={false}
        id="sales"
        handleClickOpen={mockHandleClickOpen}
        handleClose={mockHandleClose}
      />
    );

    const title = screen.getByText("Sales");
    fireEvent.click(title);

    expect(mockNavigate).toHaveBeenCalledWith("/sales", {
      state: { dateFilter: undefined },
    });
  });

  it("calls handleClickOpen when info icon is clicked", () => {
    createWrapper(
      <DynamicCard
        cardsData={mockCardsData}
        open={false}
        id="sales"
        handleClickOpen={mockHandleClickOpen}
        handleClose={mockHandleClose}
      />
    );

    const infoIcon = screen.getByTestId("icon-infodialoghome");
    fireEvent.click(infoIcon);

    expect(mockHandleClickOpen).toHaveBeenCalledWith({
      path: "/sales",
      title: "Sales",
    });
  });

  it("renders InfoDialogs when open=true", () => {
    createWrapper(
      <DynamicCard
        cardsData={mockCardsData}
        open={true}
        id="sales"
        handleClickOpen={mockHandleClickOpen}
        handleClose={mockHandleClose}
      />
    );

    expect(screen.getByTestId("info-dialog")).toBeInTheDocument();
  });
});
