import ProfitNotFound from "@/core/components/profitNotFound";
import MainCard from "@/core/components/MainCard/MainCard";
import type { IBanksChequeDetails } from "../types";

const RenderChequesList = ({ nearDueChequesDetailsData, expandedCard, setExpandedCard }: {
    expandedCard: number | null,
    setExpandedCard: React.Dispatch<React.SetStateAction<number | null>>
    nearDueChequesDetailsData: IBanksChequeDetails | undefined
}) => {


    const cheques = nearDueChequesDetailsData?.nearDueChequesDtos;


    if (cheques && cheques.length > 0) {
        return cheques.map((item, idx) => (
            <MainCard
                key={item.chequeNumber || idx}
                bankName={item.bankName}
                headerTitle={item.accountName}
                headerValue={item.formattedChequeAmount}
                headerUnit={item.chequeAmountUOM}
                isCollapsible={true}
                isExpanded={expandedCard === idx}
                onToggle={() => setExpandedCard(expandedCard === idx ? null : idx)}
                rows={[
                    { title: "صدور", value: item.issueDate, rowSize: 6 },
                    { title: "سررسید", value: item.dueDate, rowSize: 6 },
                    { title: "بانک", value: item.bankName, rowSize: 6 },
                    { title: "شماره چک", value: item.chequeNumber, rowSize: 6 },
                ]}
            />
        ));
    }
    return <ProfitNotFound message="چک ثبت شده‌ای وجود ندارد" />;
};

export default RenderChequesList