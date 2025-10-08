export interface IAvailableFundsReportDetail {
    bankBalance: number;
    bankBalanceInDollar: number;
    formattedBankBalance: string;
    bankBalanceUOM: string;
    fundBalance: number;
    fundBalanceInDollar: number;
    formattedFundBalance: string;
    fundBalanceUOM: string;
    balancePercentage: number;
}

export interface IAvailableFundsResponse {
    availableFundsReportResponseDtos: IAvailableFundsReportDetail[];
    totalBalance: number;
    totalBalanceUOM: string;
    formattedTotalBalance: string;
    totalBalanceInDollar: number;
}

export interface GetFundBalanceDetails {
    serial: string;
    accountingCode: string;
    accountingName: string;
    creditAmount: number;
    creditAmountInDollar: number;
    formattedCreditAmount: string;
    creditAmountUOM: string;
    debitAmount: number;
    debitAmountInDollar: number;
    formattedDebitAmount: string;
    debitAmountUOM: string;
    balance: number;
    balanceInDollar: number;
    formattedBalance: string;
    balanceUOM: string;
    balancePercentage: number;
}

export interface IGetFundBalanceDetailsResponse {
    fundAccountsBalanceOutputs: GetFundBalanceDetails[];
    totalBalance: number;
    totalBalanceUOM: string;
    formattedTotalBalance: string;
    totalBalanceInDollar: number;
}


export interface IBankAccountBalanceDetail {
    serial: string;
    accountingCode: string;
    accountingName: string;
    creditAmount: number;
    creditAmountInDollar: number;
    formattedCreditAmount: string;
    creditAmountUOM: string;
    debitAmount: number;
    debitAmountInDollar: number;
    formattedDebitAmount: string;
    debitAmountUOM: string;
    balance: number;
    balanceInDollar: number;
    formattedBalance: string;
    balanceUOM: string;
    balancePercentage: number;
    bankCode: string;
    bankName: string;
    branchCode: string;
    branchName: string;
}

export interface IBankBalanceResponse {
    bankAccountsBalanceOutputs: IBankAccountBalanceDetail[];
    totalBalance: number;
    totalBalanceUOM: string;
    formattedTotalBalance: string;
    totalBalanceInDollar: number;
}
export enum valueTypeEnum {
    fund = "fund",
    bank = "bank",
    available = "available"
}
  
export type TabType = 'dollar' | 'toman'
