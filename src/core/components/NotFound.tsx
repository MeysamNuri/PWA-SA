
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const {palette} = useTheme();

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            textAlign: "center",
            padding: "20px",
            backgroundColor: palette.background.default,
            color: palette.text.primary
        }}>
            <Typography variant="h1" sx={{ 
                fontSize: 72, 
                margin: 0, 
                color: palette.error.main,
                fontWeight: "bold"
            }}>
                404
            </Typography>
            <Typography variant="h2" sx={{ 
                margin: "16px 0", 
                color: palette.text.primary,
                fontWeight: "normal"
            }}>
                صفحه مورد نظر پیدا نشد
            </Typography>
            <Typography variant="body1" sx={{ 
                color: palette.text.secondary, 
                marginBottom: 32,
                maxWidth: "500px"
            }}>
                متاسفیم، صفحه‌ای که به دنبال آن بودید وجود ندارد.
            </Typography>
            <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{
                    fontFamily: "YekanBakh",
                    padding: "10px 24px",
                    fontSize: 18,
                    borderRadius: 8,
                    backgroundColor: palette.primary.main,
                    color: palette.primary.contrastText,
                    border: "none",
                    cursor: "pointer",
                    "&:hover": {
                        backgroundColor: palette.primary.dark,
                    }
                }}
            >
                بازگشت به صفحه اصلی
            </Button>
        </Box>
    );
};

export default NotFound; 