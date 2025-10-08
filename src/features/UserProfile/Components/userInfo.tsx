import { Avatar, Box, Divider, Paper, Typography, useTheme } from "@mui/material";
import { NumberConverter } from "@/core/helper/numberConverter";
import type { IUserProfileDataRes } from '../types';

export default function UserInfo({ userProfileData, serial }: { userProfileData: IUserProfileDataRes | undefined, serial: string }) {
    const theme = useTheme();
    
    return (
        <Paper elevation={0} sx={{ m: 2, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2, borderBottom: `2px solid ${theme.palette.divider}` }}>
                <img src={`${import.meta.env.BASE_URL}images/sidebar/user.png`} alt="مانده نقد و بانک" style={{ width: 24, height: 24 }} />
                <Typography sx={{ fontWeight: 800, pr: 1 }}>اطلاعات حساب کاربری</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
                <Box sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3,
                }}>
                    <Avatar
                        src={`${import.meta.env.BASE_URL}images/userprofile.png`}
                        sx={{ width: 100, height: 100, mb: 1 }}
                    />
                </Box>
                <Box sx={{ bgcolor: theme.palette.background.paper, p: 0, border: `1px solid ${theme.palette.divider}`, borderRadius: "12px" }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                        <Typography color="text.secondary">نام کاربری</Typography>
                        <Typography variant="h6">{userProfileData && NumberConverter.latinToArabic(userProfileData?.phoneNumber)}</Typography>
                    </Box>

                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                        <Typography color="text.secondary">نام و نام خانوادگی</Typography>
                        <Typography variant="h6">{userProfileData?.firstName} {userProfileData?.lastName}</Typography>
                    </Box>

                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                        <Typography color="text.secondary">شماره همراه</Typography>
                        <Typography variant="h6">{userProfileData && NumberConverter.latinToArabic(userProfileData?.phoneNumber)}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                        <Typography color="text.secondary">عنوان کسب و کار</Typography>
                        <Typography variant="h6">{userProfileData?.businessName}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                        <Typography color="text.secondary">سریال نرم افزار</Typography>
                        <Typography variant="h6">{NumberConverter.latinToArabic(serial ?? "-")}</Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}
