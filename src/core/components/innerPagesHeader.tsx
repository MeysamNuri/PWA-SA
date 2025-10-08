
import { Box, IconButton, Typography } from "@mui/material";
import useLayoutHooks from "../layouts/hooks";
import { useTheme } from "@mui/material/styles";

export default function InnerPageHeader({ title, path }: { title: string, path: string }) {
    const theme = useTheme();
    const {
        handleClick
    } = useLayoutHooks();

    return (

        <Box sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            bgcolor: theme.palette.background.default,
        }}>
            <Typography
                variant="subtitle1"
                sx={{
                    flex: 1,
                    textAlign: 'center',
                    fontWeight: 500,
                    color: theme.palette.text.primary
                }}
            >
                {title}
            </Typography>
            <IconButton
                size="small"
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.text.primary,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover
                    }
                }}
            >
                <img
                    src={`${import.meta.env.BASE_URL}images/backroute.png`}
                    onClick={() => handleClick(path)}
                    style={{
                        filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
                    }}
                />
            </IconButton>
        </Box>
    )

}
