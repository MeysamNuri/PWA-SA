import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/models/responseModel'
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
