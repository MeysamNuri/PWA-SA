import { Box, Typography, IconButton, Grid, useTheme } from "@mui/material";
import { toPersianNumber } from "@/core/helper/translationUtility";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from 'react-router';
import type { ICardsData } from "../types";

export default function DynamicCard({ cardsData }: { cardsData: ICardsData[] }) {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Grid container  >

            <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", direction: "rtl" }}>
                {cardsData?.map((i: ICardsData, idx: number) => {
                    const isSale = "salesChangePercent" in i;
                    const salesChangePercentNum = isSale && i.salesChangePercent !== undefined && i.salesChangePercent !== null && i.salesChangePercent !== '' ? Number(i.salesChangePercent) : null;
                    const isIncrease = isSale && salesChangePercentNum !== null && !isNaN(salesChangePercentNum) && salesChangePercentNum >= 0;
                    const percentColor = isSale ? (isIncrease ? theme.palette.success.main : theme.palette.error.main) : undefined;
                    const percentBg = isSale ? (isIncrease ? `${theme.palette.success.main}15` : `${theme.palette.error.main}15`) : undefined;
                    const valueColor = isSale ? (isIncrease ? theme.palette.success.main : theme.palette.error.main) : theme.palette.success.main;
                    const arrow = isSale ? (isIncrease ? '↑' : '↓') : '';
                    return (
                        <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={i.title + idx}  >
                            <Box
                                onClick={() => navigate(i.path, { state: { dateFilter: i.dateType } })}
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    borderRadius: "12px",
                                    padding: "12px 5px",
                                    flex: 1,
                                    cursor: "pointer",
                                    marginBottom: "5px",
                                    position: "relative",
                                    height: "90px",
                                    display: 'flex',
                                    flexDirection: 'column',
                                    direction: "ltr",
                                    justifyContent: 'space-between',
                                    m: .5
                                }}
                            >

                                <IconButton
                                    size="small"
                                    sx={{
                                        position: "absolute",
                                        top: 12,
                                        left: 14,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "24px",
                                        height: "24px",
                                        borderRadius: "50%",
                                        "&:hover": {
                                            backgroundColor: theme.palette.action.hover
                                        }
                                    }}

                                >
                                    <ArrowForwardIosIcon sx={{
                                        transform: "rotate(180deg)",
                                        color: theme.palette.text.disabled,
                                        fontSize: "1.2rem",
                                        width: "10px",
                                        height: "20px", marginRight: "20px"
                                    }} />
                                </IconButton>

                                <Box display="flex" alignItems="center" justifyContent="flex-end" mb={1}>
                                    <Typography variant="subtitle2" sx={{ fontSize: "14px", color: theme.palette.text.secondary, fontWeight: 500, lineHeight: "100%", mr: 1 }}>
                                        {i.title}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <img
                                            src={i.icon}
                                            alt={i.title}
                                            style={{ width: "25px", height: "25px" }}
                                        />
                                    </Box>
                                </Box>

                                {isSale && (
                                    <Box sx={{ alignSelf: "flex-end", mt: "auto" }}>
                                        <Box
                                            sx={{
                                                backgroundColor: percentBg,
                                                color: percentColor,
                                                borderRadius: "8px",
                                                fontSize: "12px",
                                                fontWeight: "500",
                                                width: "fit-content",
                                                minWidth: "100px",
                                                height: "26px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: 0.5,
                                                padding: "0 3px",
                                                mb: 1,
                                                border: `1px solid ${percentColor}30`
                                            }}
                                        >
                                            <InfoIcon
                                                sx={{
                                                    fontSize: "14px",
                                                    color: percentColor,
                                                    mr: 0.5
                                                }}
                                            />
                                            <Typography
                                                component="span"
                                                sx={{
                                                    fontSize: "12px",
                                                    fontWeight: 600,
                                                    color: percentColor
                                                }}
                                            >
                                                {salesChangePercentNum !== null && !isNaN(salesChangePercentNum) ? `${salesChangePercentNum.toFixed(2)}%` : "-"}
                                            </Typography>
                                            <Typography
                                                component="span"
                                                sx={{
                                                    fontSize: "14px",
                                                    fontWeight: 700,
                                                    color: percentColor,
                                                    ml: 0.5
                                                }}
                                            >
                                                {arrow}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                <Box sx={{ alignSelf: "flex-start", mt: "auto" }}>
                                    <Box display="flex" alignItems="center" justifyContent="flex-start" mb={0.5} gap={0.5}>
                                        <Typography component="span" sx={{ color: theme.palette.text.secondary, fontSize: "12px", fontWeight: 400, ml: 1 }}>
                                            {i.unit}
                                        </Typography>
                                        <Typography component="span" sx={{ color: valueColor, fontSize: "16px", fontWeight: 700 }}>
                                            {i.value !== undefined && i.value !== null && i.value !== '' ? toPersianNumber(i.value) : '-'}
                                        </Typography>
                                    </Box>
                                </Box>

                            </Box>
                        </Grid>
                    );
                })}

            </Box>

        </Grid>
    );
}
