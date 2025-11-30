export interface TopSellingProductsApi {
    productCode: string;
    productName: string;
    soldQuantity: number;
    soldPrice: number;
    productAvailableQuantity: number;
    mainGroupName: string;
    sideGroupName: string;
    formattedSoldPrice:string;
    soldPriceUOM: string;
    id: string;
}

export interface ITopNMostSoldProducts {
    topNMostProductsByPrices: TopSellingProductsApi[];
    topNMostProductsByQuantity: TopSellingProductsApi[];
}