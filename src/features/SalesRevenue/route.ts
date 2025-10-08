import ProtectedRoute from '@/core/components/ProtectedRoute';
import type { RouteObject } from 'react-router';
import SalesRevenueView from './Views/index';

export const SalesRevenueRoutes: RouteObject[] = [
    {
        path: "/salesrevenue",
        Component: ProtectedRoute,
        children: [
            {
                path: "",
                Component: SalesRevenueView,
            },
        ],
    },
];
