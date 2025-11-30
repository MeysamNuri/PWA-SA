import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { ITopSellingProducts } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const TopSellingProducts = async (daysType: string) => {
    const { data } = await axiosInstance.get<IResponse<ITopSellingProducts>>(`/SoldProducts/GetTopNMostSoldProductsReport?daysType=${daysType}&topN=10`);
    return data;
};

export default function useTopMostSoldProduct(daysType: string) {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['TopSellingProducts', daysType],
        queryFn: () => TopSellingProducts(daysType),
        refetchInterval: 5 * 60 * 1000, 
    });
    useEffect(() => {
        if (!data?.Status) {
            data?.Message?.map((item) => {
                toast.error(getTranslation(item), {
                    toastId: item
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