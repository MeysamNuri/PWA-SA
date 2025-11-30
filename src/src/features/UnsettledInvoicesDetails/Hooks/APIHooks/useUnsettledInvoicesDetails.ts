import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel';
import type { UnsettledInvoicesDataDetails } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';

const getUnsettledInvoicesDetails = async (daysType: string = 'Last7Days') => {
    const { data } = await axiosInstance.get<IResponse<UnsettledInvoicesDataDetails[]>>(
        `SalesRevenue/GetUnsettledInvoicesDetails?daysType=${daysType}`
    );
    return data;
};

export default function useUnsettledInvoicesDetails(daysType: string = 'Last7Days') {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['getUnsettledInvoicesDetails', daysType],
        queryFn: () => getUnsettledInvoicesDetails(daysType),
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
        error
    };
}
