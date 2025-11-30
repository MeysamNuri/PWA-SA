import type { ITopCustomersByPurchaseRes } from '../../types';
import useFetchTopData from './useFetchTopData';

export default function useTopCustomersByPurchaseHook(daysType: string) {
    const { data: topCustomersByPurchaseData, isPending, isError, error } = useFetchTopData<ITopCustomersByPurchaseRes[]>({
        queryKey: ['topCustomersByPurchase', daysType],
        apiPath: (daysType) => `/SalesBySeller/GetTopNCustomersByPurchaseVolume?daysType=${daysType}`,
        selector: (data) => data,
        daysType: daysType,
    });

    return {
        topCustomersByPurchaseData,
        isPending,
        isError,
        error
    };
}
