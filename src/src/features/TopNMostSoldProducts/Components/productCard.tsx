import React from "react";
import MainCard from "@/core/components/MainCard/MainCard";
import { NumberConverter } from "@/core/helper/numberConverter";
import type { TopSellingProductsApi } from "../types";

interface ProductCardProps {
    product: TopSellingProductsApi;
    index: number;
    filterByPrice?: boolean;
}

const RenderProductCard: React.FC<ProductCardProps> = ({ product, filterByPrice }) => {
    const baseRows = [
        {
            title: "مبلغ فروش",
            value: `${NumberConverter.formatCurrency(Math.floor((product.soldPrice || 0) / 10))} تومان`,
            rowSize: 12
        },
        {
            title: "تعداد فروش",
            value: `${NumberConverter.latinToArabic((product.soldQuantity || 0).toString())} عدد`,
            rowSize: 12
        }
    ];

    const conditionalRow = filterByPrice
        ? {
            title: "مبلغ فروش",
            value: `${NumberConverter.formatCurrency(Math.floor((product.soldPrice || 0) / 10))} تومان`,
            rowSize: 12
        }
        : {
            title: "موجودی",
            value: `${NumberConverter.latinToArabic((product.productAvailableQuantity || 0).toString())} عدد`,
            rowSize: 12
        };

    const rows = [...baseRows, conditionalRow];

    return (
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
