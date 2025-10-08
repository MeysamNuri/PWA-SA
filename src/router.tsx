import { useRoutes } from "react-router";
import { appRoutes } from "@/core/appRoutes.tsx";

export const AppRouter = () => {
    const element = useRoutes(appRoutes);
    return element;
};