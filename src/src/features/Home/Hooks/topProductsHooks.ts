import { useState } from "react";
import useTopMostSoldProduct from "./APIHooks/useTopMostSoldProduct";
import useTopMostRevenuableProduct from "./APIHooks/useTopMostRevenuableProduct";
import { useNavigate } from "react-router";
import type { ITopNMostRevenuableProduct, ITopNMostSoldProduct } from "../types";
import { useInfoModalStore } from "@/core/zustandStore";
import { DateFilterType } from "@/core/types/dateFilterTypes";

export default function useTopProductsData(initialDate: string = 'Last7Days') {
    const routeNavigate = useNavigate();
    const [selectedChip, setSelectedChip] = useState<string>(initialDate);
    const [open, setOpen] = useState(false);

    const setInfoDetails = useInfoModalStore((state) => state.setInfoDetails)

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
    const options = [
        { label: 'دیروز', value: DateFilterType.Yesterday },
        { label: '۷روز گذشته', value: DateFilterType.Last7Days },
        { label: '۳۰روز گذشته', value: DateFilterType.Last30Days },

    ]

    const topSoldByPrice = soldData?.Data?.topNMostProductsByPrices?.[0] as ITopNMostSoldProduct | undefined;
    const topSoldByQuantity = soldData?.Data?.topNMostProductsByQuantity?.[0] as ITopNMostSoldProduct | undefined;
    const topRevenuableByAmount = revenuableData?.Data?.topNMostRevenuableProducts?.[0] as ITopNMostRevenuableProduct | undefined;
    const topRevenuableByPercent = revenuableData?.Data?.topNMostRevenuableProductsByRevenuPercentage?.[0] as ITopNMostRevenuableProduct | undefined;

    const handleSoldProductClick = () => {
        routeNavigate('/topSellingProducts',{state:{date:selectedChip}});
    };

    const handleRevenuableProductClick = () => {
        routeNavigate('/topRevenuableProducts',{state:{date:selectedChip}});
    };

    const handleClickOpen = ({ path, title }: { path: string, title: string }) => {
        const infoDetail = {
            path,
            title
        }
        setInfoDetails(infoDetail)
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
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
        open,
        options,
        handleDaysChange,
        handleSoldProductClick,
        handleRevenuableProductClick,
        handleClickOpen,
        handleClose
    };
}
