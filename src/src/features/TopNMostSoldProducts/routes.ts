
import type { RouteObject } from 'react-router';
import TopNMostSoldProductsView from './Views';
import ProtectedLayout from '@/core/layouts/ProtectedLayout';

export const TopNMostSoldProductsRoutes: RouteObject[] = [
    {
        path: "/topSellingProducts",
        Component: ProtectedLayout,
        children: [
            {
                path: "",
                Component: TopNMostSoldProductsView,
            },
        ],
    },
];
