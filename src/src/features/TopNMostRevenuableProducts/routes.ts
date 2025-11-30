
import type { RouteObject } from 'react-router';
import TopNMostRevenuableProductsView from './Views';
import ProtectedLayout from '@/core/layouts/ProtectedLayout';

export const TopNMostRevenuableProductsRoutes: RouteObject[] = [
    {
        path: "/topRevenuableProducts",
        Component: ProtectedLayout,
        children: [
            {
                path: "",
                Component: TopNMostRevenuableProductsView,
            },
        ],
    },
];
