import type { RouteObject } from "react-router";
import AvailableFunds from "./View";
import ProtectedLayout from "@/core/layouts/ProtectedLayout";

export const AvailableFundsRoutes: RouteObject[] = [
    {
        path: "/AvailableFunds",
        Component: ProtectedLayout,
        children: [
            {
                path: "",
                Component: AvailableFunds,
            },
        ],
    },
];
