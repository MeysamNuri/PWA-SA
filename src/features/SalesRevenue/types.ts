export interface ISalesRevenueReport {
    salesDate: string;   
    salesAmount: number; 
    formattedSalesAmount: string;
    salesAmountUOM: string;
    salesRevenueAmount: number;
    formattedSalesRevenueAmount:string;
}
export interface salesRevenueApi {
    salesRevenueReport: ISalesRevenueReport[];
    totalSalesAmount: number;
    salesAmountUOM: string;
    formattedTotalSalesAmount: string;
    totalSalesAmountUOM: string;
    totalSalesRevenueAmount: number;
    formattedTotalSalesRevenueAmount: string;
    totalSalesRevenueAmountUOM: string;
}
