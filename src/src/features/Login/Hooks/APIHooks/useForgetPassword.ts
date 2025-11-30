import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse, ApiError } from '@/core/types/responseModel'
import type { IChangePassword, ILoginByotpRes } from '../../types';
import { getTranslation } from '@/core/helper/translationUtility';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router'

const changePasswordByOTP = async (payload: IChangePassword) => {
    const { data } = await axiosInstance.post<IResponse<ILoginByotpRes>>('/UserAuth/ChangePasswordByOtp', payload);
    return data;
};

export default function useForgetPasswordHooks() {
    const navigate=useNavigate()

    const {
        mutate: handleChangePasswordByOTP,
        isPending,
        isSuccess,
        status,
        data: responseData,

    } = useMutation<IResponse<ILoginByotpRes>, ApiError, IChangePassword>({
        mutationFn: changePasswordByOTP,
        onSuccess: (data) => {
            if (!data.Status) {
                data.Message?.map((item)=>{
                    toast.error(getTranslation(item))
                })
            } else {
                toast.success("تغیرر رمز ورود انجام شد")
                localStorage.setItem('authToken', data.Data.token);
                navigate("/home")
            }

        },
    });
    return {
        handleChangePasswordByOTP,
        isPending,
        isSuccess,
        responseData,
        status
    }
}
