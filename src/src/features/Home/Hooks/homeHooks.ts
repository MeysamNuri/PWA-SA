import useDebitCreditBalanceAmounts from './APIHooks/useDebitCreditBalanceAmounts';
import {
    useEffect,
    useMemo,
    useState,
} from 'react';
import useSalesRevenue from './APIHooks/useSalesRevenue';
import {
    type SalesRevenueTransformedItem, type ICurrencyData,
    introAppList
} from '../types';
import useNearDueCheques from './APIHooks/useNearDueCheques';
import useGetAvailableFunds from '@/features/AvailableFunds/Hooks/APIHooks/getAvailableFunds';
import {
    useNavigate,
    useLocation
} from 'react-router';

import { DateFilterType } from '@/core/types/dateFilterTypes';
import { useInfoModalStore } from '@/core/zustandStore';
import useUnsettledInvoices from './APIHooks/useUnsettledInvoices';
import { useThemeContext } from '@/core/context/useThemeContext';
import { getIconPath } from '@/core/components/icons';
import { useHomeCustomizationSettings } from '@/features/HomeCustomization/Hooks/useHomeCustomizationSettings';
import { CARD_TYPE_MAPPING } from '@/features/HomeCustomization/constants/componentMapping';
import type { HomeCustomizationItem } from '@/features/HomeCustomization/types';
import HomePageDefaultItems from './defaultPageItemsHook';
import introJs from 'intro.js'
import useCurrencyTableData from './currencyDataHooks';



