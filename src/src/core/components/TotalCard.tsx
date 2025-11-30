import React from "react";
import { Divider, Box, Typography, useTheme } from "@mui/material";
import { NumberConverter } from "@/core/helper/numberConverter";

interface TotalCardProps {
    rows: Array<{
        title: string;
        value: string | number;
        color?: string;
        unit?: string;
    }>;
    cardColor?: string;
}

const TotalCard: React.FC<TotalCardProps> = ({ rows, cardColor }) => {
    const { palette } = useTheme();
    
    return (
        <Box sx={{
            backgroundColor: cardColor || palette.background.paper,
            borderRadius: "16px",
            boxShadow: " 0 1px 4px #0001",
            direction: "rtl",
            margin: "0px 10px 10px 10px",
            border: `1px solid ${palette.divider}`,
            padding: " 16px",
            position: "sticky",
            top: "5px",
            zIndex: 9,
        }}>
            {
                rows.map((row, idx) => (
                    <React.Fragment key={idx}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}>
                            <Typography sx={{
                                color: palette.text.secondary,
                                fontSize: "16px",
                                fontWeight: 400,
                                textAlign: "right",
                            }}>{row.title}</Typography>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                                textAlign: "left",
                                color: row.color || palette.text.primary
                            }}

                            >
                                {`${row.value ? NumberConverter.latinToArabic(row.value.toLocaleString()) : 0} `}
                                    {row.unit && <span style={{ fontSize: '12px', color: palette.text.disabled }}>{row.unit}</span>}
                            </Typography>
                        </Box>
                        {idx !== rows.length - 1 && <Divider sx={{ backgroundColor: palette.divider, my: 1 }} />}
                    </React.Fragment>
                ))
            }
        </Box >
    );
};

export default TotalCard;
