import { useState } from 'react';
import { useLocation } from 'react-router';
import { useTopNMostRevenuableProducts } from './APIHooks/useTopNMostRevenuableProducts';

export enum DateEnum {
    Yesterday = '1',
    Last7Days = '7',
    Last30Days = '30'
}

export const useTopNMostRevenuableProductsHook = () => {
    const location = useLocation();
    const initialDate = location.state?.date || DateEnum.Last7Days;
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

    const handleChipClick = (value: DateEnum) => {
        setSelectedChip(value.toString());
    };

    const handleFilterChange = (isRevenueFilter: boolean) => {
        setFilterByRevenue(isRevenueFilter);
    };

       const dateOptions = [
            { label: "دیروز", value: DateEnum.Yesterday },
            { label: "۷ روز گذشته", value: DateEnum.Last7Days },
            { label: "۳۰ روز گذشته", value: DateEnum.Last30Days }
        ];
    
    return {
        topRevenuableProducts,
        loading: isPending,
        error: isError ? "خطا در دریافت اطلاعات کالاهای پرسود" : null,
        selectedChip,
        filterByRevenue,
        totalRevenue,
        totalProfit,
        dateOptions,
        handleChipClick,
        handleFilterChange
    };
};
