import { Box, IconButton, Paper, Typography, } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {useNavigate} from 'react-router'
import { Icon } from '@/core/components/icons';
import { useThemeContext } from '@/core/context/useThemeContext';

export default function PaperCard({ title, path }: { title: string, path: string }) {
    const { palette } = useTheme();
    const { isDarkMode } = useThemeContext();

    const navigator=useNavigate()
    const handlePath = (path: string) => {
        if(path==="chatBot") return navigator("/supports/chatbot")
        if(path==="call") return   window.location.href = `tel:09120339253`;

    }
    return (
        <Paper elevation={0} sx={{ m: 1.5, borderRadius: 3, p: 0, overflow: 'hidden' }}>
            <Box sx={{
                position: "relative",
                display: 'flex',
                alignItems: 'center', p: 2,
                borderBottom: `1px solid ${palette.divider}`,
                bgcolor:palette.background.default
               
            }}
                onClick={() => handlePath(path)}
            >

                <Typography sx={{ fontWeight: 800, pr: 1 }}>{title}</Typography>

                <IconButton
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 15,
                        left: 15,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        "&:hover": {
                            backgroundColor: palette.action.hover
                        }
                    }} 

                >
                     <Icon name= {path==="call"?("phone"):("message")} isDarkMode={isDarkMode}  />
                </IconButton>
            </Box>

        </Paper>
    )
}