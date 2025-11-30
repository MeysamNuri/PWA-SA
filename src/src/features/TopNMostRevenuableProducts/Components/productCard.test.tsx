import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RenderProductCard from "./productCard";
import type { ITopNMostRevenuableProducts } from "../types";

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
        latinToArabic: (value: string | undefined) => {
            if (!value) return '0';
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
    const mockProduct: ITopNMostRevenuableProducts = {
        productName: 'iPhone 15',
        productCode: 'PROD001',
        salesQuantity: 10,
        salesRevenuAmount: 50000000,
        formattedSalesRevenuAmount: '50,000,000',
        salesRevenuAmountUOM: 'تومان',
        revenuPercentage: 25.5,
        purchaseAmount: 40000000,
        formattedPurchaseAmount: '40,000,000',
        purchaseAmountUOM: 'تومان',
        saleAmount: 50000000,
        formattedSaleAmount: '50,000,000',
        saleAmountUOM: 'تومان'
    };

    it("renders product card with correct header title", () => {
        render(
            <RenderProductCard
                product={mockProduct}
                index={0}
                filterByRevenue={true}
            />
        );

        expect(screen.getByTestId('card-header')).toHaveTextContent('iPhone 15');
    });

    it("renders correct rows when filterByRevenue is true", () => {
        render(
            <RenderProductCard
                product={mockProduct}
                index={0}
                filterByRevenue={true}
            />
        );

        // Check that all expected rows are rendered
        expect(screen.getByTestId('row-0')).toHaveTextContent('مبلغ فروش: ٥,٠٠٠,٠٠٠ تومان');
        expect(screen.getByTestId('row-1')).toHaveTextContent('مبلغ خرید: ٤,٠٠٠,٠٠٠ تومان');
        expect(screen.getByTestId('row-2')).toHaveTextContent('مبلغ سود: ٥,٠٠٠,٠٠٠ تومان');
    });

    it("renders correct rows when filterByRevenue is false", () => {
        render(
            <RenderProductCard
                product={mockProduct}
                index={0}
                filterByRevenue={false}
            />
        );

        // Check that all expected rows are rendered
        expect(screen.getByTestId('row-0')).toHaveTextContent('مبلغ فروش: ٥,٠٠٠,٠٠٠ تومان');
        expect(screen.getByTestId('row-1')).toHaveTextContent('مبلغ خرید: ٤,٠٠٠,٠٠٠ تومان');
        expect(screen.getByTestId('row-2')).toHaveTextContent('درصد سود: ٢٥.٥%');
    });

    it("handles zero values correctly", () => {
        const productWithZeros: ITopNMostRevenuableProducts = {
            ...mockProduct,
            salesRevenuAmount: 0,
            purchaseAmount: 0,
            saleAmount: 0,
            revenuPercentage: 0
        };

        render(
            <RenderProductCard
                product={productWithZeros}
                index={0}
                filterByRevenue={true}
            />
        );

        expect(screen.getByTestId('row-0')).toHaveTextContent('مبلغ فروش: ٠ تومان');
        expect(screen.getByTestId('row-1')).toHaveTextContent('مبلغ خرید: ٠ تومان');
        expect(screen.getByTestId('row-2')).toHaveTextContent('مبلغ سود: ٠ تومان');
    });

    it("handles undefined filterByRevenue prop", () => {
        render(
            <RenderProductCard
                product={mockProduct}
                index={0}
            />
        );

        // Should default to percentage filter behavior when filterByRevenue is undefined
        expect(screen.getByTestId('row-2')).toHaveTextContent('درصد سود: ٢٥.٥%');
    });

    it("renders correct number of rows", () => {
        render(
            <RenderProductCard
                product={mockProduct}
                index={0}
                filterByRevenue={true}
            />
        );

        // Should have 3 rows: مبلغ فروش, مبلغ خرید, and conditional row
        expect(screen.getByTestId('row-0')).toBeInTheDocument();
        expect(screen.getByTestId('row-1')).toBeInTheDocument();
        expect(screen.getByTestId('row-2')).toBeInTheDocument();
    });

    it("displays correct conditional row content for revenue filter", () => {
        render(
            <RenderProductCard
                product={mockProduct}
                index={0}
                filterByRevenue={true}
            />
        );

        const conditionalRow = screen.getByTestId('row-2');
        expect(conditionalRow).toHaveTextContent('مبلغ سود: ٥,٠٠٠,٠٠٠ تومان');
    });

    it("displays correct conditional row content for percentage filter", () => {
        render(
            <RenderProductCard
                product={mockProduct}
                index={0}
                filterByRevenue={false}
            />
        );

        const conditionalRow = screen.getByTestId('row-2');
        expect(conditionalRow).toHaveTextContent('درصد سود: ٢٥.٥%');
    });

    it("handles large numbers correctly", () => {
        const productWithLargeNumbers: ITopNMostRevenuableProducts = {
            ...mockProduct,
            salesRevenuAmount: 999999999,
            purchaseAmount: 888888888,
            saleAmount: 999999999,
            revenuPercentage: 99.9
        };

        render(
            <RenderProductCard
                product={productWithLargeNumbers}
                index={0}
                filterByRevenue={true}
            />
        );

        expect(screen.getByTestId('row-0')).toHaveTextContent('مبلغ فروش: ٩٩,٩٩٩,٩٩٩ تومان');
        expect(screen.getByTestId('row-1')).toHaveTextContent('مبلغ خرید: ٨٨,٨٨٨,٨٨٨ تومان');
        expect(screen.getByTestId('row-2')).toHaveTextContent('مبلغ سود: ٩٩,٩٩٩,٩٩٩ تومان');
    });

    it("handles decimal percentage values correctly", () => {
        const productWithDecimalPercentage: ITopNMostRevenuableProducts = {
            ...mockProduct,
            revenuPercentage: 12.75
        };

        render(
            <RenderProductCard
                product={productWithDecimalPercentage}
                index={0}
                filterByRevenue={false}
            />
        );

        expect(screen.getByTestId('row-2')).toHaveTextContent('درصد سود: ١٢.٧٥%');
    });

    it("handles undefined revenuPercentage", () => {
        const productWithUndefinedPercentage: ITopNMostRevenuableProducts = {
            ...mockProduct,
            revenuPercentage: undefined as unknown as number
        };

        render(
            <RenderProductCard
                product={productWithUndefinedPercentage}
                index={0}
                filterByRevenue={false}
            />
        );

        expect(screen.getByTestId('row-2')).toHaveTextContent('درصد سود: ٠%');
    });
});
