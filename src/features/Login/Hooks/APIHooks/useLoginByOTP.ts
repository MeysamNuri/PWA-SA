import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse, ApiError } from '@/core/models/responseModel'
import type { ILoginByotpPayload, ILoginByotpRes } from '../../types';
import { getTranslation } from '@/core/helper/translationUtility';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router'

const loginByOTP = async (payload: ILoginByotpPayload) => {
    const { data } = await axiosInstance.post<IResponse<ILoginByotpRes>>('/UserAuth/LoginByOtp', payload);
    return data;
};

export default function useLoginByOTPHooks() {
    const navigate=useNavigate()

    const {
        mutate: handleLoginByOTP,
        isPending,
        isSuccess,
        status,
        data: responseData,

    } = useMutation<IResponse<ILoginByotpRes>, ApiError, ILoginByotpPayload>({
        mutationFn: loginByOTP,
        onSuccess: (data) => {
            if (!data?.Status) {
                toast.error(getTranslation(data.Message[0]))
            } else {
                toast.success("ورود انجام شد")
                localStorage.setItem('authToken', data?.Data?.token);
                navigate("/home")
            }

        },
    });
    return {
        handleLoginByOTP,
        isPending,
        isSuccess,
        responseData,
        status
    }
}
