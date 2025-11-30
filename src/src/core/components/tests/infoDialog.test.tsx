
import { render, screen } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import { getCommandTitle } from "../../helper/commandTitle";

// Mock the Zustand store
vi.mock("../../zustandStore", () => ({
  useInfoModalStore: vi.fn(),
}));

// Mock the API hook (adjust path if needed)
vi.mock("../infoDialogAPIHook", () => ({
  default: vi.fn(() => ({
    infoDialogData: { lastRecord: "2025-11-15T12:00:00Z", lastExecutionCommandDate: "2025-11-14T12:00:00Z" },
    isPending: false,
    isError: false,
  })),
}));

import InfoDialogs from "../infoDialog";
import { useInfoModalStore } from "../../zustandStore";
import useInfoDialogHook from "../infoDialogAPIHook"; // import the mocked hook

describe("InfoDialogs Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders last record and execution dates correctly", () => {
    (useInfoModalStore as any).mockReturnValue({
      infoDetail: { path: "/debitcredit" },
    });

    render(<InfoDialogs open={true} handleClose={() => {}} />);

    expect(screen.getByTestId("last-record-date").textContent).not.toBe("-");
    expect(screen.getByTestId("last-execution-date").textContent).not.toBe("-");
  });

  it("shows '-' when dates are default", () => {
    (useInfoDialogHook as any).mockReturnValue({
      infoDialogData: { lastRecord: "0001-01-01T00:00:00Z", lastExecutionCommandDate: null },
      isPending: false,
      isError: false,
    });

    (useInfoModalStore as any).mockReturnValue({
      infoDetail: { path: "/AvailableFunds" },
    });

    render(<InfoDialogs open={true} handleClose={() => {}} />);

    expect(screen.getByTestId("last-record-date").textContent).toBe("-");
    expect(screen.getByTestId("last-execution-date").textContent).toBe("-");
  });
});


describe("getCommandTitle", () => {
  it("returns correct command titles for paths", () => {
    expect(getCommandTitle("/debitcredit")).toBe("DebitCreditCommand");
    expect(getCommandTitle("DebitCreditCommand")).toBe("DebitCreditCommand");

    expect(getCommandTitle("/AvailableFunds")).toBe("AvailableFundsCommand");

    expect(getCommandTitle("/salesrevenue")).toBe("SalesDataCommand");

    expect(getCommandTitle("/cheques/payable-cheques")).toBe("ChequeDataCommand");

    expect(getCommandTitle("NearDueChequesCommand")).toBe("NearDueChequesCommand");

    expect(getCommandTitle("TopNMostRevenuableProductsCommand"))
      .toBe("TopNMostRevenuableProductsCommand");

    expect(getCommandTitle("OutOfStockInSaleProductsCommand"))
      .toBe("OutOfStockInSaleProductsCommand");

    expect(getCommandTitle("topSeller")).toBe("OutOfStockInSaleProductsCommand");

    expect(getCommandTitle("unknown")).toBe("");
  });
});

it("renders error state when isError is true", () => {
  (useInfoDialogHook as any).mockReturnValue({
    infoDialogData: null,
    isPending: false,
    isError: true,
  });

  (useInfoModalStore as any).mockReturnValue({
    infoDetail: { path: "/debitcredit" }
  });

  render(<InfoDialogs open={true} handleClose={() => {}} />);

  expect(screen.getByText("خطا در بارگذاری اطلاعات.")).toBeInTheDocument();
});
it("renders loading state when isPending is true", () => {
  (useInfoDialogHook as any).mockReturnValue({
    infoDialogData: null,
    isPending: true,
    isError: false,
  });

  (useInfoModalStore as any).mockReturnValue({
    infoDetail: { path: "/debitcredit" }
  });

  render(<InfoDialogs open={true} handleClose={() => {}} />);

  expect(screen.getByText("در حال بارگذاری اطلاعات...")).toBeInTheDocument();
});
