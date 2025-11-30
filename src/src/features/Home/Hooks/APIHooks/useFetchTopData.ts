import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

interface FetchTopDataOptions<T> {
    queryKey: string[];
    apiPath: (daysType: string) => string;
    selector: (data: any) => T;
    daysType: string;
}

export default function useFetchTopData<T>({ queryKey, apiPath, selector, daysType }: FetchTopDataOptions<T>) {
    const fetchData = async () => {
        const { data } = await axiosInstance.get<IResponse<any>>(apiPath(daysType));
        return data;
    };

    const { isPending, isError, data, error } = useQuery({
        queryKey: queryKey,
        queryFn: fetchData,
        enabled: true,
        refetchInterval: 5 * 60 * 1000, 
    });

    useEffect(() => {
        if (!data?.Status) {
            data?.Message?.map((item) => {
                toast.error(getTranslation(item))
            })
        }
    }, [data])

    const selectedData = data?.Data ? selector(data.Data) : undefined;

    return {
        data: selectedData,
        isPending,
        isError,
        error
    };
}
