import { Box, Typography, Grid, useTheme } from "@mui/material";
import { toPersianNumber } from "@/core/helper/translationUtility";
import { useNavigate } from "react-router";
import type { UnsettledInvoicesData } from "../types";
import { Icon } from "@/core/components/icons";
import { useThemeContext } from "@/core/context/useThemeContext";
import InfoDialogs from "../../../core/components/infoDialog";
import { IconButton } from "@mui/material";
interface IUnsettledInvoicesProps {
    data: UnsettledInvoicesData | undefined;
    isError: boolean;
    open: boolean;
    handleClickOpen: (value: {
        path: string;
        title: string;
    }) => void;
    handleClose: () => void;
}

export default function UnsettledInvoices({ data, isError, open, handleClickOpen, handleClose }: IUnsettledInvoicesProps) {
    const theme = useTheme();
    const { isDarkMode } = useThemeContext();
    const navigate = useNavigate();

    if (isError || !data) return null;

    return (
        <Box id="unsettledinvoices">
        <Grid container spacing={2} sx={{ mb:2}}>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Box
                    onClick={() => navigate('/UnsettledInvoicesDetailsView')}
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: "12px",
                        padding: "8px",
                        height: "75px",
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                            boxShadow: theme.shadows[4],
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    {/* Header with icon and title */}
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClickOpen({path: '/UnsettledInvoicesDetailsView', title: 'فاکتورهای تسویه نشده'});
                            }}
                            size="small"
                            sx={{
                                padding: '4px',
                                color: theme.palette.text.secondary,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                    color: theme.palette.text.primary,
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Icon name="infodialoghome" isDarkMode={isDarkMode}  />
                        </IconButton>
                        
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: theme.palette.text.secondary,
                                    textAlign: 'right'
                                }}
                            >
                                فاکتورهای تسویه نشده
                            </Typography>
                            <Icon name="unsettledinvoices" isDarkMode={isDarkMode} width={24} height={24} />
                        </Box>
                    </Box>

                    {/* Content */}
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        {/* Right side - Count */}



                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {data.unsettledAmountUOM}
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: 400,
                                    color: theme.palette.error.main,
                                }}
                            >
                                {data.formattedUnsettledAmount ? toPersianNumber(data.formattedUnsettledAmount) : toPersianNumber(data.unsettledAmount.toString())}
                            </Typography>
                        </Box>

                        {/* Left side - Quantity */}
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: "12px",
                                    fontWeight: 400,
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                عدد
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: 400,
                                    color: theme.palette.error.main,
                                }}
                            >
                                {toPersianNumber(data.unsettledQuantity.toString())}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Grid>
            <InfoDialogs open={open} handleClose={handleClose} />
        </Grid>
        </Box>
    );
}