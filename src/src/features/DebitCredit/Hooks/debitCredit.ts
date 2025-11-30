import useTopDebtors from "./APIHooks/useTopDebtors";
import type { DebtorCreditorItem } from "@/features/DebitCredit/types";

import { useState } from "react";
import useTopCreditors from "./APIHooks/useTopCreditors";
import useDebitCreditTotals from "./APIHooks/useDebitCredit";




export default function useDebitCreditCardHooks() {


    const [selectedTab, setSelectedTab] = useState("debtors");
    const { data: debitData } = useTopDebtors();
    const debtorsList = debitData?.Data ?? [];
    const { data: creditorsData } = useTopCreditors();
    const creditorsList = creditorsData?.Data ?? [];
    const { data: totals } = useDebitCreditTotals();
    const rawList = selectedTab === "debtors" ? debtorsList : creditorsList;
    const list: DebtorCreditorItem[] = Array.isArray(rawList) ? rawList : [];

    const [expandedCard, setExpandedCard] = useState<number | null>(0);
    const tabList = [
        { label: "بستانکاران", value: "creditors" },
        { label: "بدهکاران", value: "debtors" },
    ];
    const infoOBJ = {
        path: "DebitCreditCommand",
        title: "طرف حساب ها"
    }
    return {
        setSelectedTab,
        setExpandedCard,
        selectedTab,
        totals,
        list,
        expandedCard,
        debtorsList,
        creditorsList,
        tabList,
        infoOBJ

    }
}