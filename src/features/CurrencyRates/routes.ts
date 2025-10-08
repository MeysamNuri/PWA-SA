import type { RouteObject } from "react-router";
import ProtectedRoute from "@/core/components/ProtectedRoute";
import CurrencyRatesView from "./Views";

export const CurrencyRatesRoutes: RouteObject[] = [
    {
        path: "/currencyRates",
        Component: ProtectedRoute,
        children: [
            {
                path: "/currencyRates",
                Component: CurrencyRatesView,
            },
        ],
    },
];
