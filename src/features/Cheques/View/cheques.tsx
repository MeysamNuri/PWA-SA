import InnerPageHeader from "@/core/components/innerPagesHeader";
import MainCard from "@/core/components/MainCard/MainCard";
import ArrowLeft from '@/core/assets/icones/arrow-left.svg';
import { Box, useTheme } from "@mui/material";
import ProfitNotFound from "@/core/components/profitNotFound";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
import ChequeTotalCard from "../Components/totalCard";
import useNearDueChequesTotalHook from "@/features/Home/Hooks/APIHooks/useNearDueCheques";
import DateFilter from "@/core/components/DateFilter";
import { ChequesDateFilterType } from "@/core/types/dateFilterTypes";
import { useChequesStore } from "@/core/constant/zustandStore";
import useTotaDataChequesHooks from "../Hooks/totalDataChequesHooks";
import { toPersianNumber } from "@/core/helper/translationUtility";


export default function ChequesView() {
    const theme = useTheme();
    const {
        handleOnchange,
        dataFilter,
        isPending,
        isReceivable,
        detailsPath,
        chequeStatus,
        nearDueChequesSubTotalData
    } = useTotaDataChequesHooks()

    const { data: nearDueChequeTotalData } = useNearDueChequesTotalHook(dataFilter);
    if (isPending) return <AjaxLoadingComponent mt={20} />;

    return (
        <Box
            sx={{
                pb: 1,
                minHeight: '100vh',
                backgroundColor: theme.palette.background.default,
            }}
        >
            <InnerPageHeader
                title={isReceivable ? " چک های دریافتی" : " چک های پرداختی"}
                path="/home"
            />

            <Box >
                <Box sx={{ px: 2 }}>
                    <DateFilter options={[
                        { label: '۳۰ روز آینده', value: ChequesDateFilterType.Next30DaysDate },
                        { label: '۷ روز آینده', value: ChequesDateFilterType.Next7DaysDate },
                        { label: 'سررسید فردا', value: ChequesDateFilterType.TomorrowDate }

                    ]} onChange={(value) => handleOnchange(value as ChequesDateFilterType)} value={dataFilter} />
                </Box>
                <ChequeTotalCard
                    path={detailsPath}
                    chequeStatus={chequeStatus}
                    data={nearDueChequeTotalData?.Data}
                />
                {nearDueChequesSubTotalData?.nearDueChequesSubTotalOutput && nearDueChequesSubTotalData.nearDueChequesSubTotalOutput.length > 0 ? (
                    nearDueChequesSubTotalData.nearDueChequesSubTotalOutput.map((item) => (
                        <Box onClick={() => useChequesStore.getState().setItems(item)}>
                            <MainCard
                                bankName={item.bankName}
                                path={detailsPath}
                                key={`${item.bankcode}-${item.bankAccountNumber}`}
                                headerTitle={item.bankName + " " + (!isReceivable ? toPersianNumber(item?.bankAccountNumber) : "")}
                                headerIcon={ArrowLeft}
                                isCollapsible={false}
                                rows={
                                    [
                                        { title: "تعداد", value: item.chequesQuantity, unit: "عدد", rowSize: 12 },
                                        { title: "مبلغ", value: Number(Math.floor(item.chequesAmount / 10)), unit: item.chequesAmountUOM, rowSize: 12 },
                                        ...(!isReceivable ? [
                                            { title: 'موجودی حساب', value: (Math.floor(item.bankBalance / 10)), unit: 'تومان' },
                                            ...(item.needAmount > 0 ? [
                                                { title: 'کسری موجودی', value: (Math.floor(item.needAmount / 10)), unit: 'تومان', valueColor: theme.palette.error.main, headerColor: theme.palette.error.main }
                                            ] : [])

                                        ] : [])
                                    ]
                                }
                            />
                        </Box>
                    ))
                ) : (
                    <ProfitNotFound message="چک ثبت شده‌ای وجود ندارد" isFromCheques={true} />
                )}
            </Box>
        </Box>
    );
}
