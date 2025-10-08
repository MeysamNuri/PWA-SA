
import { Box, useTheme } from "@mui/material";
import MainCard from "@/core/components/MainCard/MainCard";
import TotalCard from "@/core/components/TotalCard";
import ToggleTab from "@/core/components/ToggleTab";
import React from "react";
import useDebitCreditCardHooks from "../Hooks/debitCredit";
import InnerPageHeader from "@/core/components/innerPagesHeader";
import CardFooter from "../Components/cardFooter";
import ProfitNotFound from "@/core/components/profitNotFound";

const DebitCreditView = () => {
    const theme = useTheme();
    const {
        setExpandedCard,
        setSelectedTab,
        selectedTab,
        totals,
        list,
        expandedCard,
        tabList
    } = useDebitCreditCardHooks()


    return (
        <Box sx={{ mx: "auto", bgcolor: theme.palette.background.default, minHeight: "100vh", borderRadius: 3 }}>
            <InnerPageHeader title="طرف حساب ها" path="/home" />

            <Box sx={{ background: theme.palette.background.default, px:1.5 }}>
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
                        title: "جمع بدهکاران", value: totals?.Data?.formattedTotalDebitAmount || 0, color: theme.palette.error.main, unit: "تومان"
                    },
                    { title: "جمع بستانکاران", value: totals?.Data?.formattedTotalCreditAmount || 0, color: theme.palette.success.main, unit: "تومان" }
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
                                        headerValue={item.price}
                                        headerUnit="تومان"
                                        isCollapsible={true}
                                        isExpanded={expandedCard === idx}
                                        shownRows={1}
                                        onToggle={() => setExpandedCard(expandedCard === idx ? null : idx)}
                                        rows={
                                            [
                                                { title: "کد طرف حساب", value: Number(item.customerCode), unit: "" },
                                                { title: "کد حساب", value: Number(item.code), unit: "" },
                                                { title: "جمع دریافتی", value: Number(item.sumBed), unit: "تومان", valueColor: theme.palette.success.main },
                                                { title: "جمع پرداختی", value: Number(item.sumBes), unit: "تومان", valueColor: theme.palette.error.main },
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