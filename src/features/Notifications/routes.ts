import type { RouteObject } from "react-router";
import NotificationsView from "./Views";
import ProtectedRoute from "@/core/components/ProtectedRoute";
import NotFoundNotice from "./Views/notFoundNotification";

export const NotificationsRoutes: RouteObject[] = [
    {
        path: "/notifications",
        Component: ProtectedRoute,
        children: [
            {
                path: "",
                Component: NotificationsView,
            },
            {
                path: "/notifications/notFoundNotice",
                Component: NotFoundNotice,
            },
        ],
    },
];
