import {
    Box,
    Typography,

    IconButton,
    useTheme,

} from '@mui/material';
import { Icon } from '@/core/components/icons';

import ProductCard from './ProductsCard';
import { useThemeContext } from '@/core/context/useThemeContext';
import type { ITopNMostSoldProduct } from '../types';
interface IReportProps {

    handleClickOpen: (value: {
        path: string,
        title: string
    }) => void;
    topSoldByQuantity?: ITopNMostSoldProduct,
    topSoldByPrice?: ITopNMostSoldProduct,
    topRevenuableByAmount?: any,
    topRevenuableByPercent?: any,
    handleSoldProductClick?: () => void,
    handleRevenuableProductClick?:()=>void
    isTopSoldProducts: boolean
}

const ReportDetails = ({
    handleClickOpen,
    topSoldByQuantity,
     topSoldByPrice,
    handleSoldProductClick,
    handleRevenuableProductClick,
    isTopSoldProducts,
    topRevenuableByPercent,
    topRevenuableByAmount }: IReportProps) => {
    const { palette } = useTheme();
    const { isDarkMode } = useThemeContext();

    return (

        <>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={.5}>
                <IconButton
                    onClick={() => handleClickOpen({
                        path: isTopSoldProducts ? ('TopNMostSoldProductsCommand') : ('TopNMostRevenuableProductsCommand'),
                        title: isTopSoldProducts ? ('پرفروش ترین کالاها') : ('پرسودترین کالاها')
                    })}
                    size="small"
                    sx={{
                        padding: '4px',
                        color: palette.text.secondary,
                        '&:hover': {
                            backgroundColor: palette.action.hover,
                            color: palette.text.primary,
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Icon name="infodialoghome" isDarkMode={isDarkMode} width={20} height={20} />
                </IconButton>

                <Typography
                    variant="subtitle1"
                    fontWeight={400}
                    fontSize="14px"
                    sx={{ textAlign: 'right', color: palette.primary.main }}
                >

                    {
                        isTopSoldProducts ? "پرفروش ترین کالاها" : "پرسودترین کالاها"
                    }
                </Typography>
            </Box>
            
                <Box display="flex" flexDirection="row" gap={1} flexWrap="nowrap" justifyContent="space-around" >
                    <ProductCard
                        product={isTopSoldProducts ? topSoldByQuantity : topRevenuableByPercent}
                        isPrice={false}
                        subtitle={isTopSoldProducts ? ("بر اساس تعداد") : ("بر اساس درصد")}
                        onCardClick={isTopSoldProducts?handleSoldProductClick:handleRevenuableProductClick}
                        handleClickOpen={handleClickOpen}
                        title={isTopSoldProducts ? ("پرفروش ترین کالاها") : ("پرسودترین کالاها")}
                        commandName={isTopSoldProducts ? ("TopNMostSoldProductsCommand") : ("TopNMostRevenuableProductsCommand")}
                    />
                    <ProductCard
                        product={isTopSoldProducts ? topSoldByPrice : topRevenuableByAmount}
                        isPrice
                        subtitle="بر اساس مبلغ"
                        onCardClick={isTopSoldProducts?handleSoldProductClick:handleRevenuableProductClick}
                        handleClickOpen={handleClickOpen}
                        title={isTopSoldProducts ? ("پرفروش ترین کالاها") : ("پرسودترین کالاها")}
                        commandName={isTopSoldProducts ? ("TopNMostSoldProductsCommand") : ("TopNMostRevenuableProductsCommand")}
                    />
                </Box>
          
        </>
    )
}
export default ReportDetails