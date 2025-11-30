
import {
    Box, Divider, List, Typography,

} from "@mui/material"
import { useTheme } from "@mui/material/styles";

import { Icon } from '@/core/components/icons';
import { useThemeContext } from '@/core/context/useThemeContext';
import useTopCustomersAndSellers from "../Hooks/topC&SHooks";
import { DateFilterType } from "@/core/types/dateFilterTypes";
import DateFilterToggleTab from "@/core/components/dateFilterToggleTab";
import type React from "react";
import CustomerSellerList from "./customerSellerList";
import InfoDialogs from "@/core/components/infoDialog";

interface IProps {
    isTopSeller?: boolean,
    open: boolean,
    handleClickOpen: (value: {
        path: string,
        title: string
    }) => void;
    handleClose: () => void
}

const TopCustomersAndSellers: React.FC<IProps> = ({ isTopSeller, handleClickOpen, handleClose, open }) => {
    const { palette } = useTheme();
    const { handleDaysChange, handleTopCustomersDaysChange,
        daysTypeFilter,
        dateFilter,
        salesBySellerData,
        topCustomersByPurchaseData,
        handleDetailsNavigate
    } = useTopCustomersAndSellers()
    const { isDarkMode } = useThemeContext();
    const options = isTopSeller ? [
        { label: 'دیروز', value: DateFilterType.Yesterday },
        { label: '۷روز گذشته', value: DateFilterType.Last7Days },
        { label: '۳۰روز گذشته', value: DateFilterType.Last30Days },

    ] : [
        { label: '۳ ماه گذشته', value: DateFilterType.Last3Months },
        { label: '۶ ماه گذشته', value: DateFilterType.Last6Months },
        { label: '۱ سال گذشته', value: DateFilterType.LastYear },

    ]
    return (
        <Box sx={{
            backgroundColor: palette.background.paper,
            borderRadius: 2,
            padding: 1,
            marginBottom: 2,
            direction: "rtl",
            mx: .5
        }}>
            <div id={isTopSeller ? ("topSeller") : ("topCustomer")} >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", gap: .5 }} >
                        <Icon
                            name="customers"
                            isDarkMode={isDarkMode}
                            width={24}
                            height={24}
                        />

                        <Typography variant="h6" fontSize={"15px"} sx={{ textAlign: 'right', color: palette.text.primary }}>{isTopSeller ? ("فروشندگان برتر") : ("مشتریان برتر")} </Typography>
                        <Box onClick={() => handleClickOpen({ path: isTopSeller ? "topSeller" : "topCustomer", title: isTopSeller ? ("فروشندگان برتر") : ("مشتریان برتر") })} sx={{

                        }}>
                            <Icon
                                name="infodialoghome"
                                isDarkMode={isDarkMode}
                                width={24}
                                height={24}
                            />
                        </Box>

                    </Box>
                    <Box sx={{ display: "flex" }}>

                        <DateFilterToggleTab
                            options={options}
                            onChange={isTopSeller ? handleDaysChange : handleTopCustomersDaysChange}
                            value={isTopSeller ? dateFilter : daysTypeFilter} />

                    </Box>
                </Box>
                <Divider sx={{ mt: 1 }} />
                <List sx={{ pb: 0 }}>
                    {
                        isTopSeller ?
                            salesBySellerData?.salesBySellerDto?.slice(0, 3).map((item, index: number) => (

                                <CustomerSellerList
                                    key={index}
                                    itemIndex={index}
                                    fullName={item.sellerName}
                                    invoiceQuantity={item.invoiceQuantity}
                                    soldPriceUOM={item.soldPriceUOM}
                                    formattedSoldPrice={item.formattedSoldPrice}
                                />

                            )) :

                            topCustomersByPurchaseData?.slice(0, 3).map((item, index: number) => (

                                <CustomerSellerList
                                    key={index}
                                    itemIndex={index}
                                    fullName={item.customerName}
                                    invoiceQuantity={item.invoiceQuantity || 0}
                                    soldPriceUOM={item.soldPriceUOM}
                                    formattedSoldPrice={item.formattedSoldPrice}
                                />

                            ))
                    }
                </List>
                <Box sx={{ direction: "ltr", mx: 2 }} onClick={() => handleDetailsNavigate(isTopSeller ? ("/top-sellers") : ("/top-customers"))}>
                    <Typography variant="body2" sx={{ color: palette.text.primary, cursor: "pointer" }}>بیشتر</Typography>
                </Box>
                <InfoDialogs open={open} handleClose={handleClose} />
            </div>
        </Box>
    )
}
export default TopCustomersAndSellers