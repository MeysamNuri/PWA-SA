
import { NumberConverter } from "@/core/helper/numberConverter"
import {
    Box, Divider, Typography,
    useTheme,

} from "@mui/material"
import type React from "react";

interface IListProps{
    itemIndex:number,
    fullName:string,
    invoiceQuantity:number,
    soldPriceUOM:string
    formattedSoldPrice:string
}
const CustomerSellerList:React.FC<IListProps>=({fullName,invoiceQuantity,itemIndex,formattedSoldPrice,soldPriceUOM})=>{
    const { palette } = useTheme();
    
    return (
    <>
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body1" sx={{ color: palette.text.primary }}>{NumberConverter.latinToArabic((itemIndex + 1).toLocaleString())}-{fullName}</Typography>
        <Box sx={{ textAlign: "left" }}>
            <Typography variant="body2" sx={{  color: palette.text.primary }}>
                {NumberConverter.latinToArabic(invoiceQuantity?.toLocaleString()||"0")}
                <span> {" "}فاکتور</span>
            </Typography>
            <Typography variant="body2" sx={{  color: palette.text.primary }}>
                {NumberConverter.latinToArabic(formattedSoldPrice?.toLocaleString()||"0")}
                <span>{" "}{soldPriceUOM} </span>
            </Typography>
        </Box>

    </Box>
    <Divider sx={{ my: 1,borderColor:palette.background.default }}  />
</>
)
}
export default CustomerSellerList