import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse, ApiError } from '@/core/types/responseModel'
import type { INotificationResponse } from '../../types';
import { getTranslation } from '@/core/helper/translationUtility';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const notificationLogs = async (isRead?: boolean, pageNumber?: number, itemsPerPage?: number) => {
    const params = new URLSearchParams();
    if (isRead !==undefined) {
        params.append('isRead', isRead.toString());
    }
    if (pageNumber) {
        params.append('pageNumber', pageNumber.toString());
    }
    if (itemsPerPage) {
        params.append('itemsPerPage', itemsPerPage.toString());
    }
    const { data } = await axiosInstance.get<IResponse<INotificationResponse>>(`/Notification/GetNotificationLogs?${params.toString()}`);
    return data;
};

export default function useNotificationsLogAPIHook(isRead?:boolean,pageNumber?: number, itemsPerPage?: number) {
    const {
        isPending,
        isSuccess,
        status,
        data,
        refetch
    } = useQuery<IResponse<INotificationResponse>, ApiError>({
        queryKey: ['notificationLog',isRead, pageNumber, itemsPerPage],
        queryFn: () => notificationLogs(isRead,pageNumber, itemsPerPage),
        enabled: true
    });

    useEffect(() => {
        if (!data?.Status) {
            data?.Message?.map((item) => {
                toast.error(getTranslation(item), {
                    toastId: item
                })
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
