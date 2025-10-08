export interface DebitCreditBalanceAmountsItems {
    totalCreditAmount: number;
    formattedTotalCreditAmount: string;
    totalCreditAmountUOM: string;
    totalDebitAmount: number;
    formattedTotalDebitAmount: string;
    totalDebitAmountUOM:string;
    balanceAmount: number;
    formattedBalanceAmount: string;
}

export interface DebtorCreditorItem {
    code: string;
    name: string;
    customerCode: string;
    tel: string;
    mobile: string;
    sumBed: number;
    formattedSumBed: string;
    sumBedUOM: string;
    sumBes: number;
    formattedSumBes: string;
    sumBesUOM: string;
    price: number;
    formattedPrice: string;
    priceUOM: string;
} 


export interface GetTopNDebtorsItems{
    code: string;
    name: string;
    customerCode: string;
    tel: string;
    mobile: string;
    sumBed:number ;
    formattedSumBed: string;
    sumBedUOM: string;
    sumBes:number ;
    formattedSumBes: string;
    sumBesUOM: string;
    price: number;
    formattedPrice: string;
    priceUOM: string;
    }