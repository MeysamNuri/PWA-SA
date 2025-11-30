import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { GetPageNameResponse } from '../../types';

export const useGetPageName = () => {
    return useQuery<GetPageNameResponse>({
        queryKey: ['getPageName'],
        queryFn: async () => {
            const response = await axiosInstance.get('/UserAuth/GetPageName');
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};
