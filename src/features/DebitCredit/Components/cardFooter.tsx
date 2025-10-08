import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import type { DebtorCreditorItem } from "../types";

export default function CardFooter({item}:{item:DebtorCreditorItem}) {
    const theme = useTheme();
 
    return (
        <Box sx={{ 
            display: "flex", 
            gap: 1.5, 
            background: theme.palette.background.default, 
            height: "48px" 
        }}>
            <Tooltip title="ارسال پیامک">
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        if (item?.mobile) {
                            window.location.href = `sms:${item.mobile}`;
                        }
                    }}
                >
                    <img src={`${import.meta.env.BASE_URL}images/DebitCredit/message.png`} alt="message" style={{ width: 36, height: 36 }} />
                </IconButton>
            </Tooltip>

            <Tooltip title="تماس با موبایل">
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        if (item?.mobile) {
                            window.location.href = `tel:${item.mobile}`;
                        }
                    }}
                >
                    <img src={`${import.meta.env.BASE_URL}images/DebitCredit/phonecall.png`} alt="mobile call" style={{ width: 36, height: 36 }} />
                </IconButton>
            </Tooltip>

            <Tooltip title="تلفن ثابت">
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        if (item?.tel) {
                            window.location.href = `tel:${item.tel}`;
                        }
                    }}
                >
                    <img src={`${import.meta.env.BASE_URL}images/DebitCredit/telephonecall.png`} alt="landline call" style={{ width: 36, height: 36 }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
