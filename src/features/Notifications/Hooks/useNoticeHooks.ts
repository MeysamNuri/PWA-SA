
import { useNavigate } from "react-router";
import useUpdateNotificationLog from "./APIHooks/useUpdateNotificationLog";
import type { INotificationResponse } from "../types";
import useNotificationsLogHook from "./APIHooks/useNotificationLogs";
import { useEffect, useState } from "react";

export default function useNoticeLogsHooks() {
    const { handleUpdateNotice,responseData } = useUpdateNotificationLog()
    const { refetch } = useNotificationsLogHook()
    const navigate = useNavigate()


    const handleBack = () => {
        navigate("/home")
    }
    const handleUpdateNoticeById = (notice: INotificationResponse) => {
        handleUpdateNotice(notice.id, {
            onSuccess: () => refetch()
        })
        if (notice.url !== "") {
            navigate(notice.url, { state: { notification: notice } })
        } else {
            navigate("/notifications/notFoundNotice")
        }

    }
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timerID = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        // Cleanup function to clear the interval when the component unmounts
        return () => {
            clearInterval(timerID);
        };
    }, []);
    const formattedTime24HourNoSeconds = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    });
    const notificationsData=responseData?.Data
    return {
        handleBack,
        handleUpdateNoticeById,
        formattedTime24HourNoSeconds,
        notificationsData
    }
}