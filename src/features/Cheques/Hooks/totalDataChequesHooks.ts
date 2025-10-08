
// import { useState } from "react";
import { useLocation } from "react-router";
import useNearDueChequesSubTotalHook from "../Hooks/APIHooks/getNearDueChequesSubTotal";
import { ChequesDateFilterType, DateFilterType } from "@/core/types/dateFilterTypes";
import { useChequeFilterStore } from "@/core/constant/zustandStore";
import { useTheme } from "@mui/material/styles";


export default function useTotaDataChequesHooks() {
    const location = useLocation();
    const { palette } = useTheme();
    const setDataFilter = useChequeFilterStore((state) => state.setDataFilter);
    const dataFilter = useChequeFilterStore((state) => state.dataFilter);
    // Extract cheque type from URL
    const url = location.pathname.split("/")[2];
    const isReceivable = url === 'receivable-cheques';
    const chequeStatus = isReceivable ? "Receivable" : "Payable";
    const detailsPath = isReceivable ? "/cheques/receivable-cheques/details" : "/cheques/payable-cheques/details";
    const { nearDueChequesSubTotalData, isPending } = useNearDueChequesSubTotalHook(chequeStatus, dataFilter);
    const handleOnchange = (value: ChequesDateFilterType | DateFilterType) => {
        setDataFilter(value as ChequesDateFilterType)

    }
    

    return {
        handleOnchange,
        dataFilter,
        palette,
        detailsPath,
        isPending,
        isReceivable,
        chequeStatus,
        nearDueChequesSubTotalData,
     
    }
}