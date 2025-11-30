import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse,ApiError } from '@/core/types/responseModel'
import type { ISendOtpPayload, ISendOtpResponse } from '../../types';
import { getTranslation } from '@/core/helper/translationUtility';
import { toast } from 'react-toastify';
// import {useNavigate} from 'react-router'

const sendOtpCode = async (payload: ISendOtpPayload) => {
    const { data } = await axiosInstance.post<IResponse<ISendOtpResponse>>(
        "/UserAuth/SendOtpCode",
        payload,
    );
    return data;
};

export default function useSendOTPHooks() {

    const {
        mutate,
        isPending,
        isSuccess,
        status,
        data: responseData,
    } = useMutation<IResponse<ISendOtpResponse>, ApiError, ISendOtpPayload>({
        mutationFn: sendOtpCode, // The function that performs the API call
        onSuccess: (data) => {
            if (!data.Status) {
                toast.error(getTranslation(data.Message[0]));
            } else {
                toast.success("کد تأیید با موفقیت ارسال شد");

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
