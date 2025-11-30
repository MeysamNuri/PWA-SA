import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse, ApiError } from '@/core/types/responseModel';
import type { ILoginByotpPayload, ILoginByotpRes } from '../../types';
import { getTranslation } from '@/core/helper/translationUtility';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const loginByOTP = async (payload: ILoginByotpPayload) => {
  const { data } = await axiosInstance.post<IResponse<ILoginByotpRes>>(
    '/UserAuth/LoginByOtp',
    payload
  );
  return data;
};

export default function useLoginByOTPHooks() {
  const navigate = useNavigate();

  // Use mutateAsync for testable async behavior
  const mutation = useMutation<IResponse<ILoginByotpRes>, ApiError, ILoginByotpPayload>({
    mutationFn: loginByOTP,
    onSuccess: (data) => {
      if (!data?.Status) {
        toast.error(getTranslation(data.Message[0]));
      } else {
        if (data?.Data?.token) localStorage.setItem('authToken', data.Data.token);
        navigate('/home', { state: { firstLogin: data?.Data?.firstLogin } });
      }
    },
  });

  return {
    handleLoginByOTP: mutation.mutateAsync, // <-- returns a promise
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    responseData: mutation.data,
    status: mutation.status,
  };
}
