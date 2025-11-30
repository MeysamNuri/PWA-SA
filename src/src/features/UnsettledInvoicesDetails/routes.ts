import type { RouteObject } from 'react-router';
import UnsettledInvoicesDetailsView from './Views/index';
import ProtectedLayout from '@/core/layouts/ProtectedLayout';

export const UnsettledInvoicesDetailsRoutes: RouteObject[] = [
    {
        path: "/UnsettledInvoicesDetailsView",
        Component: ProtectedLayout,
        children: [
            {
                path: "",
                Component: UnsettledInvoicesDetailsView,
            },
        ],

    },
];
