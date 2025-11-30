import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { IGetFundBalanceDetailsResponse } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const fundBalance = async () => {
    const { data } = await axiosInstance.get<IResponse<IGetFundBalanceDetailsResponse>>(`/AvailableFunds/GetFundBalance`);
    return data;
};

export default function useGetFundBalance() {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['fundBalance'],
        queryFn: () => fundBalance(),
        enabled: true,
        refetchInterval: 5 * 60 * 1000,
    });
    useEffect(() => {
        if (!data?.Status) {
            data?.Message?.map((item) => {
                toast.error(getTranslation(item))
            })
        }
    }, [data])
    const fundBalanceData = data?.Data
    return {
        fundBalanceData,
        isPending,
        isError,
        error
    };
}
