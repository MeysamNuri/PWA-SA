import { Box } from "@mui/material";
import React from "react";

interface ILoading {
    mt?: number
}
const AjaxLoadingComponent: React.FC<ILoading> = () => {


    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            alignContent: 'center',
        }}>
            {/* You can replace this with your actual loading spinner or animation */}
            <span className="loader"></span>
        </Box>);
}

export default AjaxLoadingComponent;