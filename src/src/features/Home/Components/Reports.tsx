import {
    Box,
    Typography,
    useTheme
} from '@mui/material';
import InfoDialogs from '@/core/components/infoDialog';
import { Icon } from '@/core/components/icons';
import { useThemeContext } from '@/core/context/useThemeContext';
import useTopProductsData from '../Hooks/topProductsHooks';
import DateFilterToggleTab from '@/core/components/dateFilterToggleTab';
import { useHomeCustomizationSettings } from '@/features/HomeCustomization/Hooks/useHomeCustomizationSettings';
import ReportDetails from './ReportDetails';



export default function Reports({ id }: { id: string }) {
    const { palette } = useTheme();
    const { isDarkMode } = useThemeContext();
    const { isComponentEnabled } = useHomeCustomizationSettings();
    const {
        selectedChip,
        handleDaysChange,
        handleSoldProductClick,
        handleRevenuableProductClick,
        handleClickOpen,
        handleClose,
        open,
        topSoldByQuantity,
        topSoldByPrice,
        topRevenuableByPercent,
        topRevenuableByAmount,
        options
    } = useTopProductsData();

    // Check which components are enabled
    const isTopSoldEnabled = isComponentEnabled('topNMostsoldproducts');
    const isTopRevenuableEnabled = isComponentEnabled('topNMostrevenuableproducts');

    return (
        <Box
            sx={{

                mb: 2,
                background: palette.background.paper,
                borderRadius: 2,
                p: { xs: 1, sm: 1 },
                border: `1px solid ${palette.divider}`,
            }}
        >
            <Box
                display="flex"
                alignItems="center"

                justifyContent="space-between"
                mb={1}
                sx={{
                    flexDirection: "row",

                }}
            >
                <Box sx={{ direction: "rtl" }}>
                    <DateFilterToggleTab
                        options={options}
                        onChange={handleDaysChange}
                        value={selectedChip} />
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h5" fontWeight={500} fontSize='16px' sx={{ textAlign: 'right', color: palette.text.primary }}>
                        {isTopSoldEnabled && isTopRevenuableEnabled
                            ? 'گزارش کالاها'
                            : isTopSoldEnabled
                                ? 'پرفروش ترین کالاها'
                                : 'پرسودترین کالاها'
                        }
                    </Typography>
                    <Icon
                        name="soldproducts"
                        isDarkMode={isDarkMode}
                        width={24}
                        height={24}
                    />
                </Box>
            </Box>
            <Box borderBottom={1} borderColor={palette.divider} mb={2} />

            {/* Top Sold Products Section */}
            {isTopSoldEnabled && id === "topNMostsoldproducts" && (
                <Box id="topNMostsoldproducts" >
                    <ReportDetails
                        handleClickOpen={handleClickOpen}
                        handleSoldProductClick={handleSoldProductClick}
                        topSoldByQuantity={topSoldByQuantity}
                        topSoldByPrice={topSoldByPrice}
                        isTopSoldProducts={true}

                    />
                </Box>
            )}

            {/* Top Revenuable Products Section */}
            {isTopRevenuableEnabled && id === "topNMostrevenuableproducts" && (
                <Box id="topNMostrevenuableproducts" >
                    <ReportDetails
                        handleClickOpen={handleClickOpen}
                        handleRevenuableProductClick={handleRevenuableProductClick}
                        topRevenuableByPercent={topRevenuableByPercent}
                        topRevenuableByAmount={topRevenuableByAmount}
                        isTopSoldProducts={false}
                    />
                </Box>
            )}
            <InfoDialogs open={open} handleClose={handleClose} />

        </Box>
    );
}
