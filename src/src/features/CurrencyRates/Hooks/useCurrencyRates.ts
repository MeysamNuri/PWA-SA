import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useExchangeRate from '../Hooks/APIHooks/useExchangeRate';
import type { ExchangeRateItem } from '../types';

type TabType = 'currencyRates' | 'coinRates' | 'goldRates';

export default function useCurrencyRatesHook()  {
    const { data, isPending, isError, error } = useExchangeRate();
    const location = useLocation();
    const navigate = useNavigate();

    // Determine tab based on URL using useMemo to ensure it updates when URL changes
    const selectedTab = useMemo(() => {
        const pathname = location.pathname;
        
        if (pathname === '/currencyRates/currency') {
            return 'currencyRates';
        } else if (pathname === '/currencyRates/coin') {
            return 'coinRates';
        } else if (pathname === '/currencyRates/gold') {
            return 'goldRates';
        } else if (pathname === '/currencyRates') {
            return 'currencyRates';
        }
        return 'currencyRates';
    }, [location.pathname]); 

    const tabs = [
        { label: 'ارز', value: 'currencyRates' as TabType },
        { label: 'سکه', value: 'coinRates' as TabType },
        { label: 'طلا', value: 'goldRates' as TabType },
    ];

    const filteredData = useMemo(() => {
        if (!data?.Data) return [];

        let exchangeRates: ExchangeRateItem[] = [];
        
        if (Array.isArray(data.Data)) {
            exchangeRates = data.Data;
        } else if (data.Data && typeof data.Data === 'object' && 'exchangeRateItem' in data.Data) {
            exchangeRates = (data.Data as { exchangeRateItem: ExchangeRateItem[] }).exchangeRateItem || [];
        } else if (data.Data && typeof data.Data === 'object') {
            exchangeRates = Object.values(data.Data).find(Array.isArray) as ExchangeRateItem[] || [];
        }

        if (!Array.isArray(exchangeRates)) {
            console.warn('Exchange rates data is not an array:', data.Data);
            return [];
        }

        switch (selectedTab) {
        case 'currencyRates': {
            return exchangeRates.filter((item) =>
                ['UsdDollar', 'Euro', 'Gbp', 'Aed'].includes(item.name),
            );
        }
        case 'coinRates': {
            return exchangeRates.filter((item) =>
                [
                    'SekeEmaami',
                    'SekeBahar',
                    'SekeNim',
                    'SekeRob',
                    'SekeGrami',
                ].includes(item.name),
            );
        }
        case 'goldRates': {
            const goldItems = exchangeRates.filter((item) =>
                [
                    'Ons',
                    'GoldGram18',
                    'GoldGram18740',
                    'GoldGram24',
                    'GoldMesghal',
                ].includes(item.name),
            );
              
            const customOrder = [
                'GoldGram18',
                'GoldGram18740',
                'GoldGram24',
                'GoldMesghal',
                'Ons',
            ];
            return goldItems.sort(
                (a, b) =>
                    customOrder.indexOf(a.name) -
                        customOrder.indexOf(b.name),
            );
        }
        default:
            return [];
        }
    }, [data?.Data, selectedTab]);

    const findDollar = useMemo(() => {
        if (!data?.Data) return null;
        
        let exchangeRates: ExchangeRateItem[] = [];
        
        if (Array.isArray(data.Data)) {
            exchangeRates = data.Data;
        } else if (data.Data && typeof data.Data === 'object' && 'exchangeRateItem' in data.Data) {
            exchangeRates = (data.Data as { exchangeRateItem: ExchangeRateItem[] }).exchangeRateItem || [];
        } else if (data.Data && typeof data.Data === 'object') {
            exchangeRates = Object.values(data.Data).find(Array.isArray) as ExchangeRateItem[] || [];
        }

        if (!Array.isArray(exchangeRates)) {
            return null;
        }
        
        return exchangeRates.find((item) => item.name === 'UsdDollar') || null;
    }, [data?.Data]);

    const handleTabClick = (tabValue: TabType) => {
        // Navigate to the appropriate URL based on tab
        switch (tabValue) {
            case 'currencyRates':
                navigate('/currencyRates/currency');
                break;
            case 'coinRates':
                navigate('/currencyRates/coin');
                break;
            case 'goldRates':
                navigate('/currencyRates/gold');
                break;
            default:
                navigate('/currencyRates');
                break;
        }
    };

    return {
        selectedTab,
        tabs,
        filteredData,
        findDollar,
        isPending,
        isError,
        error,
        handleTabClick,
    };
}; 