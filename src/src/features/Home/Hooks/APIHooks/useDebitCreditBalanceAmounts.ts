import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { DebitCreditBalanceData } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const debitCreditBalanceData = async () => {
    const { data } = await axiosInstance.get<IResponse<DebitCreditBalanceData>>('/AccountingReports/GetDebitCreditBalanceAmounts');
    return data;
};

export default function useDebitCreditBalanceAmountsHooks() {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['debitCreditBalanceData'],
        queryFn: debitCreditBalanceData,
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
