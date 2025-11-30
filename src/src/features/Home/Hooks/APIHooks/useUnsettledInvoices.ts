import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { UnsettledInvoicesData } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const unsettledInvoicesResult = async () => {
    const { data } = await axiosInstance.get<IResponse<UnsettledInvoicesData>>('/SalesRevenue/GetUnsettledInvoices');
    return data;
};

export default function useUnsettledInvoices() {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['unsettledInvoicesResult'],
        queryFn: unsettledInvoicesResult,
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
