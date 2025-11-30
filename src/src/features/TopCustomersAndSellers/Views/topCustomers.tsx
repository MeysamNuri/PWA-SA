import DateFilter from "@/core/components/DateFilter";
import InnerPageHeader from "@/core/components/innerPagesHeader"
import { DateFilterType } from "@/core/types/dateFilterTypes";
import { Box, useTheme } from "@mui/material"
import useTopCustomersAndSellersHooks from "../Hooks/topCustomersAndSellersHooks";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
import MainCard from "@/core/components/MainCard/MainCard";
import ProfitNotFound from "@/core/components/profitNotFound";
import useTopCustomersByPurchaseHook from "@/features/Home/Hooks/APIHooks/useTopCustomers";

const TopCustomersView = () => {
    const { palette } = useTheme();
    const { handleOnchange, dateFilter,infoOBJ } = useTopCustomersAndSellersHooks()
    const { topCustomersByPurchaseData,isPending:topCustomersPending } = useTopCustomersByPurchaseHook(dateFilter);

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: palette.background.default,

        }}>
            <InnerPageHeader title="مشتریان برتر" path="/home" infoIcon={infoOBJ} />
            <Box sx={{mb:2, display: "flex", flexDirection: "row-reverse", mx: 1, overflow: { xs: "scroll", sm: "unset" } }}>
                <DateFilter options={[

                    { label: '۱سال گذشته', value: DateFilterType.LastYear },
                    { label: '۶ماه گذشته ', value: DateFilterType.Last6Months },
                    { label: '۳ماه گذشته ', value: DateFilterType.Last3Months },
                    { label: '۳۰روز گذشته ', value: DateFilterType.Last30Days },
                    { label: '۷روز گذشته', value: DateFilterType.Last7Days },
                    { label: 'دیروز', value: DateFilterType.Yesterday }

                ]} onChange={(value) => handleOnchange(value as DateFilterType)} value={dateFilter} />
            </Box>

            {topCustomersPending ? (
                <AjaxLoadingComponent />
            ) : (
                topCustomersByPurchaseData!==null?
                topCustomersByPurchaseData?.map((item, idx) => (
                    <MainCard
                        key={idx}
                        headerTitle={item.customerName}
                        rows={[
                            { title: "جمع فروش", value: item.soldPrice/10, unit: "تومان" },
                            { title: "تعداد فاکتور", value: item.invoiceQuantity, unit: "عدد" }
                        ]}
                    />
                )):
                <ProfitNotFound message="اطلاعاتی دریافت نشد" />
            )}
        </Box>
    )
}
export default TopCustomersView