import { Box, Typography, Tooltip, Collapse, Stack } from "@mui/material"
import { useTheme } from "@mui/material/styles";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { NumberConverter } from "@/core/helper/numberConverter";
interface IRemainProps {
    serial: string,
    balance: number,
    balancePercentage: any,
    accountingName: string
}
const RemainingItemsection = ({ valueType,
    remainingBankItems,
    remainingFundItems,
    isFundDetailsExpanded,
    setIsDetailsExpanded,
    currencyTab }: { 
    valueType: string, 
    remainingBankItems: IRemainProps[], 
    remainingFundItems: IRemainProps[], 
    isFundDetailsExpanded: any, 
    setIsDetailsExpanded: any,
    currencyTab: string 
}) => {

    const { palette } = useTheme();
    const data = valueType === "bank" ? remainingBankItems : remainingFundItems

    if (!data.length) return null;

    return (
        <>
            <Collapse
                in={isFundDetailsExpanded}
            >
                <Stack spacing={1}>
                    {data?.map(({ serial, balance, balancePercentage, accountingName }: IRemainProps, idx: number) => (
                        <Box
                            key={`${serial}-${idx}`}
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <Typography variant="body1" fontWeight={400} fontSize="14px" sx={{ color: palette.text.secondary }}>
                                {currencyTab === 'dollar' 
                                    ? NumberConverter.latinToArabic(Math.floor(balance).toLocaleString('fa-IR'))
                                    : NumberConverter.latinToArabic(Math.floor(balance).toLocaleString('fa-IR'))
                                }
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.25, direction: 'rtl', color: palette.text.secondary }}>
                                <Typography variant="body1" component="span" fontWeight={400} fontSize="14px">
                                    {balancePercentage} %
                                </Typography>
                                <Tooltip
                                    title={accountingName}
                                    placement="top"
                                    arrow
                                    enterDelay={200}
                                    leaveDelay={200}
                                    componentsProps={{ tooltip: { sx: { userSelect: 'none' } } }}
                                >
                                    <Typography
                                        variant="body1"
                                        component="span"
                                        fontWeight={400}
                                        fontSize="14px"
                                        sx={{
                                            minWidth: 60,
                                            maxWidth: { xs: 150, sm: 150, md: "100%" },
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            userSelect: 'none',
                                            mr: 1
                                        }}
                                    >
                                        {accountingName}
                                    </Typography>
                                </Tooltip>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Collapse>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    mt: 1,
                    color: palette.text.secondary,
                    '&:hover': { opacity: 0.7 },
                }}
                onClick={() => setIsDetailsExpanded(!isFundDetailsExpanded)}
            >
                {isFundDetailsExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </Box>
        </>
    );
};

export default RemainingItemsection;