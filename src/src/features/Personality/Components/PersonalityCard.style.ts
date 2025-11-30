// All comments must be in English
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

// Main container with light gray border
export const PickerHeaderCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: theme.shadows[1],
  marginBottom: "16px",
}));

// Header content area
export const PickerHeaderContent = styled(Box)(() => ({
  padding: "16px 16px 12px 12px",
}));

// Divider line
export const PickerDivider = styled(Box)(({ theme }) => ({
  height: "1px",
  backgroundColor: theme.palette.divider,
  width: "100%",
}));

// Body container
export const PickerBodyCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

// Body content area
export const PickerBodyContent = styled(Box)(() => ({
  padding: "0",
}));

// Individual option row with its own border - smaller and more elegant
export const OptionRow = styled(Box, {
  shouldForwardProp: (prop) => !["selected", "danger", "withDivider"].includes(prop as string),
})<{ selected: boolean; danger: boolean; withDivider: boolean }>(({ theme, selected, withDivider }) => ({
  padding: "12px 16px",
  transition: "all 0.2s ease",
  backgroundColor: selected
    ? theme.palette.mode === 'dark'
      ? theme.palette.error.dark + '20'
      : theme.palette.error.light + '20'
    : theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  margin: "6px",
  borderRadius: "8px",
  marginBottom: withDivider ? "6px" : "0",

  "&:hover": {
    backgroundColor: selected
      ? theme.palette.mode === 'dark'
        ? theme.palette.error.dark + '30'
        : theme.palette.error.light + '30'
      : theme.palette.action.hover,
    transform: "translateY(-1px)",
    boxShadow: theme.shadows[2],
  },
}));

// Option title styling - more compact
export const OptionTitle = styled(Typography, {
  shouldForwardProp: (prop) => !["selected", "danger"].includes(prop as string),
})<{ selected: boolean; danger: boolean }>(({ theme, selected, danger }) => ({
  fontSize: "16px",
  fontWeight: 500,
  lineHeight: 1.3,
  textAlign: "right",
  direction: "rtl",
  marginBottom: "6px",
  color: danger
    ? theme.palette.error.main
    : selected
      ? theme.palette.error.main
      : theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  gap: "6px",
}));

// Option summary styling - more compact
export const OptionSummary = styled(Typography, {
  shouldForwardProp: (prop) => !["selected", "danger"].includes(prop as string),
})<{ selected: boolean; danger: boolean }>(({ theme, selected, danger }) => ({
  fontSize: "13px",
  fontWeight: 400,
  color: danger
    ? theme.palette.error.main
    : selected
      ? theme.palette.error.main
      : theme.palette.text.secondary,
  marginLeft: "6px",
  component: "span", // Use span instead of p to avoid nesting issues
}));

// Option description styling - more compact
export const OptionDesc = styled(Typography, {
  shouldForwardProp: (prop) => !["selected", "danger"].includes(prop as string),
})<{ selected: boolean; danger: boolean }>(({ theme, selected, danger }) => ({
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: 1.2,
  textAlign: "right",
  direction: "rtl",
  color: danger
    ? theme.palette.error.main
    : selected
      ? theme.palette.error.main
      : theme.palette.text.secondary,
}));
