import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel';
import type { TopRevenuableProductApi } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const fetchTopNMostRevenuableProducts = async (daysType: string) => {
    const { data } = await axiosInstance.get<IResponse<TopRevenuableProductApi>>(
        `/SoldProducts/GetTopNMostRevenuableProducts?daysType=${daysType}&topN=10`
    );
    return data;
};

export const useTopNMostRevenuableProducts = (daysType: string) => {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['getTopNMostRevenuableProducts', daysType],
        queryFn: () => fetchTopNMostRevenuableProducts(daysType),
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
}; 