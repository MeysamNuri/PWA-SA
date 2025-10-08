import { useMemo } from "react";
import { toPersianNumber } from "@/core/helper/translationUtility";
import type { IAvailableFundsResponse, IBankBalanceResponse, IGetFundBalanceDetailsResponse, TabType } from "../types";

export function useFundsCalculations(availableFundsData: IAvailableFundsResponse | undefined, bankBalanceData: IBankBalanceResponse | undefined, fundBalanceData: IGetFundBalanceDetailsResponse | undefined, currencyTab: TabType) {
    return useMemo(() => {
        const detail = availableFundsData?.availableFundsReportResponseDtos[0];

        // --- Centralized conversion logic to avoid repetition ---
        const convertToPersian = (value: number | string | undefined): string => {
            if (value === undefined) return '';
            return toPersianNumber(String(value));
        };

        const totalAssetValue = convertToPersian(
            currencyTab === 'toman'
                ? availableFundsData?.formattedTotalBalance
                : availableFundsData ? Math.floor(availableFundsData?.totalBalanceInDollar)?.toLocaleString() : 0
        );

        const formatedBankDisplay = convertToPersian(
            currencyTab === 'toman'
                ? detail?.formattedBankBalance
                : detail?.bankBalanceInDollar?.toLocaleString()
        );
        const formatedFundDisplay = convertToPersian(
            currencyTab === 'toman'
                ? detail?.formattedFundBalance
                : detail?.fundBalanceInDollar?.toLocaleString()
        );

        // ... and so on for all your other calculated values

        const bankAccountsData = bankBalanceData?.bankAccountsBalanceOutputs.map((account, index: number) => ({
            ...account,
            displayColor: `hsl(${(index * 70) % 360}, 70%, 50%)`,
            formattedBalance: convertToPersian(
                currencyTab === 'toman' ? account.formattedBalance : account.balanceInDollar?.toLocaleString()
            ),
            balancePercentage: convertToPersian(account.balancePercentage?.toFixed(0)),
        })) || [];

        const fundAccountsData = fundBalanceData?.fundAccountsBalanceOutputs.map((account, index: number) => ({
            ...account,
            displayColor: index === 0 ? "#ffeb3b" : "#2196f3",
            formattedBalance: convertToPersian(
                currencyTab === 'toman' ? account.formattedBalance : account.balanceInDollar?.toLocaleString()
            ),
            balancePercentage: convertToPersian(account.balancePercentage?.toFixed(0)),
        })) || [];

        const bankPct =
            availableFundsData?.totalBalance && detail?.bankBalance
                ? ((currencyTab === 'toman' ? detail.bankBalance : detail.bankBalanceInDollar || 0) /
                    (currencyTab === 'toman' ? availableFundsData.totalBalance : availableFundsData.totalBalanceInDollar || 1)) * 100
                : 0;
        const fundPct =
            availableFundsData?.totalBalance && detail?.fundBalance
                ? ((currencyTab === 'toman' ? detail.fundBalance : detail.fundBalanceInDollar || 0) /
                    (currencyTab === 'toman' ? availableFundsData.totalBalance : availableFundsData.totalBalanceInDollar || 1)) * 100
                : 0;
        const initialBankItems = bankAccountsData.slice(0, 6);
        const remainingBankItems = bankAccountsData.slice(6);
        const initialFundItems = fundAccountsData.slice(0, 6);
        const remainingFundItems = fundAccountsData.slice(6);

        return {
            totalAssetValue,
            formatedBankDisplay,
            bankAccountsData,
            fundAccountsData,
            initialBankItems,
            remainingBankItems,
            initialFundItems,
            remainingFundItems,
            formatedFundDisplay,
            bankPercentage: bankPct,
            fundPercentage: fundPct,
            // ... all other returned values
        };
    }, [availableFundsData, bankBalanceData, fundBalanceData, currencyTab]);
}