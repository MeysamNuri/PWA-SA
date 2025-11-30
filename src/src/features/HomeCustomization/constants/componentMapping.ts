// Mapping between API page names and home component identifiers
export const COMPONENT_MAPPING = {

    'salesrevenue': 'dynamicCards',
    'availablefunds': 'dynamicCards', 
    'debitcredit': 'dynamicCards',
    'cheques': 'dynamicCards',
    
    'unsettledinvoices': 'unsettledInvoices',
    
    'topNMostsoldproducts': 'reports',
    'topNMostrevenuableproducts': 'reports',
    
    'topcustomers': 'topCustomers',
    'topsellers': 'topSellers',
    
    'currencyrates': 'currencies'
} as const;

export const CARD_TYPE_MAPPING = {
    'salesrevenue': ['فروش امروز', 'فروش دیروز'],
    'availablefunds': ['مانده صندوق', 'مانده بانک'],
    'debitcredit': ['بستانکاران', 'بدهکاران'],
    'cheques': ['چک‌های پرداختی', 'چک‌های دریافتی']
} as const;

export type ComponentType = typeof COMPONENT_MAPPING[keyof typeof COMPONENT_MAPPING];
export type CardType = keyof typeof CARD_TYPE_MAPPING;
