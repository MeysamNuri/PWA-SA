
type introAppSteps = {
    element: string,
    intro: string
}

export const introAppList: introAppSteps[] = [
    {
        element: '#salesrevenue', // must match an element’s id in your JSX
        intro: "مشاهده فروش کل دیروز و امروز فروشنده",
    },
    {
        element: '#availablefunds',
        intro: 'مشاهده موجودی کل صندوق و بانک',
    },

    {
        element: '#debitcredit',
        intro: 'مشاهده مبالغ بدهکار و بستانکار',
    },
    {
        element: '#cheques',
        intro: 'مشاهده وضعیت چک های دریافتی و پرداختی',
    },
    {
        element: '#topNMostsoldproducts',
        intro: 'گزارش پرفروش ترین کالاها بر اساس مبلغ و تعداد',
    },
    {
        element: '#topNMostrevenuableproducts',
        intro: 'گزارش پر سودترین کالاها بر اساس مبلغ و درصد',
    },

    {
        element: '#topSeller',
        intro: 'مشاهده جدول فروشندگان برتر',
    },

    {
        element: '#topCustomer',
        intro: 'مشاهده جدول مشتریان برتر',
    },
    {
        element: '#currency',
        intro: 'مشاهده آخرین وضعیت قیمت های بازار ارز و طلا',
    },
    {
        element: '#unsettledinvoices',
        intro: 'مشاهده فاکتور های تسویه نشده',
    },
]