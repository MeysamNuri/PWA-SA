import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { IBankBalanceResponse } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const bankBalance = async () => {
    const { data } = await axiosInstance.get<IResponse<IBankBalanceResponse>>(`/AvailableFunds/GetBankBalance`);
    return data;
};

export default function useGetBankBalance() {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['bankBalance'],
        queryFn: () => bankBalance(),
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
    const bankBalanceData = data?.Data
    return {
        bankBalanceData,
        isPending,
        isError,
        error
    };
}
