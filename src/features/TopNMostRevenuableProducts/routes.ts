import ProtectedRoute from '@/core/components/ProtectedRoute';
import type { RouteObject } from 'react-router';
import TopNMostRevenuableProductsView from './Views';

export const TopNMostRevenuableProductsRoutes: RouteObject[] = [
    {
        path: "/topRevenuableProducts",
        Component: ProtectedRoute,
        children: [
            {
                path: "",
                Component: TopNMostRevenuableProductsView,
            },
        ],
    },
];
