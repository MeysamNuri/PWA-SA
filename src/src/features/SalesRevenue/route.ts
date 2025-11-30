
import type { RouteObject } from 'react-router';
import SalesRevenueView from './Views/index';
import ProtectedLayout from '@/core/layouts/ProtectedLayout';

export const SalesRevenueRoutes: RouteObject[] = [
    {
        path: "/salesrevenue",
        Component: ProtectedLayout,
        children: [
            {
                path: "",
                Component: SalesRevenueView,
            },
        ],
    },
];
