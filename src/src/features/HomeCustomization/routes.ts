import type { RouteObject } from "react-router";
import HomeCustomizationView from "./Views";
import ProtectedLayout from "@/core/layouts/ProtectedLayout";


export const HomeCustomizationRoutes: RouteObject[] = [

    {
        path: "/homepage-customization",
        Component: ProtectedLayout,
        children: [
            {
                path: "",
                Component: HomeCustomizationView,
            },
        ],
    },
   
];
