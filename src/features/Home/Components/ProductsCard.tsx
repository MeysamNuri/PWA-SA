import {
    Box,
    Typography,
    useTheme
} from '@mui/material';
import Card from '@mui/material/Card';
import { NumberConverter } from '@/core/helper/numberConverter';
import type { ITopNMostSoldProduct, ITopNMostRevenuableProduct } from '../types';


type Product = ITopNMostSoldProduct | ITopNMostRevenuableProduct;

function isSoldProduct(p: Product): p is ITopNMostSoldProduct {
    return (p as ITopNMostSoldProduct).soldQuantity !== undefined;
}
function ProductCard({
    product,
    subtitle,
    isPrice,
    onCardClick,
}: {
    product?: Product;
    subtitle: string;
    isPrice: boolean;
    onCardClick: () => void;
}) {
    const theme = useTheme();

    return (
        <Card
            onClick={onCardClick}
            elevation={0}
            sx={{
                width: { xs: '100%'},
                backgroundColor: theme.palette.grey[100],
                borderRadius: "8px",
                padding: "4px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                cursor: "pointer",
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[100],
                    transform: 'translateY(-2px)',
                }
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    padding: "4px",
                    fontSize: "13px",
                    fontWeight: 400,
                    textAlign: "right",
                    color: theme.palette.text.primary,
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "8px",
                }}
            >
                {subtitle}
                {isPrice ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src="/images/Homepageicons/price.png"
                            alt="price icon"
                            style={{ width: "20px", height: "20px" }}
                        />
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src="/images/Homepageicons/amount.png"
                            alt="amount icon"
                            style={{ width: "20px", height: "20px" }}
                        />
                    </Box>
                )}
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    width: "100%",
                    padding: "4px",
                    textAlign: "right",
                    
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        fontSize: "13px",
                        color: theme.palette.text.primary,
                        fontWeight: 400,
                        marginTop: "2px",
                        lineHeight: "120%",
                        height: "auto",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                     
                    }}
                >
                    {product ? product.productName : "—"}
                </Typography>
                {product ? (
                    <>
                        <Box display="flex" justifyContent="flex-start" alignItems="center" mt={0.5}>
                            <Typography sx={{ fontSize: "12px", fontWeight: 400, color: theme.palette.text.secondary, ml: "5px" }}>
                                عدد
                            </Typography>
                            <Typography sx={{ fontSize: "16px", fontWeight: 400, color: theme.palette.text.primary }}>
                                {isSoldProduct(product)
                                    ? NumberConverter.latinToArabic(product.soldQuantity.toLocaleString())
                                    : NumberConverter.latinToArabic(product.salesQuantity?.toLocaleString() ?? '۰')}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="flex-start" alignItems="center">
                            <Typography sx={{ fontSize: "12px", fontWeight: 400, color: theme.palette.text.secondary, ml: "5px" }}>
                                {isSoldProduct(product)
                                    ? product.soldPriceUOM
                                    : product.salesRevenuAmountUOM}
                            </Typography>
                            <Typography sx={{ fontSize: "16px", fontWeight: 400, color: theme.palette.text.primary }}>
                                {isSoldProduct(product)
                                    ? NumberConverter.latinToArabic(product.formattedSoldPrice)
                                    : NumberConverter.latinToArabic(product.formattedSalesRevenuAmount)}
                            </Typography>
                        </Box>
                    </>
                ) : (
                    <Typography sx={{ fontSize: "0.6rem", color: theme.palette.text.disabled }}>
                        داده‌ای برای نمایش وجود ندارد.
                    </Typography>
                )}
            </Box>
        </Card>
    );
}
export  default ProductCard;