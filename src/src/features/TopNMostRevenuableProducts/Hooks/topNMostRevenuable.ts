import { useState } from 'react';
import { useLocation } from 'react-router';
import { useTopNMostRevenuableProducts } from './APIHooks/useTopNMostRevenuableProducts';
import { DateFilterType } from '@/core/types/dateFilterTypes';


export const useTopNMostRevenuableProductsHook = () => {
    const location = useLocation();
    const initialDate = location.state?.date || DateFilterType.Last7Days;
    const [selectedChip, setSelectedChip] = useState<string>(initialDate.toString());
    const [filterByRevenue, setFilterByRevenue] = useState<boolean>(location.state?.filterByRevenue ?? true);

    const { data, isPending, isError } = useTopNMostRevenuableProducts(selectedChip);

    const topRevenuableProducts = data?.Data ?
        (filterByRevenue ? data.Data.topNMostRevenuableProducts : data.Data.topNMostRevenuableProductsByRevenuPercentage) :
        [];

    const totalRevenue = topRevenuableProducts.reduce((sum, product) =>
        sum + (parseFloat(product.formattedSalesRevenuAmount) || 0), 0
    );

    const totalProfit = topRevenuableProducts.reduce((sum, product) =>
        sum + (parseFloat(product.formattedSalesRevenuAmount) - parseFloat(product.formattedPurchaseAmount) || 0), 0
    );

    const handleChipClick = (value: DateFilterType) => {
        setSelectedChip(value.toString());
    };

    const handleFilterChange = (isRevenueFilter: boolean) => {
        setFilterByRevenue(isRevenueFilter);
    };

    const dateOptions = [
        { label: "۳۰ روز گذشته", value: DateFilterType.Last30Days },
        { label: "۷ روز گذشته", value: DateFilterType.Last7Days },
        { label: "دیروز", value: DateFilterType.Yesterday },
    ];
    const infoOBJ = {
        path: "TopNMostRevenuableProductsCommand",
        title: "پرسود ترین کالاها"
    }
    return {
        topRevenuableProducts,
        loading: isPending,
        error: isError ? "خطا در دریافت اطلاعات کالاهای پرسود" : null,
        selectedChip,
        filterByRevenue,
        totalRevenue,
        totalProfit,
        dateOptions,
        infoOBJ,
        handleChipClick,
        handleFilterChange
    };
};
