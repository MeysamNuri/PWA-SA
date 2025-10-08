import ProtectedRoute from '@/core/components/ProtectedRoute';
import type { RouteObject } from 'react-router';
import GetInSaleOutOfStockProductsView from './Views';


export const GetInSaleOutOfStockProductsRoutes: RouteObject[] = [
    {
        path: "/GetInSaleOutOfStockProductsView",
        Component: ProtectedRoute,
        children: [
            {
                path: "",
                Component: GetInSaleOutOfStockProductsView,
            },
        ],
    },
];


