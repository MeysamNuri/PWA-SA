
import {  useEffect, useMemo, useState } from "react";
import type { readStatus } from "../types";
import useNotificationsLogAPIHook from "./APIHooks/useNotificationLogs";
import { useIsreadNotice } from "@/core/zustandStore";

export default function useNoticeLogsHooks() {

    const [currentTime, setCurrentTime] = useState(() => new Date());
    const setIsRead = useIsreadNotice((state) => state.setIsRead);
    const isRead = useIsreadNotice((state) => state.isRead);
    const noticeFilter = {
        true: true,
        false: false,
        all: undefined,
    }[isRead];

    const [pageModel, setPageModel] = useState({
        pageNumber: 1,
        itemsPerPage: 5
    })
    const { notificationsData,
        isPending } = useNotificationsLogAPIHook(noticeFilter, pageModel.pageNumber, pageModel.itemsPerPage);



  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

 

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageModel({
            ...pageModel,
            pageNumber: value
        })
    }
    const handlePageSizeChange = (e: any) => {
        setPageModel({
            ...pageModel,
            pageNumber: 1,
            itemsPerPage: e.target.value
        })

    };
    const handleIsReadOnchange = (value: readStatus) => {
        setIsRead(value)

    }
     const formattedTime24HourNoSeconds = useMemo(() => {
        const h = currentTime.getHours().toString().padStart(2, "0");
        const m = currentTime.getMinutes().toString().padStart(2, "0");
        return `${h}:${m}`;
    }, [currentTime]);
    
    return {
        handlePageChange,
        handlePageSizeChange,
        handleIsReadOnchange,
        isRead,
        notificationsData,
        isPending,
        pageModel,
        formattedTime24HourNoSeconds
    };
}
