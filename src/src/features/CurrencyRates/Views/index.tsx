import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import InnerPageHeader from '@/core/components/innerPagesHeader';
import ToggleTab from '@/core/components/ToggleTab';
import type { ExchangeRateItem } from '../types';
import AjaxLoadingComponent from '@/core/components/ajaxLoadingComponent';
import ProfitNotFound from '@/core/components/profitNotFound';
import MainCard from '@/core/components/MainCard/MainCard';
import useCurrencyRatesHook from '../Hooks/useCurrencyRates';
import Time from '/icons/appbar/light/time.svg'
import { NumberConverter } from '@/core/helper/numberConverter';

const CurrencyRatesView: React.FC = () => {
    const {palette} = useTheme();
    const {
        isPending,
        isError,
        error,
        filteredData,
        tabs,
        findDollar,
        handleTabClick,
        selectedTab } = useCurrencyRatesHook()

    if (isError) {
        return (
            <Box
                sx={{
                    mx: "auto",
                    bgcolor: palette.background.default,
                    minHeight: '100vh',
                    borderRadius: 3,
                    padding: '12px 8px 8px 8px',
                }}
            >
                <InnerPageHeader title="نرخ طلا، سکه و ارز" path="/home" />
                <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
                    {error?.message || 'خطا در دریافت اطلاعات'}
                </Typography>
            </Box>
        );
    }
    return (
        <Box
            sx={{
                mx: "auto",
                bgcolor: palette.background.default,
                minHeight: '100vh',
                borderRadius: 3,
                padding: '12px 8px 8px 8px',
            }}
        >
            <InnerPageHeader title="نرخ طلا، سکه و ارز" path="/home" />

            <ToggleTab
                value={selectedTab as any}
                onChange={handleTabClick}
                options={tabs}
                variant="tab"
            />

            <Box >
                {isPending ? (
                    <AjaxLoadingComponent  />
                ) : filteredData.length > 0 ? (
                    filteredData.map(
                        (item: ExchangeRateItem, idx: number) => (
                            <MainCard
                                key={item.price + idx}
                                headerTitle={item.title}
                                headerIcon={Time}
                                headerValue={NumberConverter.formatTime(
                                    new Date(item.sourceCreated).getHours(),
                                    new Date(item.sourceCreated).getMinutes()
                                )}
                                rows={[
                                    {
                                        title: "%" + NumberConverter.latinToArabic(Math.abs(Number(item.rateOfChange)).toString()),
                                        value:
                                            item.name === "Ons" ?
                                                NumberConverter.latinToArabic((Math.floor(Number(item.price) * Number(findDollar?.price) / 10)).toLocaleString('fa-IR')) :
                                                NumberConverter.latinToArabic((Number(item.price) / 10).toLocaleString('fa-IR')), unit: "تومان",
                                        headerColor: Number(item.rateOfChange) > 0 ? palette.success.main : palette.error.main,
                                        showArrow: Number(item.rateOfChange) !== 0 ? true : false,
                                        isPositiveChange: Number(item.rateOfChange) > 0 ? true : false
                                    },
                                    ...(item.name === "Ons" ? [
                                        {
                                            title: "%" + NumberConverter.latinToArabic(Math.abs(Number(item.rateOfChange)).toString()),
                                            value: NumberConverter.latinToArabic((Math.floor(Number(item.price))).toLocaleString('fa-IR')),
                                            unit: '$',
                                            headerColor: Number(item.rateOfChange) > 0 ? palette.success.main : palette.error.main,
                                            showArrow: Number(item.rateOfChange) !== 0 ? true : false,
                                            isPositiveChange: Number(item.rateOfChange) > 0 ? true : false
                                        }
                                    ] : [])
                                ]}
                            />
                        ),
                    )
                ) : (
                    <ProfitNotFound message="داده‌ای برای نمایش وجود ندارد." />
                )}
            </Box>
        </Box>
    );
};

export default CurrencyRatesView;
