import {
    Box,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
    useTheme
} from '@mui/material';
import useTopProductsData from '../Hooks/topProductsHooks';
import ProductCard from './ProductsCard'


export default function Reports() {
    const theme = useTheme();
    const {
        selectedChip,
        handleDaysChange,
        handleSoldProductClick,
        handleRevenuableProductClick,
        loading,
        topSoldByQuantity,
        topSoldByPrice,
        topRevenuableByPercent,
        topRevenuableByAmount
    } = useTopProductsData();

    return (
        <Box
            sx={{
                mt: 1,
                mb: 1,
                mx: .5,
                background: theme.palette.background.paper,
                borderRadius: 2,
                p: { xs: 2, sm: 3 },
                border: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
                sx={{
                    flexDirection: "row"
                }}
            >

                <ToggleButtonGroup
                    value={selectedChip}
                    exclusive
                    onChange={handleDaysChange}
                    sx={{
                        background: 'transparent',
                        borderRadius: "8px",
                        height: "24px",
                        width: "180px",
                        padding: "2px",
                        '& .MuiToggleButton-root': {
                            color: theme.palette.mode === 'dark' ? '#FD5C63' : '#E42628',
                            backgroundColor: theme.palette.mode === 'dark' ? '#242424' : '#FFFFFF',
                            fontWeight: 500,
                            fontSize: "12px",
                            border: 'none',
                            borderRadius: "6px",
                            margin: "0px",
                            minHeight: "20px",
                            transition: 'all 0.2s ease-in-out',
                            '&.Mui-selected': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#0D0D0D' : '#ECEFF1',
                                color: theme.palette.mode === 'dark' ? '#E2E6E9' : '#565A62',
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#0D0D0D' : '#ECEFF1',
                                }
                            },
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#F5F5F5',
                            }
                        }
                    }}
                >
                    <ToggleButton 
                        value="Last7Days" 
                        sx={{ 
                            width: "90px", 
                            direction: "rtl"
                        }}
                    > 
                        ۷ روز گذشته
                    </ToggleButton>
                    <ToggleButton 
                        value="Yesterday" 
                        sx={{ 
                            width: "90px"
                        }}
                    >
                        دیروز
                    </ToggleButton>
                </ToggleButtonGroup>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h5" fontWeight={500} fontSize='16px' sx={{ textAlign: 'right', color: theme.palette.text.primary }}>
                        گزارش کالاها
                    </Typography>
                    <img
                        src={"/images/Homepageicons/soldproducts.png"}
                        alt="soldproducts icon"
                        style={{ width: "24px", height: "24px" }}
                    />
                </Box>
            </Box>
            <Box borderBottom={1} borderColor={theme.palette.divider} mb={2} />

            <Typography
                variant="subtitle1"
                fontWeight={400}
                fontSize="14px"
                mb={.5}
                sx={{ textAlign: 'right', color: theme.palette.primary.main }}
            >
                پرفروش ترین کالاها
            </Typography>
            {loading ? (
                <CircularProgress
                    size={28}
                    sx={{ display: 'block', mx: 'auto', my: 3, color: theme.palette.primary.main }}
                />
            ) : (
                <Box display="flex" flexDirection="row" gap={1} flexWrap="nowrap" justifyContent="space-around" >
                    <ProductCard
                        product={topSoldByQuantity}
                        isPrice={false}
                        subtitle="بر اساس تعداد"
                        onCardClick={handleSoldProductClick}
                    />
                    <ProductCard
                        product={topSoldByPrice}
                        isPrice
                        subtitle="بر اساس مبلغ"
                        onCardClick={handleSoldProductClick}
                    />
                </Box>
            )}

            <Typography
                variant="subtitle1"
                fontWeight={400}
                fontSize="14px"
                mt={2}
                mb={.5}
                sx={{ textAlign: 'right', color: theme.palette.primary.main }}
            >
                پرسودترین کالاها
            </Typography>
            {loading ? (
                <CircularProgress
                    size={28}
                    sx={{ display: 'block', mx: 'auto', my: 3, color: theme.palette.primary.main }}
                />
            ) : (
                <Box display="flex" flexDirection="row" gap={1} flexWrap="nowrap" justifyContent="space-around">
                    <ProductCard
                        product={topRevenuableByPercent}
                        subtitle="بر اساس درصد"
                        isPrice={false}
                        onCardClick={handleRevenuableProductClick}
                    />
                    <ProductCard
                        product={topRevenuableByAmount}
                        subtitle="بر اساس مبلغ"
                        isPrice
                        onCardClick={handleRevenuableProductClick}
                    />
                </Box>
            )}
        </Box>
    );
}
