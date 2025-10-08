import type { RouteObject } from "react-router";
import UserProfileView from "./Views";
import ProtectedRoute from "@/core/components/ProtectedRoute";

export const UserProfileRoutes: RouteObject[] = [
    {
        path: "/user-profile",
        Component: ProtectedRoute,
        children: [
            {
                path: "",
                Component: UserProfileView,
            },
        ],
    },
];
