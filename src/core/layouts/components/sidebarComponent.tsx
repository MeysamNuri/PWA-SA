import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    Box,
    Typography,
    Avatar,
    useTheme
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import useLayoutHooks from '../hooks'
import useUserProfile from '@/features/UserProfile/Hooks/APIHooks';
import { NumberConverter } from '@/core/helper/numberConverter';


const SidebarComponent: React.FC<{ open: boolean, onClose: () => void }> = ({ open, onClose }) => {
    const theme = useTheme();
    const { openMenu,
        menuItems,
        handleLogout,
        handleClick,
        handleClickMenu,
        handleUserProfile
    } = useLayoutHooks({ onClose })
    const { userProfileData } = useUserProfile()
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 229,
                    background: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
                    boxShadow: theme.palette.mode === 'dark' ? '0 0 24px 0 rgba(255,255,255,0.1)' : '0 0 24px 0 rgba(0,0,0,0.08)',
                    px: 0,
                    pt: 0,
                }
            }}
        >
            <List component="nav" sx={{ px: 0, pt: 3 }}>
                {userProfileData && (
                    <ListItem sx={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 2,
                        border: 0,
                        background: theme.palette.background.paper,
                        width: "200px",
                        marginLeft: "12px"
                    }}>
                        <Avatar
                            src={`${import.meta.env.BASE_URL}images/userprofile.png`}
                            sx={{ width: 90, height: 90, mb: 1 }}
                        />
                        <Box
                            onClick={handleUserProfile}
                            sx={{
                                backgroundColor: `${theme.palette.error.main}15`,
                                padding: '10px 0',
                                borderRadius: '12px',
                                width: '90%',
                                textAlign: 'center',
                                mb: 1,
                                cursor: "pointer"

                            }}>
                            <Typography variant="body1" sx={{ color: theme.palette.error.main, fontWeight: 700, fontSize: 12 }}>
                                {userProfileData.firstName} {userProfileData.lastName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.error.main, fontWeight: 400, fontSize: 15 }}>
                                {NumberConverter.latinToArabic(userProfileData.phoneNumber)}
                            </Typography>
                        </Box>
                    </ListItem>
                )}

                {menuItems?.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListItem
                            component="button"
                            onClick={() => handleClickMenu(item)}
                            sx={{
                                cursor: "pointer",
                                backgroundColor: theme.palette.background.paper,
                                margin: '8px 12px',
                                borderRadius: '12px',
                                paddingY: '8px',
                                paddingX: '10px',
                                justifyContent: 'space-between',
                                display: 'flex',
                                alignItems: 'center',
                                direction: 'rtl',
                                border: 'none',
                                marginRight: '8px',
                                width: "90%"
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ ml: 1 }}>{item.Icon}</Box>
                                <Typography sx={{ fontWeight: 500, fontSize: 16, color: theme.palette.text.primary }}>
                                    {item.Name}
                                </Typography>
                            </Box>
                            {item.SubMenuItems.length > 0 &&
                                (openMenu === item.Name ? <ExpandLess sx={{ color: theme.palette.text.disabled }} /> : <ExpandMore sx={{ color: theme.palette.text.disabled }} />)}
                        </ListItem>
                        {item.SubMenuItems.length > 0 && openMenu === item.Name && (
                            <List component="div" disablePadding sx={{ px: 4 }} >
                                {item.SubMenuItems.map((subItem, subIndex) => (
                                    <ListItem
                                        key={subIndex}
                                        component="button"
                                        onClick={() => handleClick(subItem.Navigation)}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            paddingY: '4px',
                                            color: theme.palette.text.primary,
                                            background: theme.palette.grey[50],
                                            borderRadius: '8px',
                                            mb: 1,
                                            direction: 'rtl',
                                            fontWeight: 500,
                                            backgroundColor: theme.palette.background.paper,
                                            margin: '8px 12px',
                                            paddingX: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: 'none',
                                        }}

                                    >
                                        <Typography sx={{ fontSize: "12px" }}>
                                            {subItem.Name}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </React.Fragment>
                ))}

                <ListItem
                    component="button"
                    onClick={handleLogout}
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        margin: '8px 12px',
                        borderRadius: '12px',
                        paddingY: '8px',
                        paddingX: '10px',
                        justifyContent: 'space-between',
                        display: 'flex',
                        alignItems: 'center',
                        direction: 'rtl',
                        border: 'none',
                        marginRight: '8px',
                        width: "90%"
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={handleLogout}>
                        <Box sx={{ ml: 1, color: theme.palette.error.main }}>
                            <img
                                src={`${import.meta.env.BASE_URL}images/sidebar/exist.png`}
                                alt="mobile icon"
                                style={{ width: "24px", height: "24px" }}
                            />
                        </Box>
                        <Typography sx={{ fontWeight: 500, fontSize: 16, color: theme.palette.error.main }}>
                            خروج
                        </Typography>
                    </Box>
                </ListItem>

                <Typography variant="caption" sx={{ 
                    textAlign: 'center', 
                    width: '229px', 
                    height: "44px", 
                    color: theme.palette.text.primary, 
                    mt: "180px", 
                    mb: 1, 
                    display: 'flex', 
                    justifyContent: "center", 
                    alignItems: "center", 
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200], 
                    fontSize: "14px", 
                    fontWeight: 400 
                }}>
                    نسخه  ۱.۰.۰
                </Typography>
            </List>
        </Drawer>
    );
};

export default SidebarComponent;