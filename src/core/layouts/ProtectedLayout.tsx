import { Navigate } from "react-router";

import FullLayout from "./FullLayout";

const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    return !!token;
};

export default function ProtectedLayout() {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <FullLayout />
    );
} 