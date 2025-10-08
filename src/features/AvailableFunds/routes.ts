import type { RouteObject } from "react-router";
import AvailableFunds from "./View";
import ProtectedRoute from "@/core/components/ProtectedRoute";

export const AvailableFundsRoutes: RouteObject[] = [
    {
        path: "/AvailableFunds",
        Component: ProtectedRoute,
        children: [
            {
                path: "",
                Component: AvailableFunds,
            },
        ],
    },
];
