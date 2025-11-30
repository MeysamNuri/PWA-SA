import { Box } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";


export default function BackArrow({ handleBack }: { handleBack: () => void }) {
    return (
        <Box
            sx={{
                position: "absolute",
                top: 16,
                left: 16,
            }}
        >
            <Box
                role="button"
                onClick={handleBack}
                sx={{ minWidth: 0, p: 0, color: "#FFFFFF" }}
            >
                <ArrowBackIosNewIcon />
            </Box>
        </Box>
    )
}