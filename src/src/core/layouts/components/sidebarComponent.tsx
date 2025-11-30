import React from 'react'
import {
    Drawer,
    List,
    ListItem,
    Box,
    Typography,
    Avatar,
    useTheme,
} from '@mui/material'
import { Icon } from '@/core/components/icons'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { styled } from '@mui/material/styles'
import useLayoutHooks from '../hooks'
import { NumberConverter } from '@/core/helper/numberConverter'
import { useThemeContext } from '@/core/context/useThemeContext'
import { motion } from 'framer-motion';

// ✅ Move styled components OUTSIDE component to avoid re-creation each render
const StyledListItem = styled(ListItem)(({ theme }) => ({
    cursor: 'pointer',
    backgroundColor: theme.palette.background.paper,
    margin: '8px 12px',
    borderRadius: 12,
    paddingInline: 10,
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    padding: "0px 8px",
    direction: 'rtl',
    width: '90%',
    border: 'none',
    '&:hover': {
        backgroundColor:
            theme.palette.mode === 'dark'
                ? theme.palette.grey[800]
                : theme.palette.grey[200],
    },
}))

const ProfileCard = styled(ListItem)(({ theme }) => ({
    flexDirection: 'column',
    alignItems: 'center',
    mb: 2,
    border: 0,
    background: theme.palette.background.paper,
    width: '90%',
    margin: '8px 12px',
    padding: 8,
    borderRadius: 12,
    '&:hover': {
        backgroundColor: theme.palette.grey[200],
    },
}))

const FooterText = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    width: 229,
    height: 44,
    color: theme.palette.text.primary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
        theme.palette.mode === 'dark'
            ? theme.palette.grey[800]
            : theme.palette.grey[200],
    fontSize: 14,
    fontWeight: 400,
}))

// ✅ Sidebar component
const SidebarComponent: React.FC<{ open: boolean; onClose: () => void }> = ({
    open,
    onClose,
}) => {
    const theme = useTheme()
    const { isDarkMode } = useThemeContext()
    const {
        openMenu,
        menuItems,
        userProfileData,
        handleLogout,
        handleClick,
        handleClickMenu,
        handleUserProfile,
    } = useLayoutHooks({ onClose })

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 229,
                    background:
                        theme.palette.mode === 'dark'
                            ? theme.palette.grey[900]
                            : theme.palette.grey[100],
                    boxShadow:
                        theme.palette.mode === 'dark'
                            ? '0 0 24px 0 rgba(255,255,255,0.1)'
                            : '0 0 24px 0 rgba(0,0,0,0.08)',
                    px: 0,
                    pt: 0,
                },
            }}
        >
            <List component="nav" sx={{ px: 0, pt: 3, mb: 12 }}>
                {userProfileData && (
                    <ProfileCard>
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
                                width: '100%',
                                textAlign: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    color: theme.palette.error.main,
                                    fontWeight: 700,
                                    fontSize: 12,
                                }}
                            >
                                {userProfileData.firstName} {userProfileData.lastName}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.error.main,
                                    fontWeight: 400,
                                    fontSize: 15,
                                }}
                            >
                                {NumberConverter.latinToArabic(userProfileData.phoneNumber)}
                            </Typography>
                        </Box>
                    </ProfileCard>
                )}

                {menuItems?.map((item, index) => (
                    <React.Fragment key={index}>
                        <StyledListItem onClick={() => handleClickMenu(item)}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ ml: 1, mt: 1 }}>{item.Icon}</Box>
                                <Typography
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: 16,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {item.Name}
                                </Typography>
                            </Box>
                            {item.SubMenuItems.length > 0 &&
                                <Box
                                >
                                    <ExpandMore
                                        data-testid="ExpandMoreIcon"
                                        sx={{
                                            transition: 'transform .5s ease',
                                            transform: openMenu === item.Name ? 'rotate(0deg)' : 'rotate(90deg)',
                                            color: theme.palette.text.disabled,
                                            mt: 1
                                        }} />
                                </Box>

                            }
                        </StyledListItem>

                        {item.SubMenuItems.length > 0 && openMenu === item.Name && (

                            <List component="div" disablePadding>
                                {item.SubMenuItems.map((subItem, subIndex) => (
                                    <motion.div
                                        key={subIndex}
                                        className="text-center mb-16"
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: subIndex * 0.2 + 0.2 }}
                                    >
                                        <StyledListItem
                                            key={subIndex}
                                            onClick={() => handleClick(subItem.Navigation)}
                                            sx={{ fontSize: 13, p: 1 }}
                                        >
                                            {subItem.Name}
                                        </StyledListItem>
                                    </motion.div>
                                ))}
                            </List>

                        )}
                    </React.Fragment>
                ))}
            </List>
            <Box sx={{ position: "fixed", bottom: "0", right: "0" }}>
                <StyledListItem onClick={handleLogout}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ mt: 1, ml: 1, color: theme.palette.error.main }}>
                            <Icon name="exist" isDarkMode={isDarkMode} />
                        </Box>
                        <Typography
                            sx={{
                                fontWeight: 500,
                                fontSize: 16,
                                color: theme.palette.error.main,
                            }}
                        >
                            خروج
                        </Typography>
                    </Box>
                </StyledListItem>
                <FooterText variant="caption">نسخه ۱.۰.۰</FooterText>
            </Box>
        </Drawer>
    )
}

export default SidebarComponent
