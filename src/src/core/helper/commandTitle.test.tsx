import { describe, it, expect } from "vitest";
import { getCommandTitle } from "./commandTitle"; // adjust path as needed

describe("getCommandTitle", () => {
  it("returns correct titles for debit credit commands", () => {
    expect(getCommandTitle("/debitcredit")).toBe("DebitCreditCommand");
    expect(getCommandTitle("DebitCreditCommand")).toBe("DebitCreditCommand");
  });

  it("returns correct titles for AvailableFunds", () => {
    expect(getCommandTitle("/AvailableFunds")).toBe("AvailableFundsCommand");
    expect(getCommandTitle("AvailableFundsCommand")).toBe("AvailableFundsCommand");
  });

  it("returns correct title for SalesRevenue", () => {
    expect(getCommandTitle("/salesrevenue")).toBe("SalesDataCommand");
    expect(getCommandTitle("SalesRevenueCommand")).toBe("SalesDataCommand");
  });

  it("returns correct title for cheque routes", () => {
    expect(getCommandTitle("/cheques/payable-cheques")).toBe("ChequeDataCommand");
    expect(getCommandTitle("/cheques/receivable-cheques")).toBe("ChequeDataCommand");
  });

  it("returns correct title for single command cases", () => {
    expect(getCommandTitle("NearDueChequesCommand")).toBe("NearDueChequesCommand");
    expect(getCommandTitle("TopNMostRevenuableProductsCommand"))
      .toBe("TopNMostRevenuableProductsCommand");
    expect(getCommandTitle("TopNMostSoldProductsCommand"))
      .toBe("TopNMostSoldProductsCommand");
  });

  it("returns correct title for multiple mapped commands", () => {
    expect(getCommandTitle("OutOfStockInSaleProductsCommand"))
      .toBe("OutOfStockInSaleProductsCommand");

    expect(getCommandTitle("topSeller")).toBe("OutOfStockInSaleProductsCommand");
    expect(getCommandTitle("topCustomer")).toBe("OutOfStockInSaleProductsCommand");
  });

  it("returns empty string for unknown paths", () => {
    expect(getCommandTitle("unknown-path")).toBe("");
    expect(getCommandTitle("")).toBe("");
  });
});
