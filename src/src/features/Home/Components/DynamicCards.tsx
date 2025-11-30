import { Box, Typography, IconButton, Grid, useTheme } from "@mui/material";
import { toPersianNumber } from "@/core/helper/translationUtility";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from 'react-router';
import type { ICardsData } from "../types";
import InfoDialogs from "../../../core/components/infoDialog";
import { Icon } from "@/core/components/icons";
import { useThemeContext } from "@/core/context/useThemeContext";

interface IDynamicCardProps {
    cardsData: ICardsData[],
    open: boolean,
    handleClickOpen: (value: {
        path: string,
        title: string
    }) => void;
    handleClose: () => void,
    id?: string
}
export default function DynamicCard({ cardsData, open,
    id,
    handleClickOpen,
    handleClose }: IDynamicCardProps) {
    const { palette } = useTheme();
    const navigate = useNavigate();
    const { isDarkMode } = useThemeContext();

    const filteredList = cardsData.filter((item: ICardsData) => item.name == id)

    return (
        <Grid container  >

            <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", direction: "rtl", mb: 1 }} id={id}>
                {filteredList?.map((i: ICardsData, idx: number) => {
                    const isSale = "salesChangePercent" in i;
                    const salesChangePercentNum = isSale && i.salesChangePercent !== undefined && i.salesChangePercent !== null && i.salesChangePercent !== '' ? Number(i.salesChangePercent) : null;
                    const isIncrease = isSale && salesChangePercentNum !== null && !isNaN(salesChangePercentNum) && salesChangePercentNum >= 0;
                    const percentColor = isSale ? (isIncrease ? palette.success.main : palette.error.main) : undefined;
                    const percentBg = isSale ? (isIncrease ? `${palette.success.main}15` : `${palette.error.main}15`) : undefined;
                    const valueColor = isSale ? (isIncrease ? palette.success.main : palette.error.main) : palette.success.main;
                    const arrow = isSale ? (isIncrease ? '↑' : '↓') : '';

                    return (
                        <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6 }} key={i.title + idx}  >
                            <Box  style={{ width: "100%" }}>
                                <Box
                                    sx={{
                                        backgroundColor: palette.background.paper,
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
                                        mx: .5
                                    }}
                                >

                                    <Box
                                        sx={{
                                            height: "90px",
                                            display: 'flex',
                                            flexDirection: 'column',
                                            direction: "ltr",

                                        }}
                                        onClick={() => { navigate(i.path, { state: { dateFilter: i.dateType } }) }}
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
                                                    backgroundColor: palette.action.hover
                                                }
                                            }}

                                        >
                                            <ArrowForwardIosIcon sx={{
                                                transform: "rotate(180deg)",
                                                color: palette.text.disabled,
                                                fontSize: "1.2rem",
                                                width: "10px",
                                                height: "20px", marginRight: "20px"
                                            }} />
                                        </IconButton>

                                        <Box display="flex" alignItems="center" justifyContent="flex-end" mb={1}   >
                                            <Typography variant="subtitle2" sx={{ fontSize: "14px", color: palette.text.secondary, fontWeight: 500, lineHeight: "100%", mr: 1 }}>
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
                                            <Box sx={{ alignSelf: "flex-start", mt: "auto" }}>
                                                <Box
                                                    sx={{
                                                        backgroundColor: percentBg,
                                                        color: percentColor,
                                                        borderRadius: "8px",
                                                        fontSize: "12px",
                                                        fontWeight: "500",
                                                        width: "fit-content",
                                                        height: "26px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: 0.5,
                                                        padding: "0 10px",
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
                                                            color: percentColor,
                                                            display: "contents"
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
                                            <Box display="flex" alignItems="center" justifyContent="flex-start" gap={0.5}>
                                                <Typography component="span" sx={{ color: palette.text.secondary, fontSize: "12px", fontWeight: 400, ml: 1 }}>
                                                    {i.unit}
                                                </Typography>
                                                <Typography component="span" sx={{ color: valueColor, fontSize: "16px", fontWeight: 700 }}>
                                                    {i.value !== undefined && i.value !== null && i.value !== '' ? toPersianNumber(i.value) : '-'}
                                                </Typography>
                                            </Box>

                                        </Box>

                                    </Box>
                                    <Box onClick={() => handleClickOpen({ path: i.path, title: i.title })} sx={{
                                        position: "absolute",
                                        right: 10,
                                        bottom: 12
                                    }}> <Icon name="infodialoghome" isDarkMode={isDarkMode} width={24} height={24} /></Box>
                                </Box>
                            </Box>
                        </Grid>
                    );
                })}

                <InfoDialogs open={open} handleClose={handleClose} />
            </Box>

        </Grid>
    );
}
