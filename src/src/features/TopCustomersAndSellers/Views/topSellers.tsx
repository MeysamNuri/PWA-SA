import DateFilter from "@/core/components/DateFilter";
import InnerPageHeader from "@/core/components/innerPagesHeader"
import { DateFilterType } from "@/core/types/dateFilterTypes";
import { Box, useTheme } from "@mui/material"
import useTopCustomersAndSellersHooks from "../Hooks/topCustomersAndSellersHooks";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
import MainCard from "@/core/components/MainCard/MainCard";
import ProfitNotFound from "@/core/components/profitNotFound";
import useGetSalesBySeller from "@/features/Home/Hooks/APIHooks/useSalesBySeller";

const TopSellersView = () => {
    const { palette } = useTheme();
    const { handleOnchange, dateFilter, sellersInfoOBJ } = useTopCustomersAndSellersHooks()
    const { salesBySellerData, isPending } = useGetSalesBySeller(dateFilter);

    return (
        <Box sx={{
            pb: 1,
            minHeight: '100vh',
            backgroundColor: palette.background.default,
        }}>
            <InnerPageHeader title="فروشندگان برتر" path="/home" infoIcon={sellersInfoOBJ} />
            <Box sx={{ mb: 2, display: "flex", flexDirection: "row-reverse", mx: 1, overflow: { xs: "scroll", sm: "unset" } }}>
                <DateFilter options={[

                    { label: '۱سال گذشته', value: DateFilterType.LastYear },
                    { label: '۶ماه گذشته ', value: DateFilterType.Last6Months },
                    { label: '۳ماه گذشته ', value: DateFilterType.Last3Months },
                    { label: '۳۰روز گذشته ', value: DateFilterType.Last30Days },
                    { label: '۷روز گذشته', value: DateFilterType.Last7Days },
                    { label: 'دیروز', value: DateFilterType.Yesterday }

                ]} onChange={(value) => handleOnchange(value as DateFilterType)} value={dateFilter} /> 
            </Box>
            {isPending ? (
                <AjaxLoadingComponent />
            ) : (
                salesBySellerData && salesBySellerData?.salesBySellerDto?.length > 0 ?
                    salesBySellerData?.salesBySellerDto?.map((item, idx) => (
                        <MainCard
                            key={idx}
                            headerTitle={item.sellerName}
                            rows={[
                                { title: "جمع فروش", value: item.soldPrice/10, unit: "تومان" },
                                { title: "تعداد فاکتور", value: item.invoiceQuantity, unit: "عدد" }
                            ]}
                        />
                    )) :
                    <ProfitNotFound message="اطلاعاتی دریافت نشد" />
            )}
        </Box>
    )
}
export default TopSellersView