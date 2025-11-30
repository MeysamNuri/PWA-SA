import { Box, Typography, Stack } from "@mui/material";
import { valueTypeEnum } from '../types';
import { useTheme } from "@mui/material/styles";
import { toPersianNumber } from "@/core/helper/translationUtility";

interface TitleTotalValueProps {
    value: string | number;
    valueType: valueTypeEnum;
    currencyTab: string,
    totalBalanceUOM?: string,
    bankTotalBalanceUOM?: string,
    fundTotalBalanceUOM?: string,
    bankBalance?: number,
    fundBalance?: number
}

const TitleTotalValue = ({ value, valueType, currencyTab, totalBalanceUOM, bankBalance, fundBalance }: TitleTotalValueProps) => {
    const { palette } = useTheme();

    // Fallback values for theme properties
    const buttonMainColor = palette?.button?.main || palette?.error?.main || '#E42628';
    const primaryLightColor = palette?.primary?.light || '#565A62';

    const valueTypeToImage: Record<valueTypeEnum, string> = {
        [valueTypeEnum.fund]: 'fundsbalance',
        [valueTypeEnum.bank]: 'banksbalance',
        [valueTypeEnum.available]: 'totalbalance',
    };
    const totalTomanValue = valueType === valueTypeEnum.available ? value :
        valueType === valueTypeEnum.bank ? toPersianNumber(((Math.floor(Number(bankBalance || 0) / 10))).toLocaleString()) :
            toPersianNumber((Math.floor((Number(fundBalance || 0) / 10))).toLocaleString())
    const totalDollarValue = valueType === valueTypeEnum.available ? value :
        valueType === valueTypeEnum.bank ? toPersianNumber((bankBalance || 0).toLocaleString()) :
            toPersianNumber((fundBalance || 0).toLocaleString())

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {valueType === valueTypeEnum.available && (
                        <Typography variant="body2" sx={{ mr: 0.5 }}>
                            {currencyTab === 'toman' ? totalBalanceUOM : '$'}
                        </Typography>
                    )}
                    {(valueType === valueTypeEnum.bank || valueType === valueTypeEnum.fund) && currencyTab === 'dollar' && (
                        <Typography variant="body2" sx={{ mr: 0.5 }}>
                            $
                        </Typography>
                    )}
                    {(valueType === valueTypeEnum.bank || valueType === valueTypeEnum.fund) && currencyTab === 'toman' && (
                        <Typography variant="body2" sx={{ mr: 0.5 }}>
                            تومان
                        </Typography>
                    )}
                    <Typography variant="h5" fontSize="18px" sx={{ color: primaryLightColor }} >
                        {currencyTab === 'toman' ? totalTomanValue : totalDollarValue}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {
                        valueType === valueTypeEnum.available ?
                            <Typography variant="body1" fontWeight="bold" sx={{ mr: 0.5, color: buttonMainColor, fontSize: "16px", fontWeight: 500 }}>ارزش کل دارایی</Typography>
                            :
                            <Typography variant="body1" sx={{ mr: 0.5, fontSize: "16px", color: primaryLightColor }}>{
                                valueType === valueTypeEnum.fund ? "نقد" : "بانک"}</Typography>
                    }
                    <img
                        width={25}
                        height={25}
                        src={`${import.meta.env.BASE_URL}images/Availablefunds/${valueTypeToImage[valueType]}.png`}
                        alt="Bank Icon"
                        style={{ objectFit: 'contain', width: "20px", height: "20px" }} />
                </Box>
            </Stack>
        </Box>
    )
}
export default TitleTotalValue