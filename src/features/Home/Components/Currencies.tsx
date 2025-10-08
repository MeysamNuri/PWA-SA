import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress,
    IconButton, useTheme
} from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { toPersianNumber } from "@/core/helper/translationUtility";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import type { ICurrencyData } from "../types";


export default function Currencies({ currencyTableData, currencyLoading, handleCurrencyRatesClick }: {
    currencyTableData: ICurrencyData[],
    currencyLoading: boolean,
    handleCurrencyRatesClick: () => void
}) {
    const theme = useTheme();

    return (
        <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 2, mt: 1, mx: .5 }}>
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: theme.palette.background.paper,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <IconButton onClick={handleCurrencyRatesClick}>
                    <ArrowForwardIosIcon sx={{ transform: "rotate(180deg)", color: theme.palette.text.disabled, fontSize: "1.2rem", width: "10px", height: "20px", marginRight: "20px" }} />
                </IconButton>

                <Box display="flex" alignItems="center" gap={1}>
                    <Typography sx={{ fontWeight: 500, fontSize: "16px", mr: 0.5, color: theme.palette.text.primary }}>
                        تابلو زنده قیمت ها
                    </Typography>
                    <img
                        src={"/images/Homepageicons/currencyrate.png"}
                        alt="currency icon"
                        style={{ width: "24px", height: "24px" }}
                    />
                </Box>
            </Box>
            <TableContainer
                component={Paper}
                sx={{
                    m: "auto",
                    direction: "rtl",
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    boxShadow: theme.palette.mode === 'dark' ? 'none' : "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    borderTop: "none",
                    backgroundColor: theme.palette.background.paper
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50] }}>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: "13px", color: theme.palette.text.primary }}>عنوان</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: "13px", color: theme.palette.text.primary }}>قیمت زنده (تومان)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: "13px", color: theme.palette.text.primary }}>بروزرسانی</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: "13px", color: theme.palette.text.primary }}>تغییر</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currencyLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <CircularProgress size={24} sx={{ color: theme.palette.primary.main }} />
                                </TableCell>
                            </TableRow>
                        ) : currencyTableData?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ color: theme.palette.text.disabled }}>
                                    داده‌ای برای نمایش وجود ندارد.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currencyTableData?.map((row: any,index) => (
                                <TableRow
                                    key={row.name}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? 'transparent' : theme.palette.action.hover,
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[100],
                                        }
                                    }}
                                >
                                    <TableCell align="right" sx={{ fontSize: "13px", fontWeight: "bold", color: theme.palette.text.primary }}>
                                        {row.name === "GoldGram18" ? "طلای ۱۸عیار" : row.title}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "13px", color: theme.palette.text.primary }}>
                                        {toPersianNumber(row.price)}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>
                                        {toPersianNumber(row.time)}
                                    </TableCell>
                                    <TableCell align="center" sx={{
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                        color: row.rateOfChange === 0 ? theme.palette.text.disabled : (row.rateOfChange > 0 ? theme.palette.success.main : theme.palette.error.main)
                                    }}>
                                        {row?.rateOfChange !== 0 ? (
                                            <>
                                                {toPersianNumber(Math.abs(row.rateOfChange))}%
                                                {row.rateOfChange > 0 ? (
                                                    <ArrowUpwardIcon fontSize="small" sx={{ verticalAlign: "middle" }} />
                                                ) : (
                                                    <ArrowDownwardIcon fontSize="small" sx={{ verticalAlign: "middle" }} />
                                                )}
                                            </>
                                        ) : (
                                            <span style={{ textDecoration: "underline" }}>_</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}