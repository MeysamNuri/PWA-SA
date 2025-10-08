import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/models/responseModel';
import type { DebtorCreditorItem } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';

const getTopNCreditors = async () => {
    const { data } = await axiosInstance.get<IResponse<DebtorCreditorItem>>('/AccountingReports/GetTopNCreditors');
    return data;
};

export default function useTopCreditors() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['TopNCreditors'],
        queryFn: getTopNCreditors,
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
