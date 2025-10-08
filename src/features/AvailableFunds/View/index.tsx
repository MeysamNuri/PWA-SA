import {
    Box,
    Grid,
} from "@mui/material";
import InnerPageHeader from "@/core/components/innerPagesHeader";
import PieChartSection from "../Components/pieChartSection";
import AvailableFundsViewHooks from "../Hooks/availableFundsHooks";
import TitleTotalValue from "../Components/titleTotalValue";
import { valueTypeEnum } from "../types";
import ToggleTab from "@/core/components/ToggleTab";
import InitialItemsSection from "../Components/initialItems";
import RemainingItemsection from "../Components/remainItems";

export default function AvailableFundsView() {


    const {
        palette,
        tabList,
        currencyTab,
        handleCurrency,
        selectedSegment,
        handlePieClick,
        isDetailsExpanded,
        setIsDetailsExpanded,
        totalAssetValue,
        fundPercentage,
        initialBankItems,
        remainingBankItems,
        bankPercentage,
        remainingFundItems,
        initialFundItems,
        formatedBankDisplay,
        formatedFundDisplay

    } = AvailableFundsViewHooks()


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: palette.background.default
            }}
        >
            <InnerPageHeader
                title={"مانده نقد و بانک"}
                path="/home"
            />
            <Box sx={{ px: 1.5 }}>
                <ToggleTab
                    value={currencyTab}
                    onChange={handleCurrency}
                    options={tabList}
                    variant="tab"
                />
                <Box sx={{ bgcolor: palette.background.paper, borderRadius: 3, p: 1 }}>
                    <TitleTotalValue value={totalAssetValue} valueType={valueTypeEnum.available} currencyTab={currencyTab} />
                    <PieChartSection
                        handlePieClick={handlePieClick}
                        bankPercentage={bankPercentage}
                        formatedBankDisplay={formatedBankDisplay}
                        formatedfundDisplay={formatedFundDisplay}
                        fundPercentage={fundPercentage}
                        selectedSegment={selectedSegment}
                    />
                    <Box sx={{ padding: "10px 15px 15px 15px", mb: 2, borderRadius: "10px", border: `1px solid ${palette.divider}` }}>
                        <TitleTotalValue value={formatedBankDisplay} valueType={valueTypeEnum.bank} currencyTab={currencyTab} />
                        <Grid container alignItems="center">
                            <Grid size={12}>
                                <InitialItemsSection valueType={valueTypeEnum.bank} initialBankItems={initialBankItems} initialFundItems={initialFundItems} />
                                <RemainingItemsection setIsDetailsExpanded={setIsDetailsExpanded} valueType={valueTypeEnum.bank}
                                    isFundDetailsExpanded={isDetailsExpanded}
                                    remainingBankItems={remainingBankItems}
                                    remainingFundItems={remainingFundItems}
                                />

                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ padding: "10px 15px 15px 15px", mb: 2, borderRadius: "10px", border: `1px solid ${palette.divider}` }}>
                        <TitleTotalValue value={formatedFundDisplay} valueType={valueTypeEnum.fund} currencyTab={currencyTab} />
                        <Grid container alignItems="center">
                            <Grid size={12}>
                                <InitialItemsSection valueType={valueTypeEnum.fund} initialBankItems={initialBankItems} initialFundItems={initialFundItems} />
                                <RemainingItemsection setIsDetailsExpanded={setIsDetailsExpanded} valueType={valueTypeEnum.fund} isFundDetailsExpanded={isDetailsExpanded}
                                    remainingBankItems={remainingBankItems}
                                    remainingFundItems={remainingFundItems} />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
