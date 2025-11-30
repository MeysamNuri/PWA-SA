import React from 'react';
import MainCard from '@/core/components/MainCard/MainCard';
import { Box, useTheme } from '@mui/material';
import CalendarIcon from '/icons/appbar/light/calendar.svg';
import AjaxLoadingComponent from '@/core/components/ajaxLoadingComponent';
import useUnsettledInvoicesDetailsHooks from '../Hooks/unsettledInvoicesDetails';
import InnerPageHeader from '@/core/components/innerPagesHeader';
import DateFilter from '@/core/components/DateFilter';
import { NumberConverter } from '@/core/helper/numberConverter';
import moment from 'moment-jalaali';
import ProfitNotFound from '@/core/components/profitNotFound';

const UnsettledInvoicesDetailsView: React.FC = () => {
    const { palette } = useTheme();
    const {
        setExpandedCard,
        expandedCard,
        sortedInvoices,
        isPending,
        isError,
        infoOBJ,
        selectedDaysType,
        handleDaysChange,
        dateFilterOptions
    } = useUnsettledInvoicesDetailsHooks();

    if (isPending) return <AjaxLoadingComponent />;
    if (isError) return <Box textAlign="center" mt={4}>خطا در دریافت اطلاعات</Box>;

    return (
        <Box sx={{ mx: "auto", bgcolor: palette.background.default, minHeight: "100vh", borderRadius: 3 }}>
            <InnerPageHeader title="فاکتورهای تسویه نشده" path="/home" infoIcon={infoOBJ} />
            <Box sx={{ px: 2, pt: 1, direction: "rtl" }}>
                <DateFilter
                    value={selectedDaysType}
                    onChange={handleDaysChange}
                    options={dateFilterOptions}
                    align="left"
                />
            </Box>

            {sortedInvoices.length > 0 ? (
                sortedInvoices.map((item, idx) => (
                    <Box key={item.invoiceCode} mb={1}>
                        <MainCard
                            headerTitle={' فاکتور ' + item.invoiceCode}
                            headerIcon={CalendarIcon}
                            headerValue={NumberConverter.latinToArabic(moment(item.invoiceDate).format('jYYYY/jMM/jDD'))}
                            headerUnit=""
                            isCollapsible={true}
                            isExpanded={expandedCard === idx}
                            onToggle={() => setExpandedCard(expandedCard === idx ? null : idx)}
                            rows={[
                                { title: 'نام مشتری', value: item.customerName, rowSize: 12 },
                                { title: 'مبلغ فاکتور', value: item.formattedInvoiceAmount, unit: item.invoiceAmountUOM, rowSize: 12 },
                                { title: 'مبلغ تسویه شده', value: item.formattedPaidAmount, unit: item.paidAmountUOM, rowSize: 12 },
                                { title: 'مبلغ باقیمانده', value: item.formattedSettelementBalance, unit: item.settelementBalanceUOM, rowSize: 12 },
                                { title: 'نام فروشنده', value: item.sellerName, rowSize: 6 },
                                { title: 'کد فروشنده', value: item.sellerCode, rowSize: 6 },
                            ]}
                        />
                    </Box>
                ))
            ) : (
                <Box
                    sx={{
                        textAlign: "center",
                        mt: 4,
                        p: 3,

                        mx: 2
                    }}
                >
                    <Box sx={{
                        fontSize: '1rem',
                        color: palette.text.secondary,
                        mb: 1
                    }}>
                        <ProfitNotFound message='فاکتور تسویه نشده‌ای موجود نیست' />
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default UnsettledInvoicesDetailsView;
