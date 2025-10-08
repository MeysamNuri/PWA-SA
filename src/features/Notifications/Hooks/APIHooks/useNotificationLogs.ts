import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse, ApiError } from '@/core/models/responseModel'
import type { INotificationResponse } from '../../types';
import { getTranslation } from '@/core/helper/translationUtility';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const useNotificationLogs = async () => {
    const { data } = await axiosInstance.get<IResponse<INotificationResponse[]>>('/Notification/GetNotificationLogs');
    return data;
};

export default function useNotificationsLogHook() {
    const {
        isPending,
        isSuccess,
        status,
        data,
        refetch
    } = useQuery<IResponse<INotificationResponse[]>, ApiError>({
        queryKey: ['notificationLog'],
        queryFn: useNotificationLogs,
    });

    useEffect(() => {
        if (!data?.Status) {
            data?.Message?.map((item) => {
                toast.error(getTranslation(item))
            })
        }
    }, [data])
    const notificationsData = data?.Data
    return {
        notificationsData,
        isPending,
        isSuccess,
        status,
        refetch

    }
}
