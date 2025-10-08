import InnerPageHeader from "@/core/components/innerPagesHeader"
import { Box, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles";
import Time from '@/core/assets/icones/time.svg'
import calendar from '@/core/assets/icones/calendar.svg'
import HeaderPic from '/images/noticeHeaderPic.png'
import { toPersianNumber } from "@/core/helper/translationUtility";
import { useLocation } from 'react-router'
import { NumberConverter } from "@/core/helper/numberConverter";
import moment from "moment-jalaali";
import useNoticeLogsHooks from "../Hooks/useNoticeHooks";

const NotFoundNotice = () => {
    const { palette } = useTheme();
    const location = useLocation()
    const notice = location.state?.notification
    const { formattedTime24HourNoSeconds } = useNoticeLogsHooks()
    return (
        <Box
            sx={{
                display: 'flex',          // Enable flexbox
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: palette.background.default,

            }}
        >
            <InnerPageHeader title="پیام ها" path="/home" />
            <Box sx={{display: "flex", flexDirection: "column", flexGrow: 1}}>
                <Box sx={{ p: 1, m: 1, backgroundColor: palette.background.paper, borderRadius: 3,flexGrow:1,boxSizing:"border-box" }}>

                    <Box sx={{ display: "inline-flex", border: "1px solid #eee", borderRadius: 2, alignItems: "center", gap: .5, px: .5 }}>
                        <img src={calendar} />
                        <span style={{ color: palette.primary.light, fontSize: "14px" }}> {NumberConverter.latinToArabic(moment(notice?.created).format('jYYYY/jMM/jDD'))}</span>

                        <img src={Time} />
                        <span style={{ color: palette.primary.light, fontSize: "14px" }}>{toPersianNumber(formattedTime24HourNoSeconds)}</span>

                    </Box>
                    <Box sx={{ direction: "rtl" }}>
                        <img src={HeaderPic} width="100%" />
                        <Typography variant="body2" sx={{ textAlign: "justify" }} >
                            گزارشات آنلاین هلو بستری با گزارشات مالی متنوع می باشد که در اختیار صاحبین کسب و کارقرار داده می شود که هر لحظه قابلیت نظارت، بررسی و تصمیم گیری بهتر بر روی سیستم کسب و کار خود را داشته باشند.به همین منظور کاربران نرم افزار هلو به واسطه وب سایتMyHoloo می توانند برخی از گزارشات مهم و کاربردی نرم افزار حسابداری هلوی خود را در محیط اینترنت و از طریق داشبورد گزارشات آنلاین در هر زمان و مکان مشاهده نمایند :

                        </Typography>
                        <br />
                        <Typography variant="h6">
                            گزارشات پرکاربرد
                        </Typography>
                        <Box sx={{ mr: 3, mt: 1 }}>
                            <ul>
                                <li>
                                    گردش بانک
                                </li>
                                <li>
                                    گردش صندوق
                                </li>
                                <li>
                                    سررسید چک های پرداختی
                                </li>
                                <li>
                                    سررسید چک های دریافتی
                                </li>
                                <li>
                                    فروش و سود
                                </li>
                            </ul>
                        </Box>
                    </Box>

                </Box>
            </Box>

        </Box>
    )
}
export default NotFoundNotice