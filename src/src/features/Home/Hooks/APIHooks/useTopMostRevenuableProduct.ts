import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { ITopRevenuableProduct } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const TopRevenableProducts = async (daysType: string) => {
    const response = await axiosInstance.get<IResponse<ITopRevenuableProduct>>(`/SoldProducts/GetTopNMostRevenuableProducts?daysType=${daysType}&topN=10`);
    return response.data;
};

export default function useTopMostRevenuableProduct(daysType: string) {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['TopRevenableProducts', daysType],
        queryFn: () => TopRevenableProducts(daysType),
        refetchInterval: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (!data?.Status) {
            data?.Message?.map((item) => {
                toast.error(getTranslation(item),{
                    toastId:item
                })
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
