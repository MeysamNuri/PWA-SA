
import type { RouteObject } from 'react-router';
import GetInSaleOutOfStockProductsView from './Views';
import ProtectedLayout from '@/core/layouts/ProtectedLayout';


export const GetInSaleOutOfStockProductsRoutes: RouteObject[] = [
    {
        path: "/GetInSaleOutOfStockProductsView",
        Component: ProtectedLayout,
        children: [
            {
                path: "",
                Component: GetInSaleOutOfStockProductsView,
            },
        ],
    },
];


