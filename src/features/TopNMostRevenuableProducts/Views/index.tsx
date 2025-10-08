import React from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Skeleton,
    useTheme
} from "@mui/material";

import TotalCard from "@/core/components/TotalCard";
import { CustomToggleTab } from "@/core/components/ToggleTab";
import DateFilter from "@/core/components/DateFilter";
import { useTopNMostRevenuableProductsHook, DateEnum } from "../Hooks/topNMostRevenuable";
import { NumberConverter } from "@/core/helper/numberConverter";
import InnerPageHeader from "@/core/components/innerPagesHeader";
import RenderProductCard from "../Components/productCard";

const TopNMostRevenuableProductsView: React.FC = () => {
    const theme = useTheme();
    const {
        topRevenuableProducts,
        loading,
        error,
        selectedChip,
        filterByRevenue,
        totalRevenue,
        totalProfit,
        handleChipClick,
        handleFilterChange
    } = useTopNMostRevenuableProductsHook();

 
    return (
        <Box sx={{
            mx: "auto",
            bgcolor: theme.palette.background.default,
            minHeight: "100vh",
            borderRadius: 3
        }}>
            
            <Box>
                <InnerPageHeader title="پرسودترین کالاها" path="/home" />
                <CustomToggleTab
                    value={filterByRevenue ? "revenue" : "percentage"}
                    onChange={(value) => handleFilterChange(value === "revenue")}
                    options={[
                        { label: "مبلغی", value: "revenue" },
                        { label: "درصدی", value: "percentage" }
                    ]}
                    variant="filter"
                />

                <DateFilter
                    value={selectedChip}
                    onChange={(value) => {
                        // Convert string value to DateEnum
                        const dateValue = value as string;
                        if (dateValue === "1") handleChipClick(DateEnum.Yesterday);
                        else if (dateValue === "7") handleChipClick(DateEnum.Last7Days);
                        else if (dateValue === "30") handleChipClick(DateEnum.Last30Days);
                    }}
                    options={[
                        { label: "دیروز", value: "1" },
                        { label: "۷ روز گذشته", value: "7" },
                        { label: "۳۰ روز گذشته", value: "30" }
                    ]}
                    align="right"
                />

                
            </Box>

            {!loading && !error && topRevenuableProducts.length > 0 && (
                <Box sx={{ px: { xs: 1, sm: 2 }, mt: 2, position: "sticky", top: 0, zIndex: 10 }}>
                    <TotalCard
                        rows={[
                            {
                                title: "مجموع مبلغ فروش",
                                value: NumberConverter.latinToArabic(totalRevenue.toLocaleString()),
                                unit: "تومان"
                            },
                            {
                                title: filterByRevenue ? "مجموع سود" : "میانگین درصد سود",
                                value: filterByRevenue
                                    ? NumberConverter.latinToArabic(totalProfit.toLocaleString())
                                    : NumberConverter.latinToArabic((topRevenuableProducts.reduce((sum: number, p: any) => sum + p.revenuPercentage, 0) / topRevenuableProducts.length).toFixed(2)),
                                unit: filterByRevenue ? "تومان" : "%"
                            }
                        ]}
                    />
                </Box>
            )}

            <Box sx={{ px: { xs: 1, sm: 2 }, mt: 2 }}>
                {loading ? (
                    <Box sx={{ textAlign: "center", my: 3 }}>
                        <CircularProgress />
                        <Box sx={{ my: 2 }}>
                            {[...Array(5)].map((_, index) => (
                                <Skeleton key={index} variant="rectangular" height={80} sx={{ my: 1, borderRadius: 2 }} />
                            ))}
                        </Box>
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center">{error}</Typography>
                ) : topRevenuableProducts.length === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                            src={`${import.meta.env.BASE_URL}images/salesnotfound.png`}
                            style={{
                                width: '100%',
                                maxWidth: '311px',
                                height: 'auto',
                                marginTop: '128px'
                            }}
                            alt="فروشی ثبت نشده است"
                        />
                        <Typography align="center" margin="28px" color={theme.palette.text.secondary} fontSize="16px">
                            فروشی ثبت نشده است
                        </Typography>
                    </Box>
                ) : (
                    topRevenuableProducts.map((product: any, index: number) => 
                        <RenderProductCard key={product.id || index} product={product} index={index} filterByRevenue={filterByRevenue} />
                    )
                  
                )}
            </Box>
        </Box>
    );
};

export default TopNMostRevenuableProductsView;