import { useState } from 'react';
import { useLocation } from 'react-router';
import { useTopNMostSoldProducts } from './APIHooks/useTopNMostSoldProducts';

export enum DateEnum {
    Yesterday = '1',
    Last7Days = '7',
    Last30Days = '30'
}

export const useTopNMostSoldProductsHook = () => {
    const location = useLocation();
    const initialDate = location.state?.date || DateEnum.Last7Days;
    const [selectedChip, setSelectedChip] = useState<string>(initialDate.toString());
    const [filterByPrice, setFilterByPrice] = useState<boolean>(location.state?.filterByPrice ?? true);


    const { data, isPending, isError } = useTopNMostSoldProducts(selectedChip);

    const topSellingProducts = data?.Data ?
        (filterByPrice ? data.Data.topNMostProductsByPrices : data.Data.topNMostProductsByQuantity) :
        [];

    const totalPrice = topSellingProducts.reduce((sum: number, product: any) =>
        sum + (parseFloat(product.formattedSoldPrice) || 0), 0
    );

    const totalQuantity = topSellingProducts.reduce((sum: number, product: any) =>
        sum + product.soldQuantity, 0
    );

    const handleChipClick = (value: DateEnum) => {
        setSelectedChip(value.toString());
    };

    const handleFilterChange = (isPriceFilter: boolean) => {
        setFilterByPrice(isPriceFilter);
    };
    const dateOptions = [
        { label: "دیروز", value: DateEnum.Yesterday },
        { label: "۷ روز گذشته", value: DateEnum.Last7Days },
        { label: "۳۰ روز گذشته", value: DateEnum.Last30Days }
    ];
    return {
        topSellingProducts,
        loading: isPending,
        error: isError ? "خطا در دریافت اطلاعات کالاهای پرفروش" : null,
        selectedChip,
        filterByPrice,
        totalPrice,
        totalQuantity,
        dateOptions,
        handleChipClick,
        handleFilterChange
    };
};

export default useTopNMostSoldProductsHook;
