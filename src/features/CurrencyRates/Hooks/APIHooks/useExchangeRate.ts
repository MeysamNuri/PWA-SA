import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/models/responseModel';
import type { ExchangeRateItem } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';

const getExchangeRateItem = async () => {
    const { data } = await axiosInstance.get<IResponse<ExchangeRateItem[]>>(`/ExchangeRateData/GetExchangeRate`);
    return data;
};

export default function useExchangeRateData() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['getExchangeRate'],
        queryFn: () => getExchangeRateItem(),
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
