import { Box, useTheme } from "@mui/material";
import React from "react";

interface ILoading {
    mt?: number
}
const AjaxLoadingComponent: React.FC<ILoading> = ({ mt }) => {
    const { palette } = useTheme();

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '90vh',
            alignContent: 'center',
            backgroundColor: palette.background.default,
            mt: mt
        }}>
        <div className="loader"></div>
        </Box>);
}

export default AjaxLoadingComponent;