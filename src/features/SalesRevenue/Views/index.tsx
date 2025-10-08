import TotalCard from "@/core/components/TotalCard";
import MainCard from "@/core/components/MainCard/MainCard";
import { Box, Typography, useTheme } from "@mui/material";
import CalendarIcon from "@/core/assets/icones/calendar.svg";
import DateFilter from "@/core/components/DateFilter";
import { DateFilterType } from "@/core/types/dateFilterTypes";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
import useSalesHooks from '../Hooks/ViewHooks';
import InnerPageHeader from "@/core/components/innerPagesHeader";

const SalesRevenueView = () => {
    const theme = useTheme();
    const { palette, isPending, data, selectedDate, setSelectedDate } = useSalesHooks()
    if (isPending) return <AjaxLoadingComponent  />;

    return (
        <Box sx={{ 
            background: theme.palette.background.default, 
            minHeight: "100vh" 
        }}>
            <InnerPageHeader title="فروش و سود" path="/home" />
            <Box sx={{ px: 1 }}>
                <DateFilter
                    value={selectedDate}
                    onChange={(value) => setSelectedDate(value as DateFilterType)}
                />
            </Box>
            <TotalCard
                rows={[
                    { title: "جمع فروش", value: data?.Data?.formattedTotalSalesAmount || 0, color: palette?.text.primary, unit: "تومان" },
                    { title: "جمع سود", value: data?.Data?.formattedTotalSalesRevenueAmount || 0, color: palette?.success.main, unit: "تومان" }
                ]}
            />

            {isPending ? (
                <Typography>در حال بارگذاری...</Typography>
            ) : (
                data?.Data?.salesRevenueReport?.map((item, idx) => (
                    <MainCard
                        key={idx}
                        headerIcon={CalendarIcon}
                        headerTitle="تاریخ"
                        headerValue={item.salesDate}
                        rows={[
                            { title: "فروش", value: Math.floor(item.salesAmount / 10), unit: "تومان" },
                            { title: "سود", value: Math.floor(item.salesRevenueAmount), unit: "تومان", valueColor: palette?.success.main }
                        ]}
                    />
                ))
            )}
        </Box>
    );
};

export default SalesRevenueView;