import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axiosInstance from '@/core/constant/axios';
import type { IResponse, ApiError } from '@/core/types/responseModel';
import type { IUserPersonalityPayload } from '../../types';
import { getTranslation } from '@/core/helper/translationUtility';

type IUserPersonalityResponse = { personalityId: string } | null;

const addPersonality = async (payload: IUserPersonalityPayload) => {
    const { data } = await axiosInstance.post<IResponse<IUserPersonalityResponse>>(
        '/Personality/AddPersonlityUser',
        payload
    );
    return data;
};

export default function useAddPersonality() {
    const queryClient = useQueryClient();
    
    const {
        mutate: handleAddPersonality,
        isPending,
        isSuccess,
        status,
        data: responseData,
        error: mutationError,
    } = useMutation<IResponse<IUserPersonalityResponse>, ApiError, IUserPersonalityPayload>({
        mutationFn: addPersonality,
        onSuccess: (data, variables) => {
            
            if (!data.Status) {
                data.Message?.forEach((item) => toast.error(getTranslation(item)));
                return;
            }


            const personalityId = data.Data && 'personalityId' in data.Data ? data.Data.personalityId : null;

            localStorage.setItem('userPersonalityType', variables.userType);
            localStorage.setItem('personalitySelectedAt', new Date().toISOString());
            if (personalityId) {
                localStorage.setItem('userPersonalityId', personalityId);
            }
            
            // Force complete cache refresh
            queryClient.invalidateQueries({ queryKey: ['userPersonality'] });
            queryClient.removeQueries({ queryKey: ['userPersonality'] });
            
            // Also invalidate any related queries
            queryClient.invalidateQueries({ queryKey: ['userPersonality'] });
            
            toast.success('شخصیت شما با موفقیت انتخاب شد');
        },
        onError: () => {
        
            toast.error('خطا در انتخاب شخصیت. لطفاً دوباره تلاش کنید.');
        },
    });

    return { handleAddPersonality, isPending, isSuccess, responseData, status, error: mutationError };
}