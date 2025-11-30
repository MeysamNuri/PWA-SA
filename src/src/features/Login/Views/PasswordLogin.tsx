import './styles.scss'
import { Container, Typography, Box, TextField, InputAdornment, IconButton, useTheme } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { ValidatorForm } from 'react-material-ui-form-validator';
import usePasswordLoginHook from '../Hooks/useLoginPasswordHooks'
import useLoginHook from "../Hooks/useLoginHooks";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LogoSection from '../Components/logoSection';
import BackArrow from '../Components/backArrow';
import ButtonComponent from '@/core/components/Button';

export default function PasswordLogin() {
    const theme = useTheme();
    const {
        handleBack,
        handleSubmitPassword,
        isFormValid,
        handleChange,
        formData,
        handleFogetPassword,
        isPending
    } = usePasswordLoginHook()

    const {
        handleTogglePassword,
        showPassword,

    } = useLoginHook();
    return (

        <Box className="login-page">
            <Container maxWidth="sm">
                <BackArrow handleBack={handleBack} />
                <LogoSection />
                <Box>
                    <Box sx={{
                        background: theme.palette.background.paper,
                        padding: "12px",
                        borderRadius: "16px 16px 0 0",
                        lineHeight: "0 !important",
                        marginTop: "5rem",
                        direction: "rtl",
                        borderBottom: `2px solid ${theme.palette.divider}`
                    }}>
                        <Typography variant="h6" color="primary.main">
                            ورود با کلمه عبور
                        </Typography>
                    </Box>

                    <Box sx={{
                        background: theme.palette.background.paper,
                        padding: "20px 15px 10px 15px",
                        borderRadius: "0 0 16px 16px",
                        textAlign: "start"
                    }}>
                        <ValidatorForm

                            onSubmit={handleSubmitPassword}
                        >
                            <Typography variant="subtitle2" color="primary.main" sx={{ px: 1 }}>
                                کلمه عبور را وارد کنید
                            </Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                type={showPassword ? "text" : "password"}
                                onChange={handleChange}
                                name="passwordLogin"
                                value={formData.password}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleTogglePassword}
                                                edge="start"
                                            >
                                                {!showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                                        borderRadius: '12px',
                                        direction: "ltr",
                                        '& fieldset': {
                                            border: 'none'
                                        },
                                        '&:hover fieldset': {
                                            border: 'none'
                                        },
                                        '&.Mui-focused fieldset': {
                                            border: 'none'
                                        }
                                    }
                                }}
                            />


                            <Typography
                                variant="caption"
                                sx={{
                                    textAlign: "right",
                                    color: "#E42628",
                                    fontWeight: 500,
                                    display: "flex",
                                    padding: "5px 10px 5px 0",
                                    cursor: "pointer",
                                    gap: "5px"
                                }}
                                onClick={handleBack}
                            >
                                ورود با کلمه یکبار مصرف
                                <ArrowBackIosNewIcon sx={{ width: "15px", height: "10px", mt: "4px" }} />
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    textAlign: "right",
                                    color: "#E42628",
                                    fontWeight: 500,
                                    display: "flex",
                                    padding: "5px 10px 15px 0",
                                    cursor: "pointer",
                                    gap: "5px"
                                }}
                                onClick={handleFogetPassword}
                            >
                                فراموشی کلمه عبور
                                <ArrowBackIosNewIcon sx={{ width: "15px", height: "10px", mt: "4px" }} />
                            </Typography>
                            <ButtonComponent title="ورود"
                                isFormValid={isFormValid}
                                isPending={isPending}
                            />
                        </ValidatorForm>
                    </Box>
                </Box>
            </Container>

        </Box>

    );
}
