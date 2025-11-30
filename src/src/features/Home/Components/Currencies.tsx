import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography,
    IconButton, useTheme
} from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { toPersianNumber } from "@/core/helper/translationUtility";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import type { ICurrencyData } from "../types";
import { Icon } from '@/core/components/icons';
import { useThemeContext } from '@/core/context/useThemeContext';


export default function Currencies({ currencyTableData, handleCurrencyRatesClick }: {
    currencyTableData: ICurrencyData[],
    handleCurrencyRatesClick: (currencyData?: ICurrencyData) => void
}) {
    const {palette} = useTheme();
    const { isDarkMode } = useThemeContext();

    return (
        <div id="currency">
        <Box sx={{ backgroundColor: palette.background.paper, borderRadius: 2, mx: .5,mb:2 }}>
            <Box
                sx={{
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: palette.background.paper,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    borderBottom: `1px solid ${palette.divider}`,
                  
                }}
            >
                <IconButton onClick={() => handleCurrencyRatesClick()}>
                    <ArrowForwardIosIcon sx={{ transform: "rotate(180deg)", color: palette.text.disabled, fontSize: "1.2rem", width: "10px", height: "20px", marginRight: "20px" }} />
                </IconButton>

                <Box display="flex" alignItems="center" gap={1}>
                    <Typography sx={{ fontWeight: 500, fontSize: "16px", mr: 0.5, color: palette.text.primary }}>
                        تابلو زنده قیمت ها
                    </Typography>
                    <Icon 
                        name="currencyrate" 
                        isDarkMode={isDarkMode}
                        width={24} 
                        height={24} 
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
                    boxShadow: palette.mode === 'dark' ? 'none' : "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    borderTop: "none",
                    backgroundColor: palette.background.paper
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: palette.mode === 'dark' ? palette.grey[800] : palette.grey[50] }}>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: "13px", color: palette.text.primary }}>عنوان</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: "13px", color: palette.text.primary }}>قیمت زنده (تومان)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: "13px", color: palette.text.primary }}>بروزرسانی</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: "13px", color: palette.text.primary }}>تغییر</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { currencyTableData?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ color: palette.text.disabled }}>
                                    داده‌ای برای نمایش وجود ندارد.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currencyTableData?.map((row: any,index) => (
                                <TableRow
                                    key={row.name}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? 'transparent' : palette.action.hover,
                                        '&:hover': {
                                            backgroundColor: palette.mode === 'dark' ? palette.grey[700] : palette.grey[100],
                                        }
                                    }}
                                    onClick={() => handleCurrencyRatesClick(row)}
                                >
                                    <TableCell align="right" sx={{ fontSize: "13px", fontWeight: "bold", color: palette.text.primary }}>
                                        {row.name === "GoldGram18" ? "طلای ۱۸عیار" : row.title}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "13px", color: palette.text.primary }}>
                                        {toPersianNumber(row.price)}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: "13px", color: palette.text.secondary }}>
                                        {toPersianNumber(row.time)}
                                    </TableCell>
                                    <TableCell align="center" sx={{
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                        color: row.rateOfChange === 0 ? palette.text.disabled : (row.rateOfChange > 0 ? palette.success.main : palette.error.main)
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
        </div>
    );
}