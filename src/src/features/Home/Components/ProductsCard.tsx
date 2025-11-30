import {
    Box,
    Typography,
    useTheme,
} from '@mui/material';
import Card from '@mui/material/Card';
import { NumberConverter } from '@/core/helper/numberConverter';
import type { ITopNMostSoldProduct, ITopNMostRevenuableProduct } from '../types';
import { Icon } from '@/core/components/icons';
import { useThemeContext } from '@/core/context/useThemeContext';


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
    commandName: string,
    title: string,
    onCardClick?: () => void;
    handleClickOpen: (value: {
        path: string,
        title: string
    }) => void;
}) {
    const {palette} = useTheme();
    const { isDarkMode } = useThemeContext();

    return (
        <Box sx={{
            width: '100%',
            position: "relative",
            height: "100%", 
        }}>
            <Card
                onClick={onCardClick}
                elevation={0}
                sx={{
                    padding: "8px",
                    backgroundColor: palette.background.default,
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    cursor: "pointer",
                    border: `1px solid ${palette.divider}`,
                    transition: 'all 0.2s ease-in-out',
                    height: "100%", 
                    minHeight: "120px",

                    '&:hover': {
                        backgroundColor: palette.mode === 'dark' ? palette.grey[800] : palette.grey[100],
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
                        color: palette.text.primary,
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
                            <Icon 
                                name="price" 
                                isDarkMode={isDarkMode}
                                width={20} 
                                height={20} 
                            />
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Icon 
                                name="amount" 
                                isDarkMode={isDarkMode}
                                width={20} 
                                height={20} 
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
                            color: palette.text.primary,
                            fontWeight: 400,
                            marginTop: "2px",
                            lineHeight: "120%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                    
                        }}
                    >
                        {product ? product.productName : "—"}
                    </Typography>
                    {product ? (
                        <>
                            <Box display="flex" justifyContent="flex-start" alignItems="center" mt={0.5}>
                                <Typography sx={{ fontSize: "12px", fontWeight: 400, color: palette.text.secondary, ml: "5px" }}>
                                    عدد
                                </Typography>
                                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: palette.text.primary }}>
                                    {isSoldProduct(product)
                                        ? NumberConverter.latinToArabic(product.soldQuantity.toLocaleString())
                                        : NumberConverter.latinToArabic(product.salesQuantity?.toLocaleString() ?? '۰')}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="flex-start" alignItems="center">
                                <Typography sx={{ fontSize: "12px", fontWeight: 400, color: palette.text.secondary, ml: "5px" }}>
                                    {isSoldProduct(product)
                                        ? product.soldPriceUOM
                                        : product.salesRevenuAmountUOM}
                                </Typography>
                                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: palette.text.primary }}>
                                    {isSoldProduct(product)
                                        ? NumberConverter.latinToArabic(product.formattedSoldPrice)
                                        : NumberConverter.latinToArabic(product.formattedSalesRevenuAmount)}
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        <Typography sx={{ fontSize: "0.6rem", color: palette.text.disabled }}>
                            داده‌ای برای نمایش وجود ندارد.
                        </Typography>
                    )}
                </Box>
            </Card>
        </Box>
    );
}
export default ProductCard;