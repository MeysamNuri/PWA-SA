import { Box, AppBar, Toolbar, IconButton, Badge } from '@mui/material';
import SidebarComponent from './sidebarComponent';
import useLayoutHooks from '../hooks'
import { NumberConverter } from '@/core/helper/numberConverter';
import useNoticeLogsHooks from '@/features/Notifications/Hooks/useNoticeHooks';
import { useMemo } from 'react';
import { useTheme } from "@mui/material/styles";
import { useThemeContext } from '@/core/context/useThemeContext';

export default function Header() {
    const theme = useTheme();
    const { isDarkMode } = useThemeContext();
    const { sidebarOpen,
        setSidebarOpen,
        handleClick
    } = useLayoutHooks();
    const { notificationsData } = useNoticeLogsHooks()
    const badgeCount = useMemo(() => {
        if (notificationsData) return notificationsData?.filter((n:any) => !n.isRead).length.toString()
    }, [notificationsData])

    // Get icon paths based on theme
    const getIconPath = (iconName: string) => {
        const basePath = `${import.meta.env.BASE_URL}images/Appbaricons/`;
        return isDarkMode ? `${basePath}${iconName}dark.png` : `${basePath}${iconName}.png`;
    };

    return (
        <Box >
            <AppBar position="relative" sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                width: "100%",
                maxWidth: "100vw",
                right: 0,
                boxShadow: "none",
            }}>
                <Toolbar sx={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    justifyContent: 'space-between',
                    minHeight: "48px !important",
                    padding: "0 16px"
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            onClick={() => setSidebarOpen(true)}
                        >
                            <img
                                src={getIconPath('Sidebar')}
                                alt="menu icon"
                                style={{ width: "32px", height: "32px" }}
                            />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src={getIconPath('Holoo')}
                            alt="mobile icon"
                            style={{ width: "71px", height: "22px" }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        
                        {/* Notifications */}
                        <IconButton color="inherit"
                            onClick={() => handleClick('/notifications')}
                        >
                            {
                                badgeCount && badgeCount > "0" ?
                                    <Badge
                                        badgeContent={NumberConverter.latinToArabic(badgeCount)}
                                        color="error"
                                        max={99}
                                    ></Badge> : null
                            }

                            <img
                                src={getIconPath('Notification')}
                                alt="mobile icon"
                                style={{ width: "32px", height: "32px" }}
                            />

                        </IconButton>
                    </Box>

                </Toolbar>
            </AppBar>

            <SidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </Box>
    );
}
