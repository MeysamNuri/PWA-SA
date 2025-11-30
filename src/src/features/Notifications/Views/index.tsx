import { Box, MenuItem, Pagination, Select } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  useMemo
} from "react";

import NoticeCards from "../Components/cards";
import InnerPageHeader from "@/core/components/innerPagesHeader";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
import useNoticeLogsHooks from "../Hooks/useNoticeHooks";
import DateFilter from "@/core/components/DateFilter";
import type { readStatus } from "../types";


export default function NotificationsView() {
  const { isPending, notificationsData,
    pageModel,
    isRead,
    handlePageChange,
    handlePageSizeChange,
    handleIsReadOnchange
  } = useNoticeLogsHooks()

  const { palette } = useTheme();
  const stableNotifications = useMemo(() => notificationsData, [notificationsData]);
  if (isPending) return <AjaxLoadingComponent />;


  return (
    <>
      <InnerPageHeader title="پیام ها" path="/home" />

      <Box
        sx={{
          backgroundColor: palette.background.default,
          p: 2,
          minHeight: "100vh",
        }}
      >
        <DateFilter options={[
          { label: 'خوانده نشده', value: "false" },
          { label: 'خوانده شده', value: "true" },
          { label: 'همه', value: "all" }

        ]} onChange={(value) => handleIsReadOnchange(value as readStatus)} value={isRead} />
        <NoticeCards
          notificationsData={stableNotifications}

        />
        {
          notificationsData?.totalPages && notificationsData?.totalPages> 0 ?

            <Box sx={{ display: "flex", gap: 2, alignItems: "center", backgroundColor: "white", my: 3, p: 1, borderRadius: 3 }}>
              <Select value={pageModel?.itemsPerPage} onChange={handlePageSizeChange} size="small" sx={{ mr: 1 }}>

                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>
              <Pagination siblingCount={0} count={notificationsData?.totalPages} page={pageModel?.pageNumber} onChange={handlePageChange} variant="outlined" shape="rounded" />
            </Box>
            : null
        }
      </Box>
    </>
  );
}
