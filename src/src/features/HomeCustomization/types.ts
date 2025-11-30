export interface PageNameItem {
    pageId: string;
    pageName: string;
}

export interface GetPageNameResponse {
    RequestUrl: string;
    Data: PageNameItem[];
    Message: string | null;
    Status: boolean;
    HttpStatusCode: number;
}

export interface HomeCustomizationItem {
    pageId: string;
    pageName: string;
    persianTitle: string;
    isEnabled: boolean;
    sort: number;
}
export interface DisplaySettingItem {
    pageName: string;
    sort: number;
}

export interface UpdateDisplaySettingItem {
    PageId: string;
    IsActive: boolean;
    Sort: number;
}

export interface UpdateDisplaySettingRequest {
    DisplaySetting: UpdateDisplaySettingItem[];
}


export const PAGE_NAME_MAPPING: Record<string, string> = {
    'dynamicCard': 'کارت های پویا',
    'salesrevenue': 'فروش امروز و دیروز',
    'availablefunds': 'مانده بانک و صندوق',
    'debitcredit': 'بدهکاران و بستانکاران',
    'cheques': 'چک های دریافتی و پرداختی',
    'unsettledinvoices': 'فاکتور ها تسویه نشده',
    'topNMostsoldproducts': 'محصولات پرفروش',
    'topNMostrevenuableproducts': 'محصولات پرسود',
    'topcustomers': 'مشتریان برتر',
    'topsellers': 'فروشندگان برتر',
    'currencyrates': 'تابلو زنده قیمت ها'
};
