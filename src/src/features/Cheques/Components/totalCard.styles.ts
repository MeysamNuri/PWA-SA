import { Card, CardContent, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const BodyCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: '0 0 16px 16px',
    boxShadow: 'unset',
    direction: 'rtl',
    margin: '0px 10px',
    border: `1px solid ${theme.palette.divider}`,
    borderTop: `2px solid ${theme.palette.divider}`,
    marginBottom: '5px',
}));

export const HeaderCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: '16px 16px 0 0',
    boxShadow: 'unset',
    direction: 'rtl',
    margin: '0px 10px',
    border: `1px solid ${theme.palette.divider}`,
    borderBottom: 'none',
}));

export const StyledCardContent = styled(CardContent)({
    padding: '8px 12px !important',
});

export const BodyStyledCardContent = styled(CardContent)(({ theme }) => ({
    padding: '8px !important',
    borderBottom: `2px solid ${theme.palette.divider}`,
}));

export const InfoRow = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0px 8px',
});

export const HeaderInfoRow = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

export const Label = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.disabled,
    fontSize: '14px',
    fontWeight: 500,
}));

export const Value = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: '14px',
    direction: 'rtl',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    span: {
        fontSize: '12px',
        color: theme.palette.text.disabled,
        marginRight: '5px',
    }
}));