import { useState } from "react";
import useTopMostSoldProduct from "./APIHooks/useTopMostSoldProduct";
import useTopMostRevenuableProduct from "./APIHooks/useTopMostRevenuableProduct";
import { useNavigate } from "react-router";
import type { ITopNMostRevenuableProduct, ITopNMostSoldProduct } from "../types";

export default function useTopProductsData(initialDate: string = 'Last7Days') {
    const routeNavigate = useNavigate();
    const [selectedChip, setSelectedChip] = useState<string>(initialDate);

    const {
        data: soldData,
        isPending: isSoldLoading,
        error: soldError,
    } = useTopMostSoldProduct(selectedChip);
    const {
        data: revenuableData,
        isPending: isRevenuableLoading,
        error: revenuableError,
    } = useTopMostRevenuableProduct(selectedChip);

    const loading = isSoldLoading || isRevenuableLoading;
    const error = soldError || revenuableError;

    const handleDaysChange = (
        _event: React.MouseEvent<HTMLElement> | null,
        newDays: string | null,
    ) => {
        if (newDays) {
            setSelectedChip(newDays);
        }

    };


    const topSoldByPrice = soldData?.Data?.topNMostProductsByPrices?.[0] as ITopNMostSoldProduct | undefined;
    const topSoldByQuantity = soldData?.Data?.topNMostProductsByQuantity?.[0] as ITopNMostSoldProduct | undefined;
    const topRevenuableByAmount = revenuableData?.Data?.topNMostRevenuableProducts?.[0] as ITopNMostRevenuableProduct | undefined;
    const topRevenuableByPercent = revenuableData?.Data?.topNMostRevenuableProductsByRevenuPercentage?.[0] as ITopNMostRevenuableProduct | undefined;

    const handleSoldProductClick = () => {
        routeNavigate('/topSellingProducts');
    };

    const handleRevenuableProductClick = () => {
        routeNavigate('/topRevenuableProducts');
    };
    return {
        selectedChip,
        setSelectedChip,
        loading,
        error,
        topSoldByPrice,
        topSoldByQuantity,
        topRevenuableByAmount,
        topRevenuableByPercent,
        handleDaysChange,
        handleSoldProductClick,
        handleRevenuableProductClick
    };
}
