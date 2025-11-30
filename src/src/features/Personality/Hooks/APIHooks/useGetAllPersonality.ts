import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { IPersonality } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const getAllPersonality = async () => {
    const { data } = await axiosInstance.get<IResponse<IPersonality[]>>(`/Personality/GetAllPersonalitySync`);
    return data;
};

export default function useGetAllPersonality() {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['personalities'],
        queryFn: getAllPersonality,
        enabled: true
    });
    
    useEffect(() => {
        if (data && !data?.Status) {
            data?.Message?.map((item) => {
                toast.error(getTranslation(item))
            })
        }
    }, [data])
    
    const personalitiesData = data?.Data
    return {
        personalitiesData,
        isPending,
        isError,
        error
    };
}