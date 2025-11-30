import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { IBanksChequeDetails } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const nearDueChequesDetails = async (directionType: string, daysType: string,bankAccountNumber?:string, bankCode?:string) => {
    const params = new URLSearchParams();
    params.append('directionType', directionType);
    params.append('daysType', daysType);
    if (bankAccountNumber) {
        params.append('bankAccountNumber', bankAccountNumber);
    }
    if (bankCode) {
        params.append('bankCode', bankCode);
    }

    const { data } = await axiosInstance.get<IResponse<IBanksChequeDetails>>(`/Cheque/GetNearDueChequesDetail?${params.toString()}`);
    return data;
};

export default function useNearDueChequesDetailHook(directionType: string, daysType: string,bankAccountNumber?:string,bankCode?:string) {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['nearDueChequesDetail', directionType, daysType,bankAccountNumber,bankCode],
        queryFn: () => nearDueChequesDetails(directionType, daysType,bankAccountNumber,bankCode),
        enabled: true
    });

    useEffect(() => {
        if (!data?.Status) {
            data?.Message?.map((item) => {
                toast.error(getTranslation(item))
            })
        }
    }, [data])
    const nearDueChequesDetailsData = data?.Data
    return {
        nearDueChequesDetailsData,
        isPending,
        isError,
        error
    };
}
