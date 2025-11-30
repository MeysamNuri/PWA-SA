import React from 'react';
import { IconButton, Box } from '@mui/material';
import { useNavigate } from 'react-router';
import ButtonComponent from '@/core/components/Button';
import { useTheme } from "@mui/material/styles";
import { useThemeContext } from '@/core/context/useThemeContext';

const RulesAndTerms: React.FC = () => {
    const { palette } = useTheme();
    const { isDarkMode } = useThemeContext();

    const navigate = useNavigate()
    
    // Get Holoo logo path based on theme
    const getHolooLogoPath = () => {
        const basePath = `${import.meta.env.BASE_URL}images/Appbaricons/`;
        return isDarkMode ? `${basePath}Holoodark.png` : `${basePath}Holoo.png`;
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: palette.background.default,
            direction: "rtl",
            px: 2,

        }} >
            <Box sx={{
                display: 'flex',
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                minHeight: "48px !important",
                pt: 3


            }}>
                <Box sx={{ width: '24px' }} />

                <img
                    src={getHolooLogoPath()}
                    alt="mobile icon"
                    style={{ width: "71px", height: "22px" }}
                />
                <IconButton
                    onClick={() => navigate('/login')}
                    sx={{
                        p: 0,
                        width: '24px',
                        height: '24px'
                    }}
                >
                    <img
                        src={`${import.meta.env.BASE_URL}images/backroute.png`}
                        alt="back"
                        style={{ width: "24px", height: "24px" }}
                    />
                </IconButton>
            </Box>

            <Box sx={{
                backgroundColor: "White",
                borderRadius: "12px",
                padding: "15px",

            }}>
                <h4 style={{ fontWeight: "bold" }}>قوانین و شرایط :
                </h4>
                <ul style={{ listStyle: "none", textAlign: "justify" }}>
                    <li>
                        ۱-  استفاده از "دستیار هوشمند هلو" ویژه دارندگان "نرم افزار حسابداری هلو" می باشد.
                    </li>
                    <li>۲-با وارد کردن شماره موبایل و دریافت کد تایید پیامکی ، پروفایل کاربری شما بر اساس اطلاعاتی که هنگام خرید "نرم افزار حسابداری هلو" ارائه کرده اید ، ایجاد خواهد شد .</li>
                    <li>۳-مبنای تحلیل ها و شاخص های ارائه شده در نرم افزار ، اطلاعاتی است که در "نرم افزار حسابداری هلو" ثبت کرده اید .</li>
                    <li>۴-مرجع «قیمت زنده ارز، سکه و طلا» سایت معتبر و رسمی tgju.org می باشد .</li>
                </ul>
            </Box>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    right: 0,
                    width: '100%',
                    display: "flex",
                    justifyContent: "center",

                }}
            >
                <Box sx={{p:2,width:"100%"}}  onClick={() => navigate('/login')}>
                    <ButtonComponent title="متوجه شدم" isFormValid={true}  />
                </Box>

            </Box>

        </Box>
    )
}
export default RulesAndTerms