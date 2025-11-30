import { Box, Card, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import type { INotificationResponse } from "../types";
import { NumberConverter } from "@/core/helper/numberConverter";
import moment from "moment-jalaali";
import { useTheme } from "@mui/material/styles";
import { memo } from "react";
import MailIcon from '@mui/icons-material/Mail';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import usneHandleNoticeByIdHook from "../Hooks/useHandleNoticeByIdHook";
interface NoticeCardsProps {
  notificationsData?: INotificationResponse;

}

const NoticeCards = memo(({ notificationsData  }: NoticeCardsProps) => {
  const { palette } = useTheme();
  const { handleUpdateNoticeById } = usneHandleNoticeByIdHook();


  if (!notificationsData?.items.length) {
    return (
      <Typography sx={{ textAlign: "center", color: "text.secondary", mt: 2 }}>
        هیچ پیامی موجود نیست
      </Typography>
    );
  }
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {notificationsData?.items?.map((notice) => {
        const { id, isRead, title, created, body } = notice;
        const timePart = created ? created?.split("T")[1] : "";
        const [hour, minute] = timePart.split(":")
        const displayDate = NumberConverter.latinToArabic(moment(created).format("jYYYY/jMM/jDD"));
        const displayTime = `${NumberConverter.latinToArabic(hour)}:${NumberConverter.latinToArabic(minute)}`;

        const textColor = isRead ? palette.primary.main : palette.primary.light;
        const fontWeight = isRead ? 500 : 900;

        return (
          <Card
            key={id}
            sx={{
              borderRadius: "20px", 
              boxShadow: "none",
              direction: "rtl",
              cursor: "pointer",
            }}
            onClick={() => handleUpdateNoticeById(notice)}
          >
            <Box sx={!isRead ? { border: "2px solid", borderRadius: "20px",borderColor:palette.primary.main } : { border: "none", borderRadius: "20px" }}>
              {/* Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ py: 1, px: 2 }}
              >
                <Typography sx={{display:"flex",maxWidth:"210px"}} variant="h6" fontSize={18} fontWeight={fontWeight} color={textColor}>
                  {title} <span style={{marginRight:"15px"}}> {!isRead?<MailIcon  />: <MarkEmailReadIcon />}</span>
                </Typography>
                <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                  <Typography sx={{ ml: 1 }} variant="body2" fontWeight={fontWeight} color={textColor}>
                    {displayTime}
                  </Typography>
                  <Typography variant="body1" fontWeight={fontWeight} color={textColor}>
                    {displayDate}
                  </Typography>
                </Box>
              </Box>

              {/* Body */}
              <Box
                sx={{ borderTop: "2px solid #E2E6E9", py: 1, px: 2 }}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" fontSize={15} color={textColor}>
                  {body}
                </Typography>
                <IconButton size="small">
                  <ArrowBackIosNewIcon sx={{ width: "14px" }} />
                </IconButton>
              </Box>
            </Box>
          </Card>
        );
      })}
    </Box>
  );
});

export default NoticeCards;
