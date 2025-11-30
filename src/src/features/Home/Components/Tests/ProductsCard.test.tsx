// src/features/Home/Components/Tests/ProductCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductCard from "../ProductsCard";

describe("ProductCard", () => {
  const mockOnCardClick = vi.fn();
  const mockHandleClickOpen = vi.fn();

  const product = {
    productCode: "Test Product",
    productName: "Test Product",
    soldQuantity: 0,
    soldPrice: 0,
    productAvailableQuantity: 0,
    mainGroupName: "Test Product",
    sideGroupName: "Test Product",
    formattedSoldPrice: "Test Product",
    soldPriceUOM: "Test Product",
    id: "Test Product",
  };

  it("renders product info correctly", () => {
    render(
      <ProductCard
        product={product}
        subtitle="پرفروش"
        isPrice={true}
        commandName="test"
        title="test"
        onCardClick={mockOnCardClick}
        handleClickOpen={mockHandleClickOpen}
      />
    );

    // Product name
    fireEvent.click(
      screen.getByRole("heading", { name: "Test Product" }).closest(".MuiCard-root")!
    );
    expect(mockOnCardClick).toHaveBeenCalled();


    // Subtitle
    // Quantity + unit + price
    expect(screen.getByText("پرفروش")).toBeInTheDocument();
    expect(screen.getByText("عدد")).toBeInTheDocument();

  });

  it("calls onCardClick when card is clicked", () => {
    render(
      <ProductCard
        product={product}
        subtitle="پرفروش"
        isPrice={true}
        commandName="test"
        title="test"
        onCardClick={mockOnCardClick}
        handleClickOpen={mockHandleClickOpen}
      />
    );

    // Click on the card itself (Card component)
    fireEvent.click(screen.getByRole("heading", { name: "Test Product" }).closest(".MuiCard-root")!);
    expect(mockOnCardClick).toHaveBeenCalled();
  });

  // Note: Info button test removed because IconButton is currently commented out in ProductCard component

  it("renders fallback message when no product is provided", () => {
    render(
      <ProductCard
        subtitle="پرفروش"
        isPrice={true}
        commandName="test"
        title="test"
        onCardClick={mockOnCardClick}
        handleClickOpen={mockHandleClickOpen}
      />
    );

    expect(screen.getByText("داده‌ای برای نمایش وجود ندارد.")).toBeInTheDocument();
  });
});
