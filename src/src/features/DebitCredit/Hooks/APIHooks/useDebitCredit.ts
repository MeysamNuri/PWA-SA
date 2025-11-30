import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel';
import type { DebitCreditBalanceAmountsItems } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';

const getDebitCreditTotals = async () => {
    const { data } = await axiosInstance.get<IResponse<DebitCreditBalanceAmountsItems>>('/AccountingReports/GetDebitCreditBalanceAmounts');
    return data;
};

export default function useDebitCreditTotals() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['debitCreditTotals'],
        queryFn: getDebitCreditTotals,
    });

    if (!data?.Status) {
        data?.Message?.map((item) => {
            toast.error(getTranslation(item));
        });
    }

    return {
        data,
        isPending,
        isError,
        error,
    };
}
