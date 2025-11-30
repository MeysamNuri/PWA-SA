import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse, ApiError } from '@/core/types/responseModel'
import { getTranslation } from '@/core/helper/translationUtility';
import { toast } from 'react-toastify';

const sendFirebaseToken = async (payload: string) => {
    const { data } = await axiosInstance.post<IResponse<string>>(
        "/FirebaseNotification/SendFirebaseToken",
        { fCMToken: payload }
    );
    return data;
};

export default function useSendFCMToken() {

    const {
        mutate,
        isPending,
        isSuccess,
        status,
        data: responseData,
    } = useMutation<IResponse<string>, ApiError, string>({
        mutationFn: sendFirebaseToken, // The function that performs the API call
        onSuccess: (data) => {
            if (!data.Status) {
                data.Message?.map((item) => {
                    toast.error(getTranslation(item), {
                        toastId: item
                    })
                })
            }
        },
    });
    return {
        mutate,
        isPending,
        isSuccess,
        responseData,
        status,
    };
}








