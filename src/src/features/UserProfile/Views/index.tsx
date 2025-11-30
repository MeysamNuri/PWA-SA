import { Box, Typography, Button, Paper, useTheme, CircularProgress } from "@mui/material";
import useUserProfileHooks from '../Hooks/userProfileHooks'
import { useNavigate } from 'react-router-dom';

import InnerPageHeader from "@/core/components/innerPagesHeader";
import UserInfo from "../Components/userInfo";
import { Icon } from '@/core/components/icons';
import { useThemeContext } from '@/core/context/useThemeContext';

export default function UserProfileView() {
    const { palette, shadows } = useTheme();
    const navigate = useNavigate();
    const { isDarkMode } = useThemeContext();
    const {
        handlePassword,
        serial,
        userProfileData,
        personalityLoading,
        toggleTheme,
        handleHomepageCustomization,
        userPersonality
    } = useUserProfileHooks()

 
    return (
        <Box sx={{
            overflow: 'hidden',
            direction: "rtl",
            backgroundColor: palette.background?.default
        }}>
            <InnerPageHeader title="حساب کاربری" path="/home" />
            <UserInfo userProfileData={userProfileData} serial={serial ?? ""} />
            <Paper elevation={0} sx={{ m: 2, borderRadius: 3, p: 0, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: `1px solid ${palette.divider}`, bgcolor: palette.background?.paper }}>
                    <Icon name="password" isDarkMode={isDarkMode} width={24} height={24} />
                    <Typography sx={{ fontWeight: 800, pr: 1 }}>کلمه عبور</Typography>
                </Box>

                <Box
                    sx={{ p: 2, bgcolor: palette?.mode === 'dark' ? palette.background?.paper : palette?.grey[50] }}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handlePassword}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 500,
                            textTransform: 'none',
                            boxShadow: 'none',
                            py: 1.5,
                            bgcolor: palette?.mode === 'dark' ? palette?.grey[800] : palette?.grey[200],
                            color: palette?.mode === 'dark' ? palette.text?.primary : palette.text?.primary,
                            ':hover': {
                                bgcolor: palette?.mode === 'dark' ? palette?.grey[700] : palette?.grey[300]
                            }
                        }}
                    > 
                        تغییر کلمه عبور
                    </Button>
                </Box>
            </Paper>

            <Paper elevation={0} sx={{ m: 2, borderRadius: 3, p: 1, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: `1px solid ${palette.divider}`, bgcolor: palette.background?.paper }}>
                    <Icon name="setting" isDarkMode={isDarkMode} width={24} height={24} />
                    <Typography sx={{ fontWeight: 800, pr: 1 }}>تنظیمات نمایشی</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: palette?.mode === 'dark' ? palette.background?.paper : palette?.grey[50] }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 500, fontSize: "16px", pr: 1 }}>تم</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography>{isDarkMode ? "تیره" : "روشن"}</Typography>
                        <img
                            src={isDarkMode ? "/icons/homepage/light/darktheme.svg" : "/icons/homepage/light/lighttheme.svg"}
                            alt={isDarkMode ? "Dark Theme" : "Light Theme"}
                            style={{
                                width: isDarkMode ? 39 : 38,
                                height: 22,
                                cursor: 'pointer'
                            }}
                            onClick={toggleTheme}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{ p: 2, bgcolor: palette?.mode === 'dark' ? palette.background?.paper : palette?.grey[50] }}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleHomepageCustomization}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 500,
                            textTransform: 'none',
                            boxShadow: 'none',
                            py: 1.5,
                            bgcolor: palette?.mode === 'dark' ? palette?.grey[800] : palette?.grey[200],
                            color: palette?.mode === 'dark' ? palette.text?.primary : palette.text?.primary,
                            ':hover': {
                                bgcolor: palette?.mode === 'dark' ? palette?.grey[700] : palette?.grey[300]
                            }
                        }}
                    >
                        سفارش سازی خانه
                    </Button>
                </Box>
            </Paper>

            {/* Personality Section */}
            <Paper elevation={0} sx={{ m: 2, borderRadius: 3, p: 0, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: `1px solid ${palette.divider}`, bgcolor: palette.background.paper }}>
                    <Icon name="user" isDarkMode={isDarkMode} width={24} height={24} />
                    <Typography sx={{ fontWeight: 800, pr: 1 }}>شخصیت و علایق</Typography>
                </Box>

                <Box
                    sx={{ p: 2, bgcolor: palette.mode === 'dark' ? palette.background.paper : palette.grey[50] }}
                >
                    {/* Display selected personality if available */}
                    {personalityLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <CircularProgress size={20} />
                        </Box>
                    ) : userPersonality ? (
                        <Box sx={{
                            mb: 2,
                            p: 0,
                            borderRadius: 2,
                            bgcolor: palette.mode === 'dark' ? palette.grey[800] : palette.grey[200],
                            border: `1px solid ${palette.divider}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                bgcolor: palette.mode === 'dark' ? palette.grey[700] : palette.grey[300],
                                transform: 'translateY(-1px)',
                                boxShadow: shadows[2]
                            }
                        }}
                            // onClick={() => navigate('/personality')}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                    e.preventDefault();
                                    navigate('/personality');
                                }
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    boxShadow: 'none',
                                    py: 1,
                                    px: 0.5,
                                    color: palette.mode === 'dark' ? palette.text.primary : palette.text.primary,
                                    textAlign: 'center'
                                }}
                            >
                                {userPersonality.name}
                            </Typography>
                        </Box>
                    ) : null}

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate('/personality')}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 500,
                            textTransform: 'none',
                            boxShadow: 'none',
                            py: 1,
                            px: 0.5,
                            bgcolor: palette.mode === 'dark' ? palette.grey[800] : palette.grey[200],
                            color: palette.mode === 'dark' ? palette.text.primary : palette.text.primary,
                            ':hover': {
                                bgcolor: palette.mode === 'dark' ? palette.grey[700] : palette.grey[300]
                            }
                        }}
                    >
                        انتخاب شخصیت
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
