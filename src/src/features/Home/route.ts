import type { RouteObject } from "react-router";
import HomeView from "./Views/homeView";
// import FullLayout from "@/core/layouts/FullLayout";
import ProtectedLayout from "@/core/layouts/ProtectedLayout";
export const HomeRoutes: RouteObject[] = [
    {
        path: "/home",
        Component: ProtectedLayout,
        children: [
            {
                path: "",
                Component: HomeView,
            },
        ],
    },
];

