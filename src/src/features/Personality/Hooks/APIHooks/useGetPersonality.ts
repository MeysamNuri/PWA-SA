import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { IPersonality } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';
import { getUserIdFromToken } from '@/core/helper/jwtUtility';

const getPersonality = async (userId: string) => {
    const { data } = await axiosInstance.get<IResponse<IPersonality>>(`/Personality/GetPersonality?userId=${userId}`);
    return data;
};

export default function useGetUserPersonality() {
    // Get userId from JWT token
    const userId = getUserIdFromToken();

    const { isPending, isError, data, error, refetch } = useQuery({
        queryKey: ['userGetPersonality',userId],
        queryFn: () => getPersonality(userId!),
        enabled: !!userId,
    });

    useEffect(() => {
        if (data && !data?.Status) {
            data?.Message?.forEach((item: string) => {
                toast.error(getTranslation(item))
            })
        }
    }, [data])

    const userPersonality = data?.Data
    return {
        userPersonality,
        isPending,
        isError,
        error,
        userId,
        refetch
    };
}