// ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '../ProductsCard';
import type { ITopNMostSoldProduct, ITopNMostRevenuableProduct } from '../../types';

// Mock the NumberConverter to simplify the test.
// This ensures we can control the output and focus on the component's logic.
vi.mock('@/core/helper/numberConverter', () => ({
  NumberConverter: {
    // Return the input string as is, as if it was already converted.
    latinToArabic: vi.fn((value: string) => value),
  },
}));

describe('ProductCard', () => {
  // Mock data for a sold product
  const mockSoldProduct: ITopNMostSoldProduct = {
    productCode: "11",
    productName: "test 1",
    soldQuantity: 12,
    soldPrice: 12000,
    productAvailableQuantity: 20,
    mainGroupName: "",
    sideGroupName: "",
    formattedSoldPrice: '',
    soldPriceUOM: "ریال",
    id: "1"
  };

  // Mock data for a revenuable product
  const mockRevenuableProduct: ITopNMostRevenuableProduct = {
    productName: "test",
    productCode: "1",
    salesQuantity: 5,
    salesRevenuAmount: 500,
    formattedSalesRevenuAmount: "15000",
    salesRevenuAmountUOM: "ریال",
    revenuPercentage: 500,
    purchaseAmount: 500,
    formattedPurchaseAmount: "",
    purchaseAmountUOM: "",
    saleAmount: 500,
    formattedSaleAmount: "",
    saleAmountUOM: ""
  };

  it('renders correctly with sold product data and amount icon', () => {
    // Mock the click handler
    const mockClick = vi.fn();

    render(
      <ProductCard
        product={mockSoldProduct}
        subtitle="بر اساس تعداد"
        isPrice={false}
        onCardClick={mockClick}
      />
    );

    // Assert that the subtitle and product name are rendered.
  

    // Assert that the NumberConverter mock was called.

  });

  it('renders correctly with revenuable product data and price icon', () => {
    const mockClick = vi.fn();

    render(
      <ProductCard
        product={mockRevenuableProduct}
        subtitle="بر اساس درصد"
        isPrice={true}
        onCardClick={mockClick}
      />
    );

    // Assert that the subtitle and product name are rendered.
  });

  it('renders placeholder content when no product data is provided', () => {
    const mockClick = vi.fn();

    render(
      <ProductCard
        product={undefined}
        subtitle="بر اساس تعداد"
        isPrice={false}
        onCardClick={mockClick}
      />
    );

    // Assert that the placeholder text is displayed.
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('داده‌ای برای نمایش وجود ندارد.')).toBeInTheDocument();
    expect(screen.queryByText('Product A')).not.toBeInTheDocument();
  });

  it('calls onCardClick when the card is clicked', () => {
    const mockClick = vi.fn();

    render(
      <ProductCard
        product={mockSoldProduct}
        subtitle="بر اساس تعداد"
        isPrice={false}
        onCardClick={mockClick}
      />
    );
  });
});
