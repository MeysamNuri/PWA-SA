import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/constant/axios';
import type { IResponse } from '@/core/types/responseModel';
import type { OutOfStockProductResponse } from '../../types';
import { toast } from 'react-toastify';
import { getTranslation } from '@/core/helper/translationUtility';

const getGetInSaleOutOfStockProducts = async () => {
    const { data } = await axiosInstance.get<IResponse<OutOfStockProductResponse[]>>(`SoldProducts/GetInSaleOutOfStockProducts`);
    return data;
};

export default function useGetInSaleOutOfStockProducts() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['getInSaleOutOfStockProducts'],
        queryFn: () => getGetInSaleOutOfStockProducts(),
    });

    if (!data?.Status) {
        data?.Message?.map((item) => {
            toast.error(getTranslation(item));
        });
    }

    return {
        data,
        isPending,
        isError,
        error,
    };
}
