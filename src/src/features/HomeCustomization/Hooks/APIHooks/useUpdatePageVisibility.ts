import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse, ApiError } from '@/core/types/responseModel';
import { toast } from 'react-toastify';
import type { UpdateDisplaySettingRequest } from '../../types';

const updateDisplaySetting = async (payload: UpdateDisplaySettingRequest) => {

    
    const { data } = await axiosInstance.post<IResponse<any>>(
        '/UserAuth/DisplaySetting',
        payload
    );

    return data;
};

export const useUpdateDisplaySetting = () => {
    return useMutation<IResponse<any>, ApiError, UpdateDisplaySettingRequest>({
        mutationFn: updateDisplaySetting,
        onSuccess: (data) => {

            
            if (!data.Status) {
                if (data.Message) {
                    data.Message.forEach((item) => toast.error(item));
                }
                return;
            }
            
            toast.success('تنظیمات صفحه با موفقیت ذخیره شد');
        },
        onError: (error) => {
            console.error('Display setting update error:', error);
            toast.error('خطا در ذخیره تنظیما ت. لطفاً دوباره تلاش کنید.');
        }
    });
};
