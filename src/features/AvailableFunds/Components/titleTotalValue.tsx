import { Box, Typography, Stack } from "@mui/material";
import { valueTypeEnum } from '../types';
import { useTheme } from "@mui/material/styles";

interface TitleTotalValueProps {
    value: string | number;
    valueType: valueTypeEnum;
    currencyTab: string
}

const TitleTotalValue = ({ value, valueType, currencyTab }: TitleTotalValueProps) => {
    const { palette } = useTheme();

    // Fallback values for theme properties
    const buttonMainColor = palette?.button?.main || palette?.error?.main || '#E42628';
    const primaryLightColor = palette?.primary?.light || '#565A62';

    const valueTypeToImage: Record<valueTypeEnum, string> = {
        [valueTypeEnum.fund]: 'fundsbalance',
        [valueTypeEnum.bank]: 'banksbalance',
        [valueTypeEnum.available]: 'totalbalance',
    };
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between"  mb={1}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ mr: 0.5, fontSize: "16px", color: primaryLightColor }}>
                        {currencyTab === 'toman' ? 'تومان' : '$'}
                    </Typography>
                    <Typography variant="h5" fontSize="18px" sx={{ color: primaryLightColor}} >{value}</Typography>
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