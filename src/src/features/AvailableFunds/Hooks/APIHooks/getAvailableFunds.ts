import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { IAvailableFundsResponse } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const availableFunds = async () => {
    const { data } = await axiosInstance.get<IResponse<IAvailableFundsResponse>>(`/AvailableFunds/GetAvailableFunds`);
    return data;
};

export default function useGetAvailableFunds() {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['availableFunds'],
        queryFn: () => availableFunds(),
        enabled: true,
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

    const availableFundsData = data?.Data
    return {
        availableFundsData,
        isPending,
        isError,
        error
    };
}

