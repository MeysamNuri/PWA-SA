import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UnsettledInvoices from "../UnsettledInvoices";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock useNavigate (partial mock)
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual: any = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock theme context
vi.mock("@/core/context/useThemeContext", () => ({
  useThemeContext: () => ({ isDarkMode: false }),
}));

// Mock Icon component
vi.mock("@/core/components/icons", () => ({
  Icon: () => <div data-testid="icon" />,
}));

// Prevent actual API calls in InfoDialogs
vi.mock("@/core/components/infoDialogAPIHook", () => ({
  default: () => ({
    isPending: false,
    isError: false,
    data: null,
  }),
}));

describe("UnsettledInvoices Component", () => {
  const mockData = {
    unsettledQuantity: 5,
    unsettledAmount: 20000,
    formattedUnsettledAmount: "۲۰٬۰۰۰",
    unsettledAmountUOM: "ریال",
  };

  // Helper to wrap component with Router + React Query Provider
  const renderWithProviders = (ui: React.ReactNode) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    );
  };

  const setup = (props?: any) =>
    renderWithProviders(
      <UnsettledInvoices
        data={mockData}
        isError={false}
        open={false}
        handleClickOpen={vi.fn()}
        handleClose={vi.fn()}
        {...props}
      />
    );

  it("calls handleClickOpen when clicking IconButton", () => {
    const handleClickOpen = vi.fn();

    setup({ handleClickOpen });

    const iconButton = screen.getAllByTestId("icon")[0].parentElement!;
    fireEvent.click(iconButton);

    expect(handleClickOpen).toHaveBeenCalledWith({
      path: "/UnsettledInvoicesDetailsView",
      title: "فاکتورهای تسویه نشده",
    });
  });
});
