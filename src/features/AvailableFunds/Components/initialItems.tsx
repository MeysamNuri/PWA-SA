import { Box, Typography, Tooltip } from "@mui/material"
import { NumberConverter } from "@/core/helper/numberConverter";
import { useTheme } from "@mui/material/styles";

interface IInitialBankProps {
    serial: string,
    balance: number,
    balancePercentage: string,
    accountingName: string
}
const InitialItemsSection = ({ valueType, initialBankItems, initialFundItems }: {
    valueType: string,
    initialBankItems: IInitialBankProps[],
    initialFundItems: IInitialBankProps[]
}) => {


    const data = valueType === "fund" ? initialFundItems : initialBankItems
    const { palette } = useTheme();

    return (
        <>
            {data?.map(({ serial, balance, balancePercentage, accountingName }: IInitialBankProps, idx: number) => (
                <Box
                    key={`${serial}-${idx}`}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Typography variant="body1" fontWeight={400} fontSize="14px" sx={{ color: palette.text.secondary }}>
                        {NumberConverter.latinToArabic(Math.floor(balance).toLocaleString('fa-IR'))}
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
                                    
                                    maxWidth:{xs:140,sm:140,md:"100%"},
                                    // maxWidth: 90,
                                    // textOverflow: 'ellipsis',
                                    whiteSpace: 'wrap',
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
        </>
    );
};

export default InitialItemsSection;