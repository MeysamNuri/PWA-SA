import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/models/responseModel';
import type { salesRevenueApi } from '../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';


const getSalesRevenueReport = async (daysType: string) => {
    const { data } = await axiosInstance.get<IResponse<salesRevenueApi>>(`SalesRevenue/GetSalesRevenueReport?daysType=${daysType}`);
    return data;
};

export default function useSalesRevenue(daysType: string) {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['salesRevenueReport', daysType],
        queryFn: () => getSalesRevenueReport(daysType),
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
        error,
    };
}
