import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { NearDueChequesData } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const nearDueChequesData = async (daysType:string) => {
    const { data } = await axiosInstance.get<IResponse<NearDueChequesData>>(`/Cheque/GetNearDueChequesTotal?daysType=${daysType}`);
    return data;
};

export default function useNearDueCheques(daysType: string ) {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['nearDueChequesData', daysType],
        queryFn: () => nearDueChequesData(daysType),
        enabled:true,
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
