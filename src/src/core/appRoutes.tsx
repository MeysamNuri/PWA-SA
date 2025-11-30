import { Navigate } from "react-router";
import { LoginRoutes } from "@/features/Login/routes";
import { UserProfileRoutes } from "@/features/UserProfile/routes";
import { HomeRoutes } from "@/features/Home/route";
import NotFound from "@/core/components/NotFound";
import { NotificationsRoutes } from "@/features/Notifications/routes";
import { DebitCreditRoutes } from "@/features/DebitCredit/route";
import { SalesRevenueRoutes } from "@/features/SalesRevenue/route";
import { GetInSaleOutOfStockProductsRoutes } from "@/features/GetInSaleOutOfStockProducts/routes";
import { ChequesRoutes } from "@/features/Cheques/routes";
import { CurrencyRatesRoutes } from "@/features/CurrencyRates/routes";
import { AvailableFundsRoutes } from "@/features/AvailableFunds/routes";
import { TopNMostSoldProductsRoutes } from "@/features/TopNMostSoldProducts/routes";
import { TopNMostRevenuableProductsRoutes } from "@/features/TopNMostRevenuableProducts/routes";
import { personalityRoutes } from "@/features/Personality/routes";
import { SupportsViewRoutes } from "@/features/Supports/routes";
import { TopCustomersAndSellersRoutes } from "@/features/TopCustomersAndSellers/routes";
import { UnsettledInvoicesDetailsRoutes } from "@/features/UnsettledInvoicesDetails/routes";
import { HomeCustomizationRoutes } from "@/features/HomeCustomization/routes";

export const appRoutes = [
    { path: "/", element: <Navigate to="/home" replace /> },
    ...LoginRoutes,
    ...HomeRoutes,
    ...UserProfileRoutes,
    ...NotificationsRoutes,
    ...DebitCreditRoutes,
    ...SalesRevenueRoutes,
    ...GetInSaleOutOfStockProductsRoutes,
    ...CurrencyRatesRoutes,
    ...AvailableFundsRoutes,
    ...ChequesRoutes,
    ...TopNMostSoldProductsRoutes,
    ...TopNMostRevenuableProductsRoutes,
    ...personalityRoutes,
    ...SupportsViewRoutes,
    ...TopCustomersAndSellersRoutes,
    ...UnsettledInvoicesDetailsRoutes,
    ...HomeCustomizationRoutes,

    { path: "*", element: <NotFound /> },
];
