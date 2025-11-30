
import { useLocation } from "react-router";
import { ChequesDateFilterType } from "@/core/types/dateFilterTypes";
import { useChequeFilterStore } from "@/core/zustandStore";
import { useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useChequesStore } from '@/core/zustandStore';
import useNearDueChequesDetailHook from "./APIHooks/getNearDueChequesDetail";
import type { IChequesNearDueTotal, INearDueChequesSubTotalOutput } from "../types";

export default function useDetailChequesHooks() {
    const location = useLocation();
    const { palette } = useTheme();
    const dataFilter = useChequeFilterStore((state) => state.dataFilter);
    const itemsData = useChequesStore((state) => state.items);
    const [expandedCard, setExpandedCard] = useState<number | null>(0)

    const isAllCheques = !!location.state
    // Extract cheque type from URL
    const url = location.pathname.split("/")[2];
    const isReceivable = url === 'receivable-cheques';
    const chequeStatus = isReceivable ? "Receivable" : "Payable";
    const bankCode: string | undefined = itemsData?.bankcode;
    const accountNumber: string | undefined = itemsData?.bankAccountNumber;
    const totalData = location?.state?.itemsData ?? itemsData as (INearDueChequesSubTotalOutput & IChequesNearDueTotal) | undefined;
  
    const { nearDueChequesDetailsData, isPending: nearDueChequesPending } = useNearDueChequesDetailHook(
        chequeStatus,
        dataFilter,
        isAllCheques ? undefined : accountNumber,
        isAllCheques ? undefined : bankCode
    );


    const text = useMemo(() => {
        if (dataFilter === ChequesDateFilterType.Next30DaysDate) {
            return '۳۰ روز آینده'
        }
        else if (dataFilter === ChequesDateFilterType.Next7DaysDate) {
            return '۷ روز آینده'
        }
        else if (dataFilter === ChequesDateFilterType.TomorrowDate) {
            return 'فردا'
        }

    }, [dataFilter])

    return {
        setExpandedCard,
        text,
        palette,
        expandedCard,
        isReceivable,
        chequeStatus,
        nearDueChequesDetailsData,
        nearDueChequesPending,
        totalData

    }
}