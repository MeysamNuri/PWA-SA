import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CustomerSellerList from "../customerSellerList";
import { ThemeProvider, createTheme } from "@mui/material";

// Mock the NumberConverter module
vi.mock("@/core/helper/numberConverter", () => ({
  NumberConverter: {
    // A more realistic mock for your test
    latinToArabic: vi.fn((str) => {
      // Simple logic to convert 1 to Persian/Arabic numeral
      if (str === "1") return "۱";
      // This part ensures other numbers are also mocked correctly
      if (str === "10") return "۱۰";
      return str;
    }),
  },
}));

// Create a mock MUI theme
const mockTheme = createTheme({
  palette: {
    text: {
      primary: "#000",
    },
    background: {
      default: "#fff",
    },
  },
});

describe("CustomerSellerList", () => {
  const mockProps = {
    itemIndex: 0,
    fullName: "John Doe",
    invoiceQuantity: 10,
    soldPriceUOM: "USD",
    formattedSoldPrice: "100.50",
  };

  it("should render correctly with all props", () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <CustomerSellerList {...mockProps} />
      </ThemeProvider>
    );

    // Use a regular expression to match the text for the name
    const itemIndexAndName = screen.getByText(/۱-John Doe/);
    expect(itemIndexAndName).toBeInTheDocument();

    // Use a function matcher to handle the split text content for invoice quantity
    const invoiceQuantity = screen.getByText((_, element) => {
      const normalizedContent = element?.textContent?.replace(/\s+/g, ' ').trim();
      return normalizedContent === '۱۰ فاکتور';
    });
    expect(invoiceQuantity).toBeInTheDocument();

    // Use a function matcher to handle the sold price text
    const soldPriceAndUOM = screen.getByText((_, element) => {
      const normalizedContent = element?.textContent?.replace(/\s+/g, ' ').trim();
      return normalizedContent === '100.50 USD';
    });
    expect(soldPriceAndUOM).toBeInTheDocument();
  });
});