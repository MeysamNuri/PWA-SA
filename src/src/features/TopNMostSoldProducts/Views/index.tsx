import React from "react";
import {
    Box,
    Typography,
    useTheme
    // IconButton
} from "@mui/material";
import { CustomToggleTab } from "@/core/components/ToggleTab";
import DateFilter from "@/core/components/DateFilter";
import { useTopNMostSoldProductsHook } from "../Hooks/topNMostSold";
import InnerPageHeader from "@/core/components/innerPagesHeader";
import RenderProductCard from "../Components/productCard";
import { DateFilterType } from "@/core/types/dateFilterTypes";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";



const TopNMostSoldProductsView: React.FC = () => {
    const { palette } = useTheme();
    const {
        topSellingProducts,
        loading,
        error,
        selectedChip,
        filterByPrice,
        infoOBJ,
        dateOptions,
        handleChipClick,
        handleFilterChange
    } = useTopNMostSoldProductsHook();

    if (loading) return <AjaxLoadingComponent />;
    return (
        <Box sx={{
            mx: "auto",
            bgcolor: palette.background.default,
            minHeight: "100vh",
            borderRadius: 3
        }}>
            <InnerPageHeader title=" پرفروش‌ ترین کالاها" path="/home" infoIcon={infoOBJ} />
            <Box sx={{ px: 2, pt: 1 }}>
                <CustomToggleTab
                    value={filterByPrice ? "price" : "quantity"}
                    onChange={(value) => handleFilterChange(value === "price")}
                    options={[
                        { label: "مبلغی", value: "price" },
                        { label: "تعدادی", value: "quantity" }
                    ]}
                    variant="filter"
                />
                <DateFilter
                    value={selectedChip}
                    onChange={(value) => handleChipClick(value as DateFilterType)}
                    options={dateOptions}
                    align="right"
                />
            </Box>

            <Box sx={{ px: { xs: 1, sm: 2 }, mt: 2 }}>
                { error ? (
                    <Typography color="error" align="center">{error}</Typography>
                ) : topSellingProducts?.length === 0 ? (
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
                        <Typography align="center" margin="28px" color={palette.text.secondary} fontSize="16px">
                            فروشی ثبت نشده است
                        </Typography>
                    </Box>
                ) : (

                    topSellingProducts.map((product: any, index: number) =>
                        <RenderProductCard key={product.id || index} product={product} index={index} filterByPrice={filterByPrice} />
                    )
                )}
            </Box>
        </Box>
    );
};

export default TopNMostSoldProductsView;