export default function useHomeHooks() {
    const routeNavigate = useNavigate();
    const { state: locationState } = useLocation()
    const [open, setOpen] = useState(false);
    const { isDarkMode } = useThemeContext();
    const { isComponentEnabled } = useHomeCustomizationSettings();
    const { data: debitCreditBalanceData } = useDebitCreditBalanceAmounts();
    const { availableFundsData, isPending: availablefundsLoading } = useGetAvailableFunds();
    const { data: nearDueChequesData, isPending: nearChequesLoading } = useNearDueCheques('Next30DaysDate');
    const { data: salesRevenueData, isPending: salesRevenueLoading } = useSalesRevenue();
    const { data: unsettledInvoicesData, isPending: unsettledInvoicesLoading, isError: unsettledInvoicesError } = useUnsettledInvoices();
    const setInfoDetails = useInfoModalStore((state) => state.setInfoDetails)
    const { homeDefaultCustomeList, pageNameDataLoading } = HomePageDefaultItems()

    const { currencyTableData, currencyLoading } = useCurrencyTableData();
    const handleCurrencyRatesClick = (currencyData?: ICurrencyData) => {
        if (currencyData) {
            // Determine which tab to navigate to based on currency name
            const currencyName = currencyData.name;

            if (['UsdDollar', 'Euro', 'Gbp', 'Aed'].includes(currencyName)) {
                routeNavigate('/currencyRates/currency');
            } else if (['SekeEmaami', 'SekeBahar', 'SekeNim', 'SekeRob', 'SekeGrami'].includes(currencyName)) {
                routeNavigate('/currencyRates/coin');
            } else if (['Ons', 'GoldGram18', 'GoldGram18740', 'GoldGram24', 'GoldMesghal'].includes(currencyName)) {
                routeNavigate('/currencyRates/gold');
            } else {
                routeNavigate('/currencyRates');
            }
        } else {
            routeNavigate('/currencyRates');
        }
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
                icon: getIconPath('salesRevenue', isDarkMode),
                path: '/salesrevenue',
                dateType: DateFilterType.Today,
                name: "salesrevenue"
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
                icon: getIconPath('salesRevenue', isDarkMode),
                path: '/salesrevenue',
                dateType: DateFilterType.Yesterday,
                name: "salesrevenue"
            },

        ];
    }, [salesRevenueData, isDarkMode]);

    const debitCredit = useMemo(() => {
        const data = debitCreditBalanceData?.Data;
        return [
            {
                title: 'بستانکاران',
                value: data?.formattedTotalCreditAmount?.toString() || '',
                unit: data?.totalCreditAmountUOM || '',
                icon: getIconPath('creditbalanceamounts', isDarkMode),
                path: '/debitcredit',
                name: "debitcredit"
            },
            {
                title: 'بدهکاران',
                value: data?.formattedTotalDebitAmount?.toString() || '',
                unit: data?.totalDebitAmountUOM || '',
                icon: getIconPath('debitbalanceamounts', isDarkMode),
                path: '/debitcredit',
                name: "debitcredit"

            },
        ];
    }, [debitCreditBalanceData, isDarkMode]);

    const nearDueCheques = useMemo(() => {
        const data = nearDueChequesData?.Data;
        return [
            {
                title: 'چک‌های پرداختی',
                value: data?.formattedPayableChequesAmount?.toString() || '',
                unit: data?.payableChequesAmountUOM || '',
                icon: getIconPath('payablecheques', isDarkMode),
                path: '/cheques/payable-cheques',
                name: "cheques"

            },
            {
                title: 'چک‌های دریافتی',
                value:
                    data?.formattedReceivableChequesAmount?.toString() || '',
                unit: data?.receivableChequesAmountUOM || '',
                icon: getIconPath('receivablecheques', isDarkMode),
                path: '/cheques/receivable-cheques',
                name: "cheques"

            },
        ];
    }, [nearDueChequesData, isDarkMode]);

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
                        : '',
                unit: fundData?.fundBalanceUOM ?? '',
                icon: getIconPath('fundbalance', isDarkMode),
                path: '/AvailableFunds',
                name: "availablefunds"

            },
            {
                title: 'مانده بانک',
                value: fundData?.formattedBankBalance?.toString() ?? '',
                unit: fundData?.bankBalanceUOM ?? '',
                icon: getIconPath('bankbalance', isDarkMode),
                path: '/AvailableFunds',
                name: "availablefunds"

            },
        ];
    }, [availableFundsData, isDarkMode]);


    // Filter cards based on pageName settings
    const filterCardsByPageName = (cards: any[], pageName: string): any[] => {
        if (!isComponentEnabled(pageName)) return [];

        const cardTitles = CARD_TYPE_MAPPING[pageName as keyof typeof CARD_TYPE_MAPPING];
        if (!cardTitles) return cards;

        return cards.filter((card: any) => (cardTitles as readonly string[]).includes(card.title));
    };

    const cardsData = [
        ...filterCardsByPageName(saleAmount ?? [], 'salesrevenue'),
        ...filterCardsByPageName(availableFundsDataList ?? [], 'availablefunds'),
        ...filterCardsByPageName(debitCredit ?? [], 'debitcredit'),
        ...filterCardsByPageName(nearDueCheques ?? [], 'cheques'),
    ];

    const handleClickOpen = ({ path, title }: { path: string, title: string }) => {
        const infoDetail = {
            path,
            title
        }
        setInfoDetails(infoDetail)
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const parsedSortItems = useMemo<HomeCustomizationItem[]>(() => {
        const saved = localStorage.getItem("homeCustomization");
        if (saved) return JSON.parse(saved);

        return homeDefaultCustomeList || [];
    }, [homeDefaultCustomeList]);


    useEffect(() => {
        if (!locationState?.firstLogin) return;
        const intro = introJs();
        intro.setOptions({
            steps: introAppList,
            showProgress: true,
            exitOnOverlayClick: false,
            nextLabel: "بعدی",
            prevLabel: "قبلی",
            doneLabel: "تمام",
        });

        // Key fix: Start after DOM is ready
        const timer = setTimeout(() => intro.start(), 2500);

        return () => clearTimeout(timer);
    }, [locationState?.firstLogin]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return {
        saleAmount,
        debitCredit,
        availableFundsData,
        nearDueCheques,
        currencyTableData,
        cardsData,
        unsettledInvoicesData,
        unsettledInvoicesError,
        open,
        parsedSortItems,
        homeDefaultCustomeList,
        //handlers
        handleCurrencyRatesClick,
        handleClickOpen,
        handleClose,
        //lodings
        availablefundsLoading,
        currencyLoading,
        unsettledInvoicesLoading,
        salesRevenueLoading,
        nearChequesLoading,
        pageNameDataLoading
    };
}

