
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InnerPageHeader from "@/core/components/innerPagesHeader";
import useOverDueReceivableChequesDetails from "../Hooks/APIHooks/overDueReceivableChequesDetails";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
import MainCard from "@/core/components/MainCard/MainCard";
import { useState } from "react";
import ProfitNotFound from "@/core/components/profitNotFound";

export default function OverDueReceivableChequeDetailsView() {
    const theme = useTheme();
    const { overDueReceivableChequesData, isPending } = useOverDueReceivableChequesDetails()
    const [expandedCard, setExpandedCard] = useState<number | null>(0)
    
    if (isPending) return <AjaxLoadingComponent />
    return (
        <>
            <InnerPageHeader title="چک های تاریخ گذشته وصول نشده " path="/home" />
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default,
                    py: 2

                }}
            >
                <MainCard
                    headerTitle="جمع کل مبالغ"
                    headerUnit={overDueReceivableChequesData?.chequesAmountUOM}
                    headerValue={overDueReceivableChequesData?.formattedChequesAmount}
                    rows={[
                        { title: "تعداد", value: overDueReceivableChequesData?.chequesQuantity ?? "-", unit: "عدد" }
                    ]}
                />
                {
                    overDueReceivableChequesData?.overDueReceivableChequesDetailsDtos && overDueReceivableChequesData?.overDueReceivableChequesDetailsDtos.length > 0 ?
                        overDueReceivableChequesData?.overDueReceivableChequesDetailsDtos?.map((cheque, idx) => (
                            <MainCard
                                key={idx}
                                index={idx}
                                headerValue={cheque.formattedChequesAmount}
                                headerUnit={cheque.chequesAmountUOM}
                                bankName={cheque.bankName}
                                isCollapsible={true}
                                isExpanded={expandedCard === idx}
                                onToggle={() => setExpandedCard(expandedCard === idx ? null : idx)}
                                rows={[
                                    { title: "نام صاحب حساب", value: cheque.accountName },
                                    { title: "شماره چک", value: cheque.chequeNumber },
                                    { title: "صدور", value: cheque.issueDate, rowSize: 6 },
                                    { title: "سررسید", value: cheque.dueDate, rowSize: 6 }
                                ]}
                                headerTitle={cheque.bankName} />
                        )) :
                        <ProfitNotFound message="چک ثبت شده‌ای وجود ندارد" isFromCheques={true} />

                }


            </Box>
        </>
    );
}
