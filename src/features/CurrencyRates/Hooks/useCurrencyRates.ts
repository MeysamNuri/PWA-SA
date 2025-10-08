import { useMemo, useState } from 'react';
import useExchangeRate from '../Hooks/APIHooks/useExchangeRate';
import type { ExchangeRateItem } from '../types';

type TabType = 'currencyRates' | 'coinRates' | 'goldRates';

export default function useCurrencyRatesHook()  {
    const { data, isPending, isError, error } = useExchangeRate();
    const [selectedTab, setSelectedTab] = useState<TabType>('currencyRates'); 

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
                'GoldGram18740',
                'GoldGram18',
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
        setSelectedTab(tabValue);
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