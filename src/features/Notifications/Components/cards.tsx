
import { Box, Card, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import type { INotificationResponse } from "../types";
import { NumberConverter } from "@/core/helper/numberConverter";
import moment from "moment-jalaali";
import useNoticeLogsHooks from "../Hooks/useNoticeHooks";
import { useTheme } from "@mui/material/styles";



interface INoticeCardHooks {
    notificationsData?: INotificationResponse[];
}

export default function NoticeCards({ notificationsData = [] }: INoticeCardHooks = {}) {
    const { palette } = useTheme();

    const { handleUpdateNoticeById } = useNoticeLogsHooks()
    return (
        <Box display="flex" flexDirection="column" gap={1}>
            {
                notificationsData?.length > 0 ?
                    notificationsData?.map((notice, idx) => (
                        <Card
                            key={notice.id || idx}
                            sx={{
                                borderRadius: '20px',
                                border: '1px solid #C3C7CC',
                                boxShadow: 'none',
                                direction: 'rtl',
                                cursor:"pointer"

                            }}
                            onClick={() => handleUpdateNoticeById(notice)}
                        >
                            <Box sx={!notice.isRead ? { border: "1px solid black", borderRadius: "20px" } : {}}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ py: 1, px: 2 }}>
                                    <Typography variant="h6" fontSize={18} fontWeight={!notice.isRead ? 600 : 500} color={!notice.isRead ? palette.primary.light : palette.primary.main}>
                                        {notice.title}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={!notice.isRead ? 600 : 500} color={!notice.isRead ? palette.primary.light : palette.primary.main}>
                                        {NumberConverter.latinToArabic(moment(notice.created).format('jYYYY/jMM/jDD'))}
                                    </Typography>

                                </Box>
                                <Box sx={{ borderTop: "2px solid #E2E6E9", py: 1, px: 2 }} display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" fontSize={15} >
                                        {notice.body}
                                    </Typography>
                                    <IconButton size="small" >
                                        <ArrowBackIosNewIcon sx={{ width: "14px" }} />
                                    </IconButton>

                                </Box>
                            </Box>
                        </Card>


                    )) :

                    <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 2 }}>
                        هیچ پیامی موجود نیست
                    </Typography>

            }
        </Box>
    );
}
