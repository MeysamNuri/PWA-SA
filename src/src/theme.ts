// src/theme.ts
import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") => createTheme(getDesignTokens(mode));

export const getDesignTokens = (mode: "light" | "dark") => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {
                // Light mode palette
                primary: {
                    light: "#565A62",
                    main: "#484B51",
                    dark: "#262626",
                    contrastText: "#FFFFFF",
                },             
                background: {
                    default: "#ECEFF1",
                    paper: "#FFFFFF",
                    secondary: "#FFEBEE",
                },
                text: {
                    primary: "#262626",
                    secondary: "#484B51",
                    disabled: "#A0A4AB",
                },
                button: {
                    main: "#E42628",
                    light: "#F3F5F6",
                    dark: "#b71c1c",
                    contrastText: "#FFFFFF",
                },
                error: {
                    main: "#E42628",
                    light: "#F44336",
                    dark: "#c62828",
                    contrastText: "#FFFFFF",
                },
                success: {
                    main: "#03CC77",
                    dark: "#288542",
                    light: "#68F3B8",
                    contrastText: "#FFFFFF",
                },
                warning: {
                    main: "#FF9800",
                    light: "#FFB74D",
                    dark: "#F57C00",
                    contrastText: "#FFFFFF",
                },
                info: {
                    main: "#2196F3",
                    light: "#64B5F6",
                    dark: "#1976D2",
                    contrastText: "#FFFFFF",
                },
                divider: "#F3F5F6",
            }
            : {
                // Dark mode palette
                primary: {
                    light: "#E2E6E9",
                    main: "#FFFFFF",
                    dark: "#A0A4AB",
                    contrastText: "#0D0D0D",
                },
                background: {
                    default: "#0D0D0D",
                    paper: "#242424",
                },
                text: {
                    primary: "#FFFFFF",
                    secondary: "#E2E6E9",
                    disabled: "#A0A4AB",
                },
                button: {
                    main: "#FD5C63",
                    light: "#242424",
                    dark: "#E42628",
                    contrastText: "#FFFFFF",
                },
                error: {
                    main: "#E42628",
                    light: "#FD5C63",
                    dark: "#c62828",
                    contrastText: "#FFFFFF",
                },
                success: {
                    main: "#68F3B8",
                    dark: "#03CC77",
                    light: "#68F3B8",
                    contrastText: "#0D0D0D",
                },
                warning: {
                    main: "#FF9800",
                    light: "#FFB74D",
                    dark: "#F57C00",
                    contrastText: "#FFFFFF",
                },
                info: {
                    main: "#2196F3",
                    light: "#64B5F6",
                    dark: "#1976D2",
                    contrastText: "#FFFFFF",
                },
                divider: "#242424",
            }),
    },
    typography: {
        fontFamily:
            'YekanBakh, YekanBakh-bold, "Roboto", "Helvetica", "Arial", sans-serif',
        h6: {
            fontFamily: "YekanBakh-bold",
            fontSize: "1rem"

        },
        caption: {
            fontFamily: "YekanBakh-bold",
        },
        body1:{
            fontFamily: "YekanBakh-bold",

        },
        body2:{
            fontFamily: "YekanBakh",
            fontSize: "14px",
             color:  "#565A62" 

        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: mode === "light" ? "#ECEFF1" : "#0D0D0D",
                    color: mode === "light" ? "#262626" : "#FFFFFF",
                },
            },
        },
    },
});

declare module "@mui/material/styles" {
    interface Palette {
        button: Palette["primary"];
    }
    interface PaletteOptions {
        button?: PaletteOptions["primary"];
    }
}
