import { Box, Typography, Button, Paper, useTheme, Switch, FormControlLabel } from "@mui/material";
import useUserProfileHooks from '../Hooks/userProfileHooks'
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import InnerPageHeader from "@/core/components/innerPagesHeader";
import UserInfo from "../Components/userInfo";

export default function UserProfileView() {
    const theme = useTheme();
    const { handlePassword, serial,
        palette,
        userProfileData,
        isDarkMode,
        toggleTheme
    } = useUserProfileHooks()
    return (
        <Box sx={{
            minHeight: '100vh',
            overflow: 'hidden',
            direction: "rtl",
            backgroundColor: palette.background.default
        }}>
            {/* Header */}
            <InnerPageHeader title="حساب کاربری" path="/home" />
            {/* User Info Section */}
            <UserInfo userProfileData={userProfileData} serial={serial ?? ""} />

            {/* Theme Selection Section */}
            <Paper elevation={0} sx={{ m: 2, borderRadius: 3, p: 0, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.paper }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src={`${import.meta.env.BASE_URL}src/core/assets/icones/theme-toggle.svg`} alt="تنظیمات تم" style={{ width: 24, height: 24 }} />
                        <Typography sx={{ fontWeight: 800, pr: 1 }}>تنظیمات تم</Typography>
                    </Box>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={isDarkMode}
                                onChange={toggleTheme}
                                icon={<LightModeIcon sx={{ fontSize: 20 }} />}
                                checkedIcon={<DarkModeIcon sx={{ fontSize: 20 }} />}
                                sx={{
                                    width: 60,
                                    height: 34,
                                    padding: 0,
                                    '& .MuiSwitch-switchBase': {
                                        padding: 1,
                                        '&.Mui-checked': {
                                            transform: 'translateX(26px)',
                                            color: theme.palette.primary.main,
                                            '& + .MuiSwitch-track': {
                                                backgroundColor: theme.palette.primary.main,
                                            },
                                        },
                                    },
                                    '& .MuiSwitch-thumb': {
                                        backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
                                    },
                                    '& .MuiSwitch-track': {
                                        borderRadius: 20,
                                        backgroundColor: theme.palette.grey[400],
                                    },
                                }}
                            />
                        }
                        label=""
                    />
                </Box>
            </Paper>


            {/* Password Section */}

            <Paper elevation={0} sx={{ m: 2, borderRadius: 3, p: 0, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.paper }}>
                    <img src={`${import.meta.env.BASE_URL}images/sidebar/password.png`} alt="کلمه عبور" style={{ width: 24, height: 24 }} />
                    <Typography sx={{ fontWeight: 800, pr: 1 }}>کلمه عبور</Typography>
                </Box>

                <Box
                    sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50] }}
                >
                    <Button
                        fullWidth
                        variant="text"
                        onClick={handlePassword}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 800,
                            textTransform: 'none',
                            boxShadow: 'none',
                            py: 1.5,
                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
                            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.primary,
                            ':hover': {
                                bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300]
                            }
                        }}
                    >
                        تغییر کلمه عبور
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
