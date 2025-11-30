import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { ExchangeRateItem } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const CurrencyRatesChart = async () => {
    const response = await axiosInstance.get<IResponse<ExchangeRateItem[]>>(`/ExchangeRateData/GetExchangeRate`);
    return response.data;
};

export default function useCurrencyRates() {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['CurrencyRatesChart'],
        queryFn: () => CurrencyRatesChart(),
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
