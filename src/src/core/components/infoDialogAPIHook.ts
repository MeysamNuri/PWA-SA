import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel'
import type { IInfoDialog } from '../types/dialogInfo';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';
import { useEffect } from 'react';

const getExecutionLog = async (commandName: string) => {
        const { data } = await axiosInstance.get<IResponse<IInfoDialog>>(`/SystemLogs/GetExecutionLog?commandName=${commandName}`);
        return data;
};

export default function useInfoDialogHook(commandName: string) {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['getExecutionLog', commandName],
        queryFn: () => getExecutionLog(commandName),
        enabled: !!commandName
    });

    useEffect(() => {
        if (!data?.Status) {
            data?.Message?.map((item) => {
                toast.error(getTranslation(item), {
                    toastId: item
                })
            })
        }
    }, [data])
    const infoDialogData = data?.Data
    return {
        infoDialogData,
        isPending,
        isError,
        error
    };
}
