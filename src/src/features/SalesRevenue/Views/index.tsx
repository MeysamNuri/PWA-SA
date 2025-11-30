import TotalCard from "@/core/components/TotalCard";
import MainCard from "@/core/components/MainCard/MainCard";
import { Box, useTheme } from "@mui/material";
import CalendarIcon from '/icons/appbar/light/calendar.svg';
import DateFilter from "@/core/components/DateFilter";
import { DateFilterType } from "@/core/types/dateFilterTypes";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
import useSalesHooks from '../Hooks/ViewHooks';
import InnerPageHeader from "@/core/components/innerPagesHeader";
import { NumberConverter } from "@/core/helper/numberConverter";
import moment from 'moment-jalaali';

const SalesRevenueView = () => {
    const { palette } = useTheme();
    const { isPending, data, selectedDate,infoOBJ, setSelectedDate } = useSalesHooks()
    if (isPending) return <AjaxLoadingComponent />;

    return (
        <Box sx={{
            background: palette.background.default,
            minHeight: "100vh" 
        }}>
            <InnerPageHeader title="فروش و سود" path="/home" infoIcon={infoOBJ} />
            <Box sx={{ px: 1 }}>
                <DateFilter
                    value={selectedDate}
                    onChange={(value) => setSelectedDate(value as DateFilterType)}
                />
            </Box>
            <TotalCard
                rows={[
                    { title: "جمع فروش", value: data?.Data?.formattedTotalSalesAmount || 0, color: palette?.text.primary, unit: data?.Data?.totalSalesAmountUOM },
                    { title: "جمع سود", value: data?.Data?.formattedTotalSalesRevenueAmount || 0, color: palette?.success.main, unit: data?.Data?.totalSalesRevenueAmountUOM }
                ]}
            />

            {isPending ? (
              <AjaxLoadingComponent />
            ) : (
                data?.Data?.salesRevenueReport?.map((item, idx) => (
                    <MainCard
                        key={idx}
                        headerIcon={CalendarIcon} 
                        headerTitle="تاریخ"
                        headerValue={NumberConverter.latinToArabic(moment(item.salesDate).format('jYYYY/jMM/jDD'))}
                        rows={[
                            { title: "فروش", value: Math.floor(item.salesAmount / 10), unit: "تومان" },
                            { title: "سود", value: Math.floor(item.salesRevenueAmount / 10), unit: "تومان", valueColor: palette?.success.main }
                        ]}
                    />
                ))
            )}
        </Box>
    );
};

export default SalesRevenueView;