import React from "react";
import { Button, Box, useTheme } from "@mui/material";
import { ChequesDateFilterType, DateFilterType } from "@/core/types/dateFilterTypes";

interface DateFilterProps {
    value: string | DateFilterType | ChequesDateFilterType;
    onChange: (value: string | DateFilterType | ChequesDateFilterType) => void;
    options?: { label: string; value: string | DateFilterType | ChequesDateFilterType }[];
    align?: "left" | "right" | "center";
}

const defaultOptions = [
    { label: "۳۰ روز گذشته", value: DateFilterType.Last30Days },
    { label: "۷ روز گذشته", value: DateFilterType.Last7Days },
    { label: "دیروز", value: DateFilterType.Yesterday },
    { label: "فروش امروز", value: DateFilterType.Today }
];

const DateFilter: React.FC<DateFilterProps> = ({ value, onChange, options = defaultOptions, align = "right" }) => {
    const { palette } = useTheme();
    
    // Fallback values for theme properties
    const buttonMainColor = palette.button?.main || palette.error?.main 
    const textSecondaryColor = palette.text?.secondary 
    const backgroundDefaultColor = palette.background?.default 
    const dividerColor = palette.divider
    const isDarkMode = palette.mode === 'dark';
    
    return (
        <Box
            sx={{
                display: "flex",
                gap: 1,
                mt: 2,
                flexWrap: { xs: 'nowrap', sm: 'nowrap' },
                whiteSpace:"nowrap",
                justifyContent: align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start",
                width: '100%',
                marginBottom: '10px',
                marginRight: '10px',
            }}
        >
            {options.map((chip) => (
                <Button
                    key={chip.value}
                    variant="outlined"
                    sx={{
                        color: value === chip.value 
                            ? buttonMainColor
                            : textSecondaryColor,
                        background: value === chip.value 
                            ? isDarkMode 
                                ? 'rgba(253, 92, 99, 0.1)' 
                                : '#FFEBEE'
                            : backgroundDefaultColor,
                        fontSize: { xs: 12, sm: 14 },
                        fontWeight: 400,
                        border: `1px solid ${dividerColor}`,
                        borderRadius: 2,
                        height: 32,
                        width: { sm: 105 },
                        minWidth: 'unset',
                        direction: 'rtl',
                        '&:hover': {
                            borderColor: buttonMainColor,
                            backgroundColor: isDarkMode 
                                ? 'rgba(253, 92, 99, 0.05)' 
                                : '#FFEBEE'
                        }
                    }}
                    onClick={() => onChange(chip.value)}
                >
                    <span>{chip.label}</span>
                </Button>
            ))}
        </Box>
    );
};

export default DateFilter;
