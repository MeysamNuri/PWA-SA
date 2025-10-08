import ProtectedRoute from '@/core/components/ProtectedRoute';
import type { RouteObject } from 'react-router';
import DebitCreditView from './Views';

export const DebitCreditRoutes: RouteObject[] = [
    {
        path: "/debitcredit",
        Component: ProtectedRoute,
        children: [
            {
                path: "",
                Component: DebitCreditView,
            },
        ],
    },
];
