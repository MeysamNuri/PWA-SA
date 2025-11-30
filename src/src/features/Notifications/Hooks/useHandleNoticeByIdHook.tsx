import { useChequeFilterStore } from "@/core/zustandStore";
import { useCallback } from "react";
import { ChequesDateFilterType } from "@/core/types/dateFilterTypes";
import { useNavigate } from "react-router";
import useUpdateNotificationLog from "./APIHooks/useUpdateNotificationLog";
import type { INotificationItems } from "../types";
import useNotificationsLogAPIHook from "./APIHooks/useNotificationLogs";



export default function useHandleNoticeByIdHook() {
    const { refetch } = useNotificationsLogAPIHook()
    // Mapping from URL to ChequesDateFilterType
    const URL_TO_DATE_FILTER: Record<string, ChequesDateFilterType> = {
        "Tomorrow": ChequesDateFilterType.TomorrowDate,
        "7days": ChequesDateFilterType.Next7DaysDate,
        "30days": ChequesDateFilterType.Next30DaysDate,
    };
    const navigate = useNavigate();
    const { handleUpdateNotice, responseData } = useUpdateNotificationLog();
    const setDataFilter = useChequeFilterStore((state) => state.setDataFilter);

    const handleUpdateNoticeById = useCallback(
        async (notice: INotificationItems) => {
            try {
                if (!notice.url) {
                    navigate("/notifications/notFoundNotice");
                } else {
                    // Extract URL key before "?" or any other params
                    const urlKey = notice.url.split("?")[0];
                    const filter = URL_TO_DATE_FILTER[urlKey] || ChequesDateFilterType.Next7DaysDate;
                    setDataFilter(filter);

                    navigate(notice.url);
                }

                // Call the update notice API
                handleUpdateNotice(notice.id, {
                    onSuccess: () => refetch(),
                });

            } catch (err) {
                return err
            }
        },
        [navigate, setDataFilter, handleUpdateNotice, responseData, refetch]
    );

    return {
        handleUpdateNoticeById,
        responseData,
    }
}