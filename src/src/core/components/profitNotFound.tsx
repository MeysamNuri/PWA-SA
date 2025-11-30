import React from 'react';
import { Box, Typography } from '@mui/material';
import NotFoundIcon from '/images/salesnotfound.png';
import ChequesNotFoundIcon from '/images/chequenotfound.png';
interface ProfitNotFoundProps {
    message: string;
    isFromCheques?: boolean
}

const ProfitNotFound: React.FC<ProfitNotFoundProps> = ({ message, isFromCheques }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                marginTop: "25%"
            }}
        >
            <img src={isFromCheques ? ChequesNotFoundIcon : NotFoundIcon} />
            <br />
            <Typography variant="h6" color="textSecondary">
                {message}
            </Typography>
        </Box>
    );
};

export default ProfitNotFound;