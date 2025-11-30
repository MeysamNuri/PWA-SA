
import { Box, useTheme } from "@mui/material";
import MainCard from "@/core/components/MainCard/MainCard";
import TotalCard from "@/core/components/TotalCard";
import ToggleTab from "@/core/components/ToggleTab";
import React from "react";
import useDebitCreditCardHooks from "../Hooks/debitCredit";
import InnerPageHeader from "@/core/components/innerPagesHeader";
import CardFooter from "../Components/cardFooter";
import ProfitNotFound from "@/core/components/profitNotFound";
import { NumberConverter } from "@/core/helper/numberConverter";

const DebitCreditView = () => {
    const {palette} = useTheme();
    const {
        setExpandedCard,
        setSelectedTab,
        selectedTab,
        totals,
        list,
        expandedCard,
        tabList,
        infoOBJ
    } = useDebitCreditCardHooks()


    return (
        <Box sx={{ mx: "auto", bgcolor: palette.background.default, minHeight: "100vh", borderRadius: 3 }}>
            <InnerPageHeader title="طرف حساب ها" path="/home" infoIcon={infoOBJ} />

            <Box sx={{ background: palette.background.default, px: 1.5 }}>
                <ToggleTab
                    value={selectedTab}
                    onChange={setSelectedTab}
                    options={tabList}
                    variant="tab"
                />
            </Box>
            <TotalCard
                rows={[
                    {
                        title: "جمع بدهکاران", value: totals?.Data?.formattedTotalDebitAmount || 0, color: palette.error.main, unit: totals?.Data?.totalDebitAmountUOM
                    },
                    { title: "جمع بستانکاران", value: totals?.Data?.formattedTotalCreditAmount || 0, color: palette.success.main, unit: totals?.Data?.totalCreditAmountUOM }
                ]}
            />
            <Box>
                {list && list.length > 0 ? (
                    list.map((item, idx) => {
                        return (
                            <React.Fragment key={item.code}>
                                <Box >
                                    <MainCard
                                        headerTitle={item.name}
                                        headerValue={NumberConverter.formatCurrency(Math.floor(Number(item.price) / 10))}
                                        headerUnit="تومان"
                                        isCollapsible={true}
                                        isExpanded={expandedCard === idx}
                                        shownRows={1}
                                        onToggle={() => setExpandedCard(expandedCard === idx ? null : idx)}
                                        rows={
                                            [
                                                { title: "کد طرف حساب", value: item.customerCode },
                                                { title: "کد حساب", value: item.code },
                                                { title: "جمع دریافتی", value: NumberConverter.formatCurrency(Math.floor(Number(item.sumBed) / 10)), unit: "تومان", valueColor: palette.success.main },
                                                { title: "جمع پرداختی", value: NumberConverter.formatCurrency(Math.floor(Number(item.sumBes) / 10)), unit: "تومان", valueColor: palette.error.main },
                                            ]

                                        }
                                        footer={<CardFooter item={item} />}
                                    />
                                </Box>
                            </React.Fragment>
                        );
                    })
                ) : (
                    <ProfitNotFound message="داده‌ای برای نمایش وجود ندارد" />
                )}
            </Box>
        </Box>
    );
};

export default DebitCreditView;