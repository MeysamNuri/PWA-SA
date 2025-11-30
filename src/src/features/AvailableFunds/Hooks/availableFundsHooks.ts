import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import useGetAvailableFunds from "./APIHooks/getAvailableFunds";
import useGetBankBalance from "./APIHooks/getBankBalance";
import { useFundsCalculations } from "./useFundsCalculations";
import type { TabType } from "../types";
import useGetFundBalance from "./APIHooks/getFundBalance";


export default function AvailableFundsViewHooks() {
    // UI state is managed directly in the component
    const [currencyTab, setCurrencyTab] = useState<TabType>('toman');
    const [selectedSegment, setSelectedSegment] = useState<'bank' | 'fund'>('bank');
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
    const { palette } = useTheme();

    // Fetch data using the specialized hook
    const {
        availableFundsData,
    } = useGetAvailableFunds();

    const { bankBalanceData } = useGetBankBalance();
    const {
        fundBalanceData,
    } = useGetFundBalance();

    // Perform calculations using the second hook
    const {
        totalAssetValue,
        bankAccountsData,
        fundAccountsData,
        formatedFundDisplay,
        initialBankItems,
        initialFundItems,
        remainingBankItems,
        remainingFundItems,
        formatedBankDisplay,
        bankPercentage,
        fundPercentage,
        bankBalance,
        fundBalance
        // ... and so on for all your returned values
    } = useFundsCalculations(availableFundsData, bankBalanceData, fundBalanceData, currencyTab);




    // Handlers are now in the component
    const handleCurrency = (value: string) => setCurrencyTab(value as TabType);
    const handlePieClick = (_event: any, pieItemIdentifier: any) => {
        setSelectedSegment(pieItemIdentifier.dataIndex === 0 ? 'bank' : 'fund');
    };

    const tabList = [
        { label: "دلار آمریکا", value: "dollar" },
        { label: "تومان", value: "toman" }
    ];
    const bankTotalBalanceUOM = bankBalanceData?.totalBalanceUOM
    const fundTotalBalanceUOM = fundBalanceData?.totalBalanceUOM
    const totalBalanceUOM = availableFundsData?.totalBalanceUOM
    const infoOBJ = {
        path: "AvailableFundsCommand",
        title: "مانده نقد و بانک"
    }
    return {
        // Return values for the component to use
        palette,
        tabList,
        availableFundsData,
        bankBalanceData,
        initialFundItems,
        currencyTab,
        handleCurrency,
        selectedSegment,
        handlePieClick,
        isDetailsExpanded,
        setIsDetailsExpanded,
        totalAssetValue,
        bankAccountsData,
        initialBankItems,
        remainingBankItems,
        fundAccountsData,
        remainingFundItems,
        formatedBankDisplay,
        formatedFundDisplay,
        bankPercentage,
        fundPercentage,
        bankTotalBalanceUOM,
        fundTotalBalanceUOM,
        totalBalanceUOM,
        bankBalance,
        fundBalance,
        infoOBJ
        // ... all other values
    };
}