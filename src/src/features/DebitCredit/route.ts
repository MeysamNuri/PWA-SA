
import type { RouteObject } from 'react-router';
import DebitCreditView from './Views';
import ProtectedLayout from '@/core/layouts/ProtectedLayout';

export const DebitCreditRoutes: RouteObject[] = [
    {
        path: "/debitcredit",
        Component: ProtectedLayout,
        children: [
            {
                path: "",
                Component: DebitCreditView,
            },
        ],
    },
];
