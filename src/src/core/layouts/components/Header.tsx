import { Box, AppBar, Toolbar, IconButton, Badge } from '@mui/material';
import SidebarComponent from './sidebarComponent';
import useLayoutHooks from '../hooks'
import { NumberConverter } from '@/core/helper/numberConverter';
import useNotificationLogs from '@/features/Notifications/Hooks/APIHooks/useNotificationLogs';
import { useMemo } from 'react';
import { useTheme } from "@mui/material/styles";
import { Icon } from '@/core/components/icons';
import { useThemeContext } from '@/core/context/useThemeContext';

export default function Header() {
    const theme = useTheme();
    const { isDarkMode } = useThemeContext();
    const { sidebarOpen,
        setSidebarOpen,
        handleClick
    } = useLayoutHooks();
    const {
        notificationsData } = useNotificationLogs();

    const badgeCount = useMemo(() => {
        if (notificationsData) return notificationsData?.items?.filter((n: any) => !n.isRead).length.toString()
    }, [notificationsData])
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
                            {/* <img
                                src={getIconPath('Sidebar')}
                                alt="menu icon"
                                style={{ width: "32px", height: "32px" }}
                            /> */}
                            <Icon name="sidebar" isDarkMode={isDarkMode} width={32} height={32} />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <img
                            src={getIconPath('Holoo')}
                            alt="mobile icon"
                            style={{ width: "71px", height: "22px" }}
                        /> */}
                        <Icon name={isDarkMode ? "holoodark" : "holoo"} isDarkMode={isDarkMode} width={71} height={22} />
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
                            <Icon name="notification" isDarkMode={isDarkMode} width={32} height={32} />

                        </IconButton>
                    </Box>

                </Toolbar>
            </AppBar>

            <SidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </Box>
    );
}
