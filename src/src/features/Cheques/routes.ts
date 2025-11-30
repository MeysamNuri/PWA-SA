import type { RouteObject } from "react-router";

import ChequesView from "./View/cheques";
import ChequesDetailsView from "./View/chequesDetails";
import OverDueReceivableChequeDetailsView from "./View/overDueReceivableChequeDetails";
import ProtectedLayout from "@/core/layouts/ProtectedLayout";

export const ChequesRoutes: RouteObject[] = [
    {
        path: "/cheques",
        Component: ProtectedLayout,
        children: [
            {
                path: "/cheques/payable-cheques",
                Component: ChequesView,
            },
            {
                path: "/cheques/receivable-cheques",
                Component: ChequesView,
            },
            {
                path: "/cheques/receivable-cheques/details",
                Component: ChequesDetailsView,
            },
            {
                path: "/cheques/payable-cheques/details",
                Component: ChequesDetailsView,
            },
            {
                path: "/cheques/OverDueReceivableCheques",
                Component: OverDueReceivableChequeDetailsView,
            },
        ],
    },
];
