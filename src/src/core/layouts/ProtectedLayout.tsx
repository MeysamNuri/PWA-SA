import { Navigate, useLocation, Outlet } from "react-router-dom";
import HomeHeader from "./components/Header";
import { Box } from "@mui/material";
import { isAuthenticated } from "../helper/authentication";



export default function ProtectedLayout() {
    const { pathname } = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace data-testid="navigate-to" />;
    }

    return (
        <Box sx={{ maxWidth: "900px", margin: "auto" }}>
            {pathname === "/home" ? <HomeHeader /> : null}
            <main>
                <Outlet data-testid="outlet" />
            </main>
        </Box>
    );
}
