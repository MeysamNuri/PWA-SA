import { Card, CardContent, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const BodyCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: '0 0 16px 16px',
    boxShadow: 'unset',
    direction: 'rtl',
    margin: '0px 10px',
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: '5px',
}));

export const HeaderCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: '16px 16px 0 0',
    boxShadow: 'unset',
    direction: 'rtl',
    margin: '0px 10px',
    border: `1px solid ${theme.palette.divider}`,
}));

export const HeaderCardd = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: '16px 16px 0 0',
    boxShadow: 'unset',
    direction: 'rtl',
    margin: '0px 10px',
    border: `1px solid ${theme.palette.divider}`,
}));

export const StyledCardContent = styled(CardContent)({
    padding: '8px 12px !important',
});

export const BodyStyledCardContent = styled(CardContent)({
    padding: '8px !important',
});

export const InfoRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: `1px solid ${theme.palette.divider}`,
    padding: '4px 8px',
    borderRadius: '16px',
}));

export const HeaderInfoRow = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

export const Label = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.disabled,
    fontFamily: "YekanBakh-bold"
}));

export const Value = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: '16px',
    direction: 'rtl',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
})); 