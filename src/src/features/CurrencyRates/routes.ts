import type { RouteObject } from "react-router";

import CurrencyRatesView from "./Views";
import ProtectedLayout from "@/core/layouts/ProtectedLayout";

export const CurrencyRatesRoutes: RouteObject[] = [
    {
        path: "/currencyRates",
        Component: ProtectedLayout,
        children: [
            {
                path: "/currencyRates",
                Component: CurrencyRatesView,
            },
            {
                path: "/currencyRates/currency",
                Component: CurrencyRatesView,
            },
            {
                path: "/currencyRates/coin",
                Component: CurrencyRatesView,
            },
            {
                path: "/currencyRates/gold",
                Component: CurrencyRatesView,
            },
        ],
    },
];
