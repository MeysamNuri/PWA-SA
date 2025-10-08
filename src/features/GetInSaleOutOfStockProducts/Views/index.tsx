import React from 'react';
import MainCard from '@/core/components/MainCard/MainCard';
import { Box, useTheme } from '@mui/material';
import AjaxLoadingComponent from '@/core/components/ajaxLoadingComponent';
import getInSaleOutOfStockProductsHooks from '../Hooks/getInSaleOutOfStockProducts';
import InnerPageHeader from '@/core/components/innerPagesHeader';

const GetInSaleOutOfStockProductsView: React.FC = () => {
    const theme = useTheme();
    const {
        setExpandedCard,
        expandedCard,
        sortedProducts,
        isPending,
        isError,
        products,
    } = getInSaleOutOfStockProductsHooks();

    if (isPending) return <AjaxLoadingComponent mt={2} />;
    if (isError) return <Box textAlign="center" mt={4}>خطا در دریافت اطلاعات</Box>;
    if (!products.length) return <Box textAlign="center" mt={4}>کالایی پرفروش موجود نیست</Box>;

    return (
        <Box sx={{ mx: "auto", bgcolor: theme.palette.background.default, minHeight: "100vh", borderRadius: 3}}>

            <InnerPageHeader title="کالا های پرفروش ناموجود" path="/home" />

            {sortedProducts.map((item, idx) => (
                <Box key={item.productCode} mb={2}>
                    <MainCard
                        headerTitle={item.productName}
                        headerValue={item.needQuantity}
                        headerUnit="عدد"
                        isCollapsible={true}
                        isExpanded={expandedCard === idx}
                        onToggle={() => setExpandedCard(expandedCard === idx ? null : idx)}
                        rows={[
                            { type: 'section', title: 'موجودی', valueColor: theme.palette.error.main, value: 0 },
                            { title: 'کسری', value: item.needQuantity, unit: 'عدد', rowSize: 12 },
                            { title: 'فعلی', value: item.exist, unit: 'عدد', rowSize: 6 },
                            { title: 'فروخته', value: item.salesQuantity, unit: 'عدد', rowSize: 6 },
                            { type: 'section', title: 'قیمت', valueColor: theme.palette.error.main, value: 0 },
                            { title: 'قیمت خرید', value: item.purchasePrice, unit: 'تومان', rowSize: 12 },
                            { title: 'قیمت فروش', value: item.salesUnitPrice, unit: 'تومان', rowSize: 12 },
                            { title: 'میانگین فروش', value: item.averageSalesUnitPrice, unit: 'تومان', rowSize: 12 },
                        ]}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default GetInSaleOutOfStockProductsView;
