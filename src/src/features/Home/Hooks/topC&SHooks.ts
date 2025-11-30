import { DateFilterType } from "@/core/types/dateFilterTypes";
import { useState } from "react";
import useGetSalesBySeller from "./APIHooks/useSalesBySeller";
import useTopCustomersByPurchaseHook from "./APIHooks/useTopCustomers";
import { useNavigate } from 'react-router'

export default function useTopCustomersAndSellers() {
    const [dateFilter, setDataFilter] = useState<string>(DateFilterType.Last7Days)
    const [daysTypeFilter, setDaysTypeFilter] = useState<string>(DateFilterType.Last3Months)
    const { salesBySellerData } = useGetSalesBySeller(dateFilter);
    const { topCustomersByPurchaseData } = useTopCustomersByPurchaseHook(daysTypeFilter);
    const navigate = useNavigate()

    const handleDaysChange = (
        _event: React.MouseEvent<HTMLElement> | null,
        newDays: string | null,
    ) => {
        if (newDays) {
            setDataFilter(newDays);
        }

    };
    const handleTopCustomersDaysChange = (
        _event: React.MouseEvent<HTMLElement> | null,
        newDays: string | null,
    ) => {
        if (newDays) {
            setDaysTypeFilter(newDays);
        }

    };

    const handleDetailsNavigate = (path: string) => {
        navigate(path, { state: path === "/top-sellers" ? dateFilter : daysTypeFilter })
    }

    return {
        dateFilter,
        daysTypeFilter,
        handleDaysChange,
        handleTopCustomersDaysChange,
        handleDetailsNavigate,
        salesBySellerData,
        topCustomersByPurchaseData

    };
}
