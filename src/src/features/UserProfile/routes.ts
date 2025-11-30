import type { RouteObject } from "react-router";
import UserProfileView from "./Views";
import ProtectedLayout from "@/core/layouts/ProtectedLayout";

export const UserProfileRoutes: RouteObject[] = [
    {
        path: "/user-profile",
        Component: ProtectedLayout,
        children: [
            {
                path: "",
                Component: UserProfileView,
            },
            
        ],
    },
];
