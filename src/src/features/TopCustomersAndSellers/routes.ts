import type { RouteObject } from "react-router";
import TopCustomersView from "./Views/topCustomers";
import TopSellersView from "./Views/topSellers";
import ProtectedLayout from "@/core/layouts/ProtectedLayout";

export const TopCustomersAndSellersRoutes: RouteObject[] = [
    {
        path: "/",
        Component: ProtectedLayout,
        children: [
            {
                path: "/top-customers",
                Component: TopCustomersView,
            },
            {
                path: "/top-sellers",
                Component: TopSellersView,
            },
        ],
    },
];
