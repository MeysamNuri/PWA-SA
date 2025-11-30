import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel';
import type { GetTopNDebtorsItems } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';

const getTopNDebtors = async () => {
    const { data } = await axiosInstance.get<IResponse<GetTopNDebtorsItems>>('/AccountingReports/GetTopNDebtors');
    return data;
};

export default function useTopNDebtors() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['TopNDebtors'],
        queryFn: getTopNDebtors,
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