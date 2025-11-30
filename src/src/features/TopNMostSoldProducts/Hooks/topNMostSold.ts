import { useState } from 'react';
import { useLocation } from 'react-router';
import { useTopNMostSoldProducts } from './APIHooks/useTopNMostSoldProducts';
import { DateFilterType } from "@/core/types/dateFilterTypes";



export const useTopNMostSoldProductsHook = () => {
    const location = useLocation();
    const initialDate = location.state?.date || DateFilterType.Last7Days;
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

    const totalPriceUOM = topSellingProducts.length > 0 ? topSellingProducts[0].soldPriceUOM : "تومان";

    const handleChipClick = (value: DateFilterType) => {
        setSelectedChip(value.toString());
    };

    const handleFilterChange = (isPriceFilter: boolean) => {
        setFilterByPrice(isPriceFilter);
    };
    const dateOptions = [
        { label: "۳۰ روز گذشته", value: DateFilterType.Last30Days },
        { label: "۷ روز گذشته", value: DateFilterType.Last7Days },
        { label: "دیروز", value: DateFilterType.Yesterday },
    ];
      const infoOBJ = {
        path: "TopNMostSoldProductsCommand",
        title: "پرفروش ترین کالاها"
    }
    return {
        topSellingProducts,
        loading: isPending,
        error: isError ? "خطا در دریافت اطلاعات کالاهای پرفروش" : null,
        selectedChip,
        filterByPrice,
        totalPrice,
        totalQuantity,
        totalPriceUOM,
        dateOptions,
        infoOBJ,
        handleChipClick,
        handleFilterChange
    };
};

export default useTopNMostSoldProductsHook;
