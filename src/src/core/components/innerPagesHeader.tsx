import { Box, IconButton, Typography } from "@mui/material";
import useLayoutHooks from "../layouts/hooks";
import { useTheme } from "@mui/material/styles";
import InfoDialogs from "./infoDialog";
import { useState } from "react";
import { useInfoModalStore } from "../zustandStore";
import { Icon } from "./icons";
import { useThemeContext } from "../context/useThemeContext";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface IInfoDetails {
    path: string,
    title: string
}
export default function InnerPageHeader({ title, path, infoIcon }: { title: string, path: string, infoIcon?: IInfoDetails }) {
    const { palette } = useTheme();
    const [open, setOpen] = useState(false);
    const setInfoDetails = useInfoModalStore((state) => state.setInfoDetails)

    const {
        handleClick
    } = useLayoutHooks();

    const handleClickOpen = () => {
        if (infoIcon) {
            setInfoDetails(infoIcon)
        }
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const { isDarkMode } = useThemeContext();
    return (

        <Box sx={{
            p: 2,
            borderBottom: `1px solid ${palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            bgcolor: palette.background.default,
        }}>
            {
                infoIcon &&
                <IconButton
                    size="small"
                    aria-label="info-button"
                    sx={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "30px",
                        height: "30px",

                        "&:hover": {
                            backgroundColor: palette.action.hover
                        }
                    }}
                    onClick={handleClickOpen}
                >
                    <Icon name="infodialogdetail" isDarkMode={isDarkMode} width={32} height={32} />
                </IconButton>
            }

            <Typography
                variant="subtitle1"
                sx={{
                    flex: 1,
                    textAlign: 'center',
                    fontWeight: 500,
                    color: palette.text.primary
                }}
            >
                {title}
            </Typography>
            <IconButton
                size="small"
                aria-label="back-button"
                onClick={() => handleClick(path)}
                sx={{
                    position: 'absolute',
                    right: 15,
                    top: 10,
                    color: palette.text.primary,
                    '&:hover': {
                        backgroundColor: palette.action.hover
                    }
                }}
            >
                <ArrowForwardIcon />
            </IconButton>
            <InfoDialogs open={open} handleClose={handleClose} />
        </Box>
    )

}
