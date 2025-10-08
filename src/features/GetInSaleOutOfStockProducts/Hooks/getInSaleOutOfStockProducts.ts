
import useGetInSaleOutOfStockProducts from "../Hooks/APIHooks/useGetInSaleOutOfStockProducts";
import { useState } from "react";

export default function useGetInSaleOutOfStockProductsHooks() {
    const { data, isPending, isError } = useGetInSaleOutOfStockProducts();
    const [expandedCard, setExpandedCard] = useState<number | null>(0);

    const products = Array.isArray(data?.Data) ? data.Data : [];

    const totalNeed = products.reduce((sum, item) => sum + (item.needQuantity || 0), 0);
    const totalExist = products.reduce((sum, item) => sum + (item.exist || 0), 0);
    const totalSales = products.reduce((sum, item) => sum + (item.salesQuantity || 0), 0);

    const sortedProducts = [...products].sort((a, b) => b.needQuantity - a.needQuantity);

    return {
        setExpandedCard,
        expandedCard,
        totalNeed,
        totalExist,
        totalSales,
        sortedProducts,
        isPending,
        isError,
        products,
    };
}