import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse, ApiError } from '@/core/models/responseModel'
import { getTranslation } from '@/core/helper/translationUtility';
import { toast } from 'react-toastify';

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
        onSuccess: (data) => {
            if (!data.Status) {
                data.Message?.map((item)=>{
                    toast.error(getTranslation(item))
                })
            } else{
                toast.success("درخواست با موفقیت انجام شد")
            }

        },
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
