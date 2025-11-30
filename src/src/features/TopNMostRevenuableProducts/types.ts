export interface ITopNMostRevenuableProducts {
    productName: string;
    productCode: string;
    salesQuantity: number;
    salesRevenuAmount: number;
    formattedSalesRevenuAmount: string;
    salesRevenuAmountUOM: string;
    revenuPercentage: number;
    purchaseAmount:number;
    formattedPurchaseAmount: string;
    purchaseAmountUOM: string;
    saleAmount:number;
    formattedSaleAmount: string;
    saleAmountUOM: string;
}
export interface TopRevenuableProductApi {
    topNMostRevenuableProducts: ITopNMostRevenuableProducts[];
    topNMostRevenuableProductsByRevenuPercentage: ITopNMostRevenuableProducts[];
}
