import InnerPageHeader from "@/core/components/innerPagesHeader";
import { Box } from "@mui/material";
import PaperCard from "../Components/paperCard";
import { useTheme } from "@mui/material/styles";

export default function UserProfileView() {
    const { palette } = useTheme();

    const supportList = [
        {
            id: 1,
            title: "گفتگوی آنلاین",
            path: "chatBot"
        },
        {
            id: 2,
            title: "گفتگوی تلفنی",
            path: "call"
        }
    ]

    return (
        <Box sx={{
            minHeight: '100vh',
            overflow: 'hidden',
            direction: "rtl",

        }}>
            {/* Header */}
            <InnerPageHeader title="پشتیبانی" path="/home" />
            <Box sx={{bgcolor:palette.background.paper,padding:"5px 0",borderRadius:"10px"}}>
                {
                    supportList.map((i) => (
                        <PaperCard key={i.id} title={i.title} path={i.path} />
                    ))
                }
            </Box>

        </Box>
    );
}
