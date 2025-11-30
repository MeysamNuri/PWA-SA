import type { RouteObject } from "react-router";
import Supports from "./View";
import ChatBot from "./View/chatBot";
import ProtectedLayout from "@/core/layouts/ProtectedLayout";

export const SupportsViewRoutes: RouteObject[] = [
    {
        path: "/supports",
        Component: ProtectedLayout,
        children: [
            {
                path: "",
                Component: Supports,
            },
            {
                path: "/supports/chatbot",
                Component: ChatBot,
            },
        ],
    },
];
