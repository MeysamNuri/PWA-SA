import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { SalesRevenueTransformedItem } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const salesRevenueResult = async () => {
    const { data } = await axiosInstance.get<IResponse<SalesRevenueTransformedItem[]>>('/SalesRevenue/GetSalesRevenueDailyTotals');
    return data;
};

export default function useSalesRevenue() {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['salesRevenueResult'],
        queryFn: () => {
            console.log('🔄 Refreshing Sales Revenue data at:', new Date().toLocaleTimeString('fa-IR'));
            return salesRevenueResult();
        },
        refetchInterval: 5 * 60 * 1000, 
    });

   
       useEffect(() => {
           if (!data?.Status) {
               data?.Message?.map((item) => {
                   toast.error(getTranslation(item))
               })
           }
       }, [data])

    return {
        data,
        isPending,
        isError,
        error
    };
}
