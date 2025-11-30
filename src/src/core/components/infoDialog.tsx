import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import useInfoDialogHook from './infoDialogAPIHook';
import { useInfoModalStore } from '../zustandStore';
import { Box } from '@mui/material';
import { NumberConverter } from '../helper/numberConverter';
import moment from 'moment-jalaali';
import { useTheme } from "@mui/material/styles";
import calendar from '/icons/appbar/light/calendar.svg'
import infopopupIconLight from '/public/icons/appbar/light/infopopup.svg'
import infopopupIconDark from '/public/icons/appbar/dark/infopopup.svg'
import { getCommandTitle } from '../helper/commandTitle';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: 0,
        backgroundColor: 'transparent',
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiDialog-paper': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        overflow: 'visible',
    },
    '& .MuiBackdrop-root': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(100, 99, 99, 0.8)',
    },
}));

interface IDialogProps {
    open: boolean,
    handleClose: () => void,
}




export default function InfoDialogs({ open, handleClose }: IDialogProps) {
    const { palette } = useTheme();
    const infoOBJ = useInfoModalStore((state) => state.infoDetail)
    const [commandTitle, setCommandTitle] = React.useState("")

    React.useEffect(() => {
        setCommandTitle(getCommandTitle(infoOBJ.path));
    }, [infoOBJ.path]);

    const { infoDialogData, isPending, isError } = useInfoDialogHook(commandTitle)
    const isDefaultDate = (dateStr: string | undefined | null) => {
        if (!dateStr || dateStr === "0001-01-01T00:00:00Z") {
            return true;
        }
        return false;
    };

    return (
        <React.Fragment>

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                disableEnforceFocus
                disableAutoFocus
                sx={{ direction: "rtl" }}
            >
                <Box sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: '400px',
                    margin: '0 auto'
                }}>

                    {/* Info Icon */}
                    <Box sx={{
                        position: 'absolute',
                        top: '-22px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10
                    }}>
                        <img
                            src={palette.mode === 'dark' ? infopopupIconDark : infopopupIconLight}
                            alt="info"
                            style={{ width: '44px', height: '44px' }}
                        />
                    </Box>

                    {/* Main Card */}
                    <Box sx={{
                        backgroundColor: palette.mode === 'dark' ? palette.background.paper : '#ffffff',
                        borderRadius: '16px',
                        padding: '24px',
                        paddingTop: '40px',
                        boxShadow: palette.mode === 'dark'
                            ? '0 4px 20px rgba(0, 0, 0, 0.5)'
                            : '0 4px 20px rgba(0, 0, 0, 0.1)',
                        width: '100%',
                        maxWidth: '350px',
                    }}>
                        {/* Main Title */}
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: 'center',
                                marginBottom: '24px',
                                fontSize: '16px',
                                fontWeight: 500,
                                color: palette.text.primary
                            }}
                        >
                            آخرین زمان ثبت رکورد و به روز رسانی اطلاعات
                        </Typography>

                        {/* Loading State */}
                        {isPending && (
                            <Typography
                                variant="body1"
                                sx={{
                                    textAlign: 'center',
                                    color: palette.text.primary
                                }}
                            >
                                در حال بارگذاری اطلاعات...
                            </Typography>
                        )}

                        {/* Error State */}
                        {isError && (
                            <Typography
                                variant="body1"
                                sx={{
                                    textAlign: 'center',
                                    color: palette.error.main
                                }}
                            >
                                خطا در بارگذاری اطلاعات.
                            </Typography>
                        )}

                        {/* Date Sections - Only show when not loading and not error */}
                        {!isPending && !isError && (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '16px',
                                justifyContent: 'space-between'
                            }}>
                                {/* Record Registration Date */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: '12px',
                                            color: palette.text.secondary,
                                            marginBottom: '8px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        تاریخ ثبت رکورد
                                    </Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: palette.mode === 'dark' ? '#1A1A1A' : '#ffffff',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        gap: '8px',
                                        paddingRight: "30px",
                                        border: palette.mode === 'dark' ? 'none' : '1px solid #e0e0e0'
                                    }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: '14px',
                                                color: palette.text.primary,
                                                direction: 'rtl'
                                            }}
                                            data-testid="last-record-date"
                                        >
                                            {isDefaultDate(infoDialogData?.lastRecord) ? "-" : NumberConverter.latinToArabic(moment(infoDialogData?.lastRecord).format('jYYYY/jMM/jDD'))}
                                        </Typography>
                                        <img src={calendar} alt="calendar" style={{ width: '16px', height: '16px' }} />
                                    </Box>
                                </Box>

                                {/* Update Date */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: '12px',
                                            color: palette.text.secondary,
                                            marginBottom: '8px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        تاریخ به روز رسانی
                                    </Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: palette.mode === 'dark' ? '#1A1A1A' : '#ffffff',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        gap: '8px',
                                        paddingRight: "30px",
                                        border: palette.mode === 'dark' ? 'none' : '1px solid #e0e0e0'
                                    }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: '14px',
                                                color: palette.text.primary,
                                                direction: 'rtl'
                                            }}
                                            data-testid="last-execution-date"
                                        >
                                            {isDefaultDate(infoDialogData?.lastExecutionCommandDate) ? "-" : NumberConverter.latinToArabic(moment(infoDialogData?.lastExecutionCommandDate).format('jYYYY/jMM/jDD'))}
                                        </Typography>
                                        <img src={calendar} alt="calendar" style={{ width: '16px', height: '16px' }} />
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </BootstrapDialog>
        </React.Fragment>
    );
}