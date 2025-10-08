import { Typography, Box } from "@mui/material";


export default function LogoSection() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <img
                src={`${import.meta.env.BASE_URL}images/loginicons/holooicon.svg`}
                alt="Login"
                className="logo-image"
            />
            <Typography variant="h5" gutterBottom color="#FFFFFF">
                دستیار هوشمند هلو
            </Typography>
        </Box>
    )
}