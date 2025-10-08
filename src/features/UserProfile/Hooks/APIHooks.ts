import axiosInstance from '@/core/constant/axios';
import { useQuery } from '@tanstack/react-query';
import type { IResponse, ApiError } from '@/core/models/responseModel'
import type { IUserProfileDataRes } from '../types';
import { getTranslation } from '@/core/helper/translationUtility';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
// import {useNavigate} from 'react-router'

const userProfile = async () => {
    const { data } = await axiosInstance.get<IResponse<IUserProfileDataRes>>('/UserAuth/GetUserProfile');
    return data;
};

export default function useUserProfile() {
    const {
        isPending,
        isSuccess,
        status,
        data,

    } = useQuery<IResponse<IUserProfileDataRes>, ApiError>({
        queryKey: ['userProfile'],
        queryFn: userProfile,
    });
      useEffect(() => {
          if (!data?.Status) {
              data?.Message?.map((item) => {
                  toast.error(getTranslation(item))
              })
          }
      }, [data])
    const userProfileData = data?.Data
    return {
        userProfileData,
        isPending,
        isSuccess,
        status
    }
}
