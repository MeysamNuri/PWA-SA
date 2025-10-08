import { useLocation } from 'react-router'
import { useState } from "react";
import useSalesRevenue from "./useSalesRevenue";
import { DateFilterType } from "@/core/types/dateFilterTypes";
import { useTheme } from "@mui/material/styles";

// import useUserProfile from "./APIHooks";


export default function useSaleRevenueHooks() {
    const location = useLocation()
    const dateFilter = location.state?.dateFilter||DateFilterType.Today;
    const [selectedDate, setSelectedDate] = useState<DateFilterType>(dateFilter);
    const { data, isPending, isError } = useSalesRevenue(selectedDate);
    const { palette } = useTheme();

    return {
        setSelectedDate,
        selectedDate,
        data,
        isPending,
        isError,
        palette
    }
}