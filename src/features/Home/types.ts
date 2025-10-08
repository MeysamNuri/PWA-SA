export interface AvailableFundsReportDto {
    bankBalance: number;
    bankBalanceInDollar: number;
    formattedBankBalance: string;
    bankBalanceUOM: string;
    fundBalance: number;
    fundBalanceInDollar: number;
    formattedFundBalance: string;
    fundBalanceUOM: string;
    bankBalancePercentage: number;
    fundBalancePercentage: number;
}

export interface AvailableFundsData {
    availableFundsReportResponseDtos: AvailableFundsReportDto[];
    totalBalance: number;
    totalBalanceUOM: string;
    formattedTotalBalance: string;
    totalBalanceInDollar: number;
    formattedBankBalance: string;
    formattedFundBalance: string;
    fundBalanceUOM: string;
    bankBalanceUOM: string;
}



export interface DebitCreditBalanceData {
    totalCreditAmount: number;
    formattedTotalCreditAmount: string;
    totalCreditAmountUOM: string;
    totalDebitAmount: number;
    formattedTotalDebitAmount: string;
    totalDebitAmountUOM: string;
    balanceAmount: number;
    formattedBalanceAmount: string;
    balanceAmountUOM: string;
}

export interface NearDueChequesData {
    payableChequesQuantity: number;
    payableChequesAmount: number;
    formattedPayableChequesAmount: string;
    payableChequesAmountUOM: string;
    receivableChequesQuantity: number;
    receivableChequesAmount: number;
    formattedReceivableChequesAmount: string;
    receivableChequesAmountUOM: string;
    allChequesBalanceAmount: number;
    formattedAllChequesBalanceAmount: string;
    allChequesBalanceAmountUOM: string;
    bankBalance: number;
    formattedBankBalance: string;
    bankBalanceUOM: string;
}

export interface SalesRevenueApiItem {
    salesAmount: number;
    formattedSalesAmount: string;
    salesAmountUOM: string;
    salesType: string;
    salesChangePercent: number;
    salesChangePrice: number;
    formattedSalesChangePrice: string;
    salesChangePriceUOM: string;
    revenueAmount: number;
    formattedRevenueAmount: string;
    revenueAmountUOM: string;
    revenueType: string;
    revenueChangePercent: number;
    revenueChangePrice: number;
    formattedRevenueChangePrice: string;
    revenueChangePriceUOM: string;
    dateType: string;
}

export interface SalesRevenueTransformedItem {
    salesAmount: number;
    formattedSalesAmount: string;
    salesAmountUOM: string;
    salesType: string;
    salesChangePercent?: string;
    salesChangePrice: number;
    formattedSalesChangePrice: string;
    salesChangePriceUOM: string;
    revenueAmount: number;
    formattedRevenueAmount: string;
    revenueAmountUOM: string;
    revenueType: string;
    revenueChangePercent?: string;
    revenueChangePrice: number;
    formattedRevenueChangePrice: string;
    revenueChangePriceUOM: string;
    dateType: string;
}

export interface SalesRevenueResult {
    today?: SalesRevenueTransformedItem;
    yesterday?: SalesRevenueTransformedItem;
}


export interface IDynamicCards {
    title: string,
    value: number | string,
    unit: string,
    salesChangePercent?: string,
    salesType?: string
}

export interface ITopNMostSoldProduct {
    productCode: string;
    productName: string;
    soldQuantity: number;
    soldPrice: number;
    productAvailableQuantity: number;
    mainGroupName: string;
    sideGroupName: string;
    formattedSoldPrice: string;
    soldPriceUOM: string;
    id: string;
}

export interface ITopSellingProducts {
    topNMostProductsByPrices: ITopNMostSoldProduct[];
    topNMostProductsByQuantity: ITopNMostSoldProduct[];
}

export interface ITopNMostRevenuableProduct {
    productName: string;
    productCode: string;
    salesQuantity: number;
    salesRevenuAmount: number;
    formattedSalesRevenuAmount: string;
    salesRevenuAmountUOM: string;
    revenuPercentage: number;
    purchaseAmount: number;
    formattedPurchaseAmount: string;
    purchaseAmountUOM: string;
    saleAmount: number;
    formattedSaleAmount: string;
    saleAmountUOM: string;
}

export interface ITopRevenuableProduct {
    topNMostRevenuableProducts: ITopNMostRevenuableProduct[];
    topNMostRevenuableProductsByRevenuPercentage: ITopNMostRevenuableProduct[];
}

export interface ExchangeRateItem {
    title: string;
    name: string;
    price: string;
    rateOfChange: string;
    category: string;
    highestRate: string;
    lowestRate: string;
    sourceCreated: string | Date;
}
export interface ExchangeRateData {
    exchangeRateItem: ExchangeRateItem[];
}

export interface ICurrencyData {
    name: string,
    title: string,
    price: string,
    time: string,
    rateOfChange: number
}

export interface ICardsData {
    icon: string
    path: string
    salesChangePercent?: string
    salesType?: string 
    title: string
    unit: string
    value: string,
    dateType?:string
}