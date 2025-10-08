import MainCard from "@/core/components/MainCard/MainCard";
import type { IChequesNearDueTotal, INearDueChequesSubTotalOutput } from "../types";

const RenderSummaryCard = ({ totalData, isReceivable }: { totalData: INearDueChequesSubTotalOutput & IChequesNearDueTotal | undefined, isReceivable: boolean | undefined }) => {
    if (!totalData) return null;
    if (totalData.chequesQuantity) {
        return (
            <MainCard
                bankName={totalData.bankName}
                headerTitle={totalData.bankName}
                headerValue={totalData.chequesQuantity}
                headerUnit="عدد"
                rows={[
                    { title: "جمع مبلغ", value: totalData.formattedChequesAmount, unit: totalData.chequesAmountUOM }
                ]}
            />
        );
    }
    // Fallback for all cheques

    return (
        <MainCard
            bankName={totalData.bankName}
            headerTitle={isReceivable ? "همه چک های دریافتی" : "همه چک های پرداختی"}
            headerValue={isReceivable ? totalData.receivableChequesQuantity : totalData.payableChequesQuantity}
            headerUnit="عدد"
            rows={[
                {
                    title: "جمع مبلغ",
                    value: isReceivable ? totalData.formattedReceivableChequesAmount : totalData.formattedPayableChequesAmount,
                    unit: isReceivable ? totalData.receivableChequesAmountUOM : totalData.payableChequesAmountUOM
                }
            ]}
        />
    );
};
export default RenderSummaryCard