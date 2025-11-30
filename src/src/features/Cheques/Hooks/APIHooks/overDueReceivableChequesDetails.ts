import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { IOverDueReceivableRes } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const overDueReceivableChequesDetail = async () => {
    const { data } = await axiosInstance.get<IResponse<IOverDueReceivableRes>>(`/Cheque/GetOverDueReceivableChequesDetails`);
    return data;
};

export default function useOverDueReceivableChequesDetails() {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['nearDueChequesSubTotal'],
        queryFn:overDueReceivableChequesDetail,
        enabled: true
    });
    useEffect(() => {
        if (!data?.Status) {
            data?.Message?.map((item) => {
                toast.error(getTranslation(item))
            })
        }
    }, [data])
    const overDueReceivableChequesData = data?.Data
    return {
        overDueReceivableChequesData,
        isPending,
        isError,
        error
    };
}
