import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { IChequesNearDueSubTotal } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const nearDueChequesSubTotal = async (directionType: string, daysType: string) => {
    const { data } = await axiosInstance.get<IResponse<IChequesNearDueSubTotal>>(`/Cheque/GetNearDueChequesSubTotal?directionType=${directionType}&daysType=${daysType}`);
    return data;
};

export default function useNearDueChequesSubTotalHook(directionType: string, daysType: string) {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['nearDueChequesSubTotal', directionType, daysType],
        queryFn: () => nearDueChequesSubTotal(directionType, daysType),
        enabled: true
    });

    useEffect(() => {
        if (!data?.Status) {
            data?.Message?.map((item) => {
                toast.error(getTranslation(item))
            })
        }
    }, [data])
    const nearDueChequesSubTotalData = data?.Data
    return {
        nearDueChequesSubTotalData,
        isPending,
        isError,
        error
    };
}
