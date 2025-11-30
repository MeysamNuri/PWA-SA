import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel';
import type { DisplaySettingItem } from '../../types';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';

 
interface GetDisplaySettingResponse {
    displaySetting: DisplaySettingItem[];
}

export const useGetDisplaySetting = () => {
    const { isPending, isError, data, error }= useQuery<IResponse<GetDisplaySettingResponse>>({
        queryKey: ['getDisplaySetting'],
        queryFn: async () => {
            const response = await axiosInstance.get('/UserAuth/GetDisplaySetting');
            return response.data;
        },
        staleTime: 0, 
        gcTime: 10 * 60 * 1000, 
    });
    
    
    useEffect(() => {
        if (!data?.Status) {
            data?.Message?.map((item) => {
                toast.error(getTranslation(item),{
                    toastId:item
                })
            })
        }
    }, [data])
    return {
        data,
        isPending,
        isError,
        error
    };
};