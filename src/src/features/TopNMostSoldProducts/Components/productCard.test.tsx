import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RenderProductCard from "./productCard";
import type { TopSellingProductsApi } from "../types";

// Mock the MainCard component
vi.mock('@/core/components/MainCard/MainCard', () => ({
    default: ({ headerTitle, rows, children }: any) => (
        <div data-testid="main-card">
            <div data-testid="card-header">{headerTitle}</div>
            <div data-testid="card-rows">
                {rows?.map((row: any, index: number) => (
                    <div key={index} data-testid={`row-${index}`}>
                        {row.title}: {row.value}
                    </div>
                ))}
            </div>
            {children}
        </div>
    )
}));

// Mock the number converter
vi.mock('@/core/helper/numberConverter', () => ({
    NumberConverter: {
        latinToArabic: (value: string) => {
            // Convert Latin numerals to Arabic numerals
            return value.replace(/\d/g, (digit) => {
                const arabicMap: { [key: string]: string } = {
                    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
                    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
                };
                return arabicMap[digit] || digit;
            });
        },
        formatCurrency: (value: number) => {
            // Mock implementation that adds commas and converts to Arabic numerals
            const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return formatted.replace(/\d/g, (digit) => {
                const arabicMap: { [key: string]: string } = {
                    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
                    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
                };
                return arabicMap[digit] || digit;
            });
        }
    }
}));

describe("RenderProductCard", () => {
    const mockProduct: TopSellingProductsApi = {
        productCode: "PROD001",
        productName: "iPhone 15",
        soldQuantity: 100,
        soldPrice: 50000000,
        productAvailableQuantity: 50,
        mainGroupName: "موبایل",
        sideGroupName: "اپل",
        formattedSoldPrice: "50,000,000",
        soldPriceUOM: "تومان",
        id: "1"
    };

    it("renders product card with correct header title", () => {
        render(
            <RenderProductCard
                product={mockProduct}
                index={0}
                filterByPrice={true}
            />
        );

        expect(screen.getByTestId('card-header')).toHaveTextContent('iPhone 15');
    });

    it("renders correct rows when filterByPrice is true", () => {
        render(
            <RenderProductCard
                product={mockProduct}
                index={0}
                filterByPrice={true}
            />
        );

        // Check that all expected rows are rendered
        expect(screen.getByTestId('row-0')).toHaveTextContent('مبلغ فروش: ٥,٠٠٠,٠٠٠ تومان');
        expect(screen.getByTestId('row-1')).toHaveTextContent('تعداد فروش: ١٠٠ عدد');
        expect(screen.getByTestId('row-2')).toHaveTextContent('مبلغ فروش: ٥,٠٠٠,٠٠٠ تومان');
    });

    it("renders correct rows when filterByPrice is false", () => {
        render(
            <RenderProductCard
                product={mockProduct}
                index={0}
                filterByPrice={false}
            />
        );

        // Check that all expected rows are rendered
        expect(screen.getByTestId('row-0')).toHaveTextContent('مبلغ فروش: ٥,٠٠٠,٠٠٠ تومان');
        expect(screen.getByTestId('row-1')).toHaveTextContent('تعداد فروش: ١٠٠ عدد');
        expect(screen.getByTestId('row-2')).toHaveTextContent('موجودی: ٥٠ عدد');
    });

    it("handles zero values correctly", () => {
        const productWithZeros: TopSellingProductsApi = {
            ...mockProduct,
            soldQuantity: 0,
            soldPrice: 0,
            productAvailableQuantity: 0
        };

        render(
            <RenderProductCard
                product={productWithZeros}
                index={0}
                filterByPrice={true}
            />
        );

        expect(screen.getByTestId('row-0')).toHaveTextContent('مبلغ فروش: ٠ تومان');
        expect(screen.getByTestId('row-1')).toHaveTextContent('تعداد فروش: ٠ عدد');
        expect(screen.getByTestId('row-2')).toHaveTextContent('مبلغ فروش: ٠ تومان');
    });

    it("handles undefined filterByPrice prop", () => {
        render(
            <RenderProductCard
                product={mockProduct}
                index={0}
            />
        );

        // Should default to quantity filter behavior when filterByPrice is undefined
        expect(screen.getByTestId('row-2')).toHaveTextContent('موجودی: ٥٠ عدد');
    });

    it("renders correct number of rows", () => {
        render(
            <RenderProductCard
                product={mockProduct}
                index={0}
                filterByPrice={true}
            />
        );

        // Should have 3 rows: مبلغ فروش, تعداد فروش, and conditional row
        expect(screen.getByTestId('row-0')).toBeInTheDocument();
        expect(screen.getByTestId('row-1')).toBeInTheDocument();
        expect(screen.getByTestId('row-2')).toBeInTheDocument();
    });

    it("displays correct conditional row content for price filter", () => {
        render(
            <RenderProductCard
                product={mockProduct}
                index={0}
                filterByPrice={true}
            />
        );

        const conditionalRow = screen.getByTestId('row-2');
        expect(conditionalRow).toHaveTextContent('مبلغ فروش: ٥,٠٠٠,٠٠٠ تومان');
    });

    it("displays correct conditional row content for quantity filter", () => {
        render(
            <RenderProductCard
                product={mockProduct}
                index={0}
                filterByPrice={false}
            />
        );

        const conditionalRow = screen.getByTestId('row-2');
        expect(conditionalRow).toHaveTextContent('موجودی: ٥٠ عدد');
    });

    it("handles large numbers correctly", () => {
        const productWithLargeNumbers: TopSellingProductsApi = {
            ...mockProduct,
            soldQuantity: 999999,
            soldPrice: 999999999,
            productAvailableQuantity: 999999
        };

        render(
            <RenderProductCard
                product={productWithLargeNumbers}
                index={0}
                filterByPrice={true}
            />
        );

        expect(screen.getByTestId('row-0')).toHaveTextContent('مبلغ فروش: ٩٩,٩٩٩,٩٩٩ تومان');
        expect(screen.getByTestId('row-1')).toHaveTextContent('تعداد فروش: ٩٩٩٩٩٩ عدد');
        expect(screen.getByTestId('row-2')).toHaveTextContent('مبلغ فروش: ٩٩,٩٩٩,٩٩٩ تومان');
    });
});
