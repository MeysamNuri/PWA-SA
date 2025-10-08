import type { RouteObject } from "react-router";
// import FullLayout from "@/core/layouts/FullLayout";
import LoginView from "./Views/LoginView";
import OTPVerification from "./Views/OTPVerificaton";
import PasswordLogin from "./Views/PasswordLogin";
import ForgetPassword from "./Views/ForgetPasswordView";
import RulesAndTerms from "./Views/rulesTerms";

export const LoginRoutes: RouteObject[] = [
    {
        path: "/login",
        // Component: FullLayout,
        children: [
            {
                path: "",
                Component: LoginView,
            },
        ],
    },
    {
        path: "/otpVerification",
        Component: OTPVerification,
    },
    {
        path: "/password-login",
        Component: PasswordLogin,
    },
    {
        path: "/forget-password",
        Component: ForgetPassword,
    },
    {
        path: "/rules-regulations",
        Component: RulesAndTerms,
    },
];
