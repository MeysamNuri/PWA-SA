import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse, ApiError } from '@/core/types/responseModel'

const updateNotificationLog = async (ids: string) => {
    const { data } = await axiosInstance.post<IResponse<[]>>(`/Notification/UpdateNotificationLog?ids=${ids}`);
    return data;
};

export default function useUpdateNotificationLogHooks() {

    const {
        mutate: handleUpdateNotice,
        isPending,
        isSuccess,
        status,
        data: responseData,

    } = useMutation<IResponse<[]>, ApiError, string>({
        mutationFn: updateNotificationLog,
        onSettled: () => {

        },
    });
    return {
        handleUpdateNotice,
        isPending,
        isSuccess,
        responseData,
        status
    }
}
