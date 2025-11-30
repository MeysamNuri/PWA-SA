import type { RouteObject } from "react-router";
import NotificationsView from "./Views";
import NotFoundNotice from "./Views/notFoundNotification";
import ProtectedLayout from "@/core/layouts/ProtectedLayout";

export const NotificationsRoutes: RouteObject[] = [
    {
        path: "/notifications",
        Component: ProtectedLayout,
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
