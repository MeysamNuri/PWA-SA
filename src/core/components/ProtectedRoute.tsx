import { Navigate, Outlet } from "react-router";

const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    return !!token;
};

export default function ProtectedRoute() {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
} 