import InnerPageHeader from "@/core/components/innerPagesHeader";
import { Box, useTheme } from "@mui/material";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
import RenderChequesList from "../Components/renderedChequeList";
import RenderSummaryCard from "../Components/renderSummaryCard";
import useDetailChequesHooks from "../Hooks/detailsChequesHooks";

export default function ChequesDetailsView() {
    const theme = useTheme();
    const { text,
        nearDueChequesPending,
        totalData,
        isReceivable,
        chequeStatus,
        nearDueChequesDetailsData,
        setExpandedCard,
        expandedCard
    } = useDetailChequesHooks()

    if (nearDueChequesPending) return <AjaxLoadingComponent mt={20} />;


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: theme.palette.background.default,
            }}
        >
            <InnerPageHeader
                title={chequeStatus === 'Receivable' ?
                    " ریز چک های دریافتی " + text

                    :
                    " ریز چک های پرداختی " + text
                }
                path={chequeStatus === "Receivable" ? '/cheques/receivable-cheques' : '/cheques/payable-cheques'}
            />
            <Box sx={{ flex: 1, py: 2 }}>
                <RenderSummaryCard totalData={totalData} isReceivable={isReceivable} />
                <RenderChequesList expandedCard={expandedCard} setExpandedCard={setExpandedCard}  nearDueChequesDetailsData={nearDueChequesDetailsData} />
            </Box>
        </Box>
    );
}
