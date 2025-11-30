import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel';
import type { ILoginByotpRes } from '../../types';
import { getTranslation } from '@/core/helper/translationUtility';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router'

const fetchLoginPassword = async ({ phoneNumber, password }: { phoneNumber: string; password: string }) => {
    const { data } = await axiosInstance.get<IResponse<ILoginByotpRes>>('/UserAuth/login', {
        params: { phoneNumber, password },
    });
    return data;
};

export default function useLoginPasswordHooks(

) {
    const navigate = useNavigate()
    const { data, mutate, isPending } = useMutation({
        mutationFn: fetchLoginPassword,
        onSuccess: (data) => {
            if (!data.Status) {
                data.Message?.map((item) => {
                    toast.error(getTranslation(item))
                })

            } else {
                localStorage.setItem('authToken', data.Data.token);
                navigate("/home")
            }

        },
        onError: () => {
            toast.error("مشکلی از سمت سرور رخ داده است")
        }
    });
    return {
        data,
        mutate,
        isPending
    }
}
