import ProtectedRoute from '@/core/components/ProtectedRoute';
import type { RouteObject } from 'react-router';
import TopNMostSoldProductsView from './Views';

export const TopNMostSoldProductsRoutes: RouteObject[] = [
    {
        path: "/topSellingProducts",
        Component: ProtectedRoute,
        children: [
            {
                path: "",
                Component: TopNMostSoldProductsView,
            },
        ],
    },
];
