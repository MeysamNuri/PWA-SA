import React from "react";
import MainCard from "@/core/components/MainCard/MainCard";
import { NumberConverter } from "@/core/helper/numberConverter";
import type { ITopNMostRevenuableProducts } from "../types";

// Define the props interface for the component to improve type safety.
interface ProductCardProps {
    product: ITopNMostRevenuableProducts;
    index: number;
    filterByRevenue?: boolean;
}

// Update the function signature to accept a single props object and destructure it.
const RenderProductCard: React.FC<ProductCardProps> = ({ product, filterByRevenue }) => {
    const baseRows = [
        {
            title: "مبلغ فروش",
            value: `${NumberConverter.latinToArabic(product.formattedSalesRevenuAmount)} تومان`,
            rowSize: 12
        },
        {
            title: "مبلغ خرید",
            value: `${NumberConverter.latinToArabic(product.formattedPurchaseAmount)} تومان`,
            rowSize: 12
        }
    ];

    const conditionalRow = filterByRevenue
        ? {
            title: "مبلغ سود",
            value: `${NumberConverter.latinToArabic(product.formattedSalesRevenuAmount)} تومان`,
            rowSize: 12
        }
        : {
            title: "درصد سود",
            value: `${NumberConverter.latinToArabic(product.revenuPercentage?.toString())}%`,
            rowSize: 12
        };

    const rows = [...baseRows, conditionalRow];

    return (
        // The key prop should be applied to the component itself in the parent's map loop.
        // It's not necessary to define it here on the root element, as the parent is already doing it.
        <MainCard
            rows={rows}
            headerTitle={product.productName}
            headerIcon=""
            isCollapsible={false}
            path=""
        />
    );
};

export default RenderProductCard;