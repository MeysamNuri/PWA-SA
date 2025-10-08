
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useNotificationLogs from "../Hooks/APIHooks/useNotificationLogs";
import NoticeCards from "../Components/cards";
import InnerPageHeader from "@/core/components/innerPagesHeader";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
export default function NotificationsView() {
    const { notificationsData, isPending } = useNotificationLogs()
    const { palette } = useTheme();
    if (isPending) return <AjaxLoadingComponent mt={20} />
    return (
        <>
            <InnerPageHeader title="پیام ها" path="/home" />
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: palette.background.default,
                    p: 1

                }}
            >
                <NoticeCards notificationsData={notificationsData} />
            </Box>

        </>
    );
}
