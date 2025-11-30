

import { DateFilterType } from "@/core/types/dateFilterTypes";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useLocation } from "react-router";


export default function useTopCustomersAndSellersHooks() {
    const { palette } = useTheme();
    const location = useLocation();

    const initialDate = location.state || DateFilterType.Last7Days;

    const [dateFilter, setDateFilter] = useState(initialDate.toString())

    const handleOnchange = (value: DateFilterType) => {
        setDateFilter(value as DateFilterType)

    }

    const infoOBJ = {
        path: "topCustomer",
        title: "مشتریان برتر"
    }

    const sellersInfoOBJ = {
        path: "topSeller",
        title: "فروشندگان برتر"
    }
    return {
        handleOnchange,
        dateFilter,
        palette,
        infoOBJ,
        sellersInfoOBJ
    }
}