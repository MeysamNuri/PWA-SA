import useDebitCreditBalanceAmounts from './APIHooks/useDebitCreditBalanceAmounts';
import {
    useMemo,

} from 'react';
import useSalesRevenue from './APIHooks/useSalesRevenue';
import type { SalesRevenueTransformedItem } from '../types';
import useNearDueCheques from './APIHooks/useNearDueCheques';
import useCurrencyRates from './APIHooks/useCurrencyRates';
import useGetAvailableFunds from '@/features/AvailableFunds/Hooks/APIHooks/getAvailableFunds';
import { useNavigate } from 'react-router';
import type { ExchangeRateItem } from '../types';
import { DateFilterType } from '@/core/types/dateFilterTypes';


function useCurrencyTableData() {
    const { data, isPending } = useCurrencyRates();
    const items = data?.Data ?? [];
    let rates: ExchangeRateItem[] = Array.isArray(items)
        ? items as ExchangeRateItem[]
        : ((items as { exchangeRateItem?: ExchangeRateItem[] })?.exchangeRateItem ?? []);
    rates = rates.filter((f) =>
        ['UsdDollar', 'SekeEmaami', 'GoldGram18'].includes(f.name),
    );
    const tableData = rates.map((item) => ({
        name: item.name,
        title: item.title,
        price: Math.round(Number(item.price) / 10).toLocaleString('fa-IR'),
        time: formatTime(item.sourceCreated),
        rateOfChange: Number(item.rateOfChange),
    }));
    return { currencyTableData: tableData, currencyLoading: isPending };
}

function formatTime(date: Date | string) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return `${dateObj.getHours()}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
}

export default function useHomeHooks() {
    const routeNavigate = useNavigate();
    const { data: debitCreditBalanceData } = useDebitCreditBalanceAmounts();
    const { availableFundsData } = useGetAvailableFunds();
    const { data: nearDueChequesData } = useNearDueCheques('Next30DaysDate');
    const { data: salesRevenueData } = useSalesRevenue();


    const { currencyTableData, currencyLoading } = useCurrencyTableData();
    const handleCurrencyRatesClick = () => {
        routeNavigate('/currencyRates');
    };
    const saleAmount = useMemo(() => {
        const data = salesRevenueData?.Data as
            | SalesRevenueTransformedItem[]
            | undefined;
        const today = data?.find((item) => item.dateType === 'TodayDate');
        return [
            {
                title: 'فروش امروز',
                value: today?.formattedSalesAmount ?? '_',
                unit: today?.salesAmountUOM ?? '',
                salesChangePercent: today?.salesChangePercent ?? undefined,
                salesType: today?.salesType ?? undefined,
                icon: '/images/Homepageicons/salesRevenue.png',
                path: '/salesrevenue',
                dateType: DateFilterType.Today
            },

            {
                title: 'فروش دیروز',
                value:
                    data?.find((item) => item.dateType === 'YesterdayDate')
                        ?.formattedSalesAmount ?? '_',
                unit:
                    data?.find((item) => item.dateType === 'YesterdayDate')
                        ?.salesAmountUOM ?? '',
                salesChangePercent:
                    data?.find((item) => item.dateType === 'YesterdayDate')
                        ?.salesChangePercent ?? undefined,
                salesType:
                    data?.find((item) => item.dateType === 'YesterdayDate')
                        ?.salesType ?? undefined,
                icon: '/images/Homepageicons/salesRevenue.png',
                path: '/salesrevenue',
                dateType: DateFilterType.Yesterday
            },

        ];
    }, [salesRevenueData]);

    const debitCredit = useMemo(() => {
        const data = debitCreditBalanceData?.Data;
        return [
            {
                title: 'بستانکاران',
                value: data?.formattedTotalCreditAmount?.toString() || '_',
                unit: data?.totalCreditAmountUOM || '',
                icon: '/images/Homepageicons/creditbalanceamounts.png.png',
                path: '/debitcredit'
            },
            {
                title: 'بدهکاران',
                value: data?.formattedTotalDebitAmount?.toString() || '_',
                unit: data?.totalDebitAmountUOM || '',
                icon: '/images/Homepageicons/debitbalanceamounts.png',
                path: '/debitcredit'
            },
        ];
    }, [debitCreditBalanceData]);

    const nearDueCheques = useMemo(() => {
        const data = nearDueChequesData?.Data;
        return [
            {
                title: 'چک‌های پرداختی',
                value: data?.formattedPayableChequesAmount?.toString() || '_',
                unit: data?.payableChequesAmountUOM || '',
                icon: '/images/Homepageicons/payablecheques.png',
                path: '/cheques/payable-cheques'
            },
            {
                title: 'چک‌های دریافتی',
                value:
                    data?.formattedReceivableChequesAmount?.toString() || '_',
                unit: data?.receivableChequesAmountUOM || '',
                icon: '/images/Homepageicons/receivablecheques.png',
                path: '/cheques/receivable-cheques'
            },
        ];
    }, [nearDueChequesData]);

    const availableFundsDataList = useMemo(() => {
        const data = availableFundsData;
        const fundData = data?.availableFundsReportResponseDtos?.[0];
        return [
            {
                title: 'مانده صندوق',
                value:
                    fundData?.formattedFundBalance != null &&
                        fundData?.formattedFundBalance !== ''
                        ? fundData.formattedFundBalance.toString()
                        : '_',
                unit: fundData?.fundBalanceUOM ?? '',
                icon: '/images/Homepageicons/fundbalance.png',
                path: '/AvailableFunds'
            },
            {
                title: 'مانده بانک',
                value: fundData?.formattedBankBalance?.toString() ?? '_',
                unit: fundData?.bankBalanceUOM ?? '',
                icon: '/images/Homepageicons/bankbalance.png',
                path: '/AvailableFunds'
            },
        ];
    }, [availableFundsData]);

    const cardsData = [
        ...(saleAmount ?? []),
        ...(availableFundsDataList ?? []),
        ...(debitCredit ?? []),
        ...(nearDueCheques ?? []),
    ];

    return {
        saleAmount,
        debitCredit,
        availableFundsData,
        nearDueCheques,
        currencyTableData,
        currencyLoading,
        cardsData,
        handleCurrencyRatesClick
    };
}

