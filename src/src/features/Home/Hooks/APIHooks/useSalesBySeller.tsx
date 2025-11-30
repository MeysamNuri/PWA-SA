import type { ISalesBySellerRes } from '../../types';
import useFetchTopData from './useFetchTopData';

export default function useGetSalesBySeller(daysType: string) {
    const { data: salesBySellerData, isPending, isError, error } = useFetchTopData<ISalesBySellerRes|null>({
        queryKey: ['getSalesBySeller', daysType],
        apiPath: (daysType) => `/SalesBySeller/GetSalesBySeller?lastNDaysType=${daysType}`,
        selector: (data) => data,
        daysType: daysType,
    });

    return {
        salesBySellerData,
        isPending,
        isError,
        error
    };
}
