import "./styles.scss";
import InputAdornment from "@mui/material/InputAdornment";
import { Container, Typography, Box, IconButton, TextField, useTheme } from "@mui/material";
import "./styles.scss";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import useForgetPasswordHook from '../Hooks/useForgetPasswordHooks'
import useSendOTPHook from "../Hooks/useOTPVerifyHooks";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LogoSection from "../Components/logoSection";
import BackArrow from "../Components/backArrow";
import ButtonComponent from "@/core/components/Button";

export default function ForgetPassword() {
    const theme = useTheme();
    const {
        handleinitialPasswordChange,
        handleConfirmedPasswordChange,
        handleSubmitChangePassword,
        formData,
        showPassword,
        showConfirmPassword,
        handleTogglePassword,
        isPending,
        handleToggleConfirmPassword,
        handleOTPChange,
        otpValues,
        inputRefs
    } = useForgetPasswordHook()
    const {
        handleResendCode,
        timer,
        canResend,
        handleBack,

        location,
    } = useSendOTPHook();

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
                            تغییر کلمه عبور
                        </Typography>
                    </Box>

                    <Box sx={{
                        background: theme.palette.background.paper,
                        padding: "20px 15px 10px 15px",
                        borderRadius: "0 0 16px 16px",
                        textAlign: "start"
                    }}>
                        <ValidatorForm
                            onSubmit={handleSubmitChangePassword}

                        >

                            <Typography
                                variant="subtitle2"
                                color="primary.main"
                                sx={{ px: 1 }}
                            >
                                کد تایید ارسالی به شماره{" "}
                                {location?.state?.phoneNumber} را وارد کنید
                            </Typography>
                            <Box sx={{
                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                                borderRadius: "12px",
                                padding: "0",
                                display: "flex",
                                justifyContent: "center",
                                gap: "20px",
                                marginBottom: "10px",
                                height: "54px",
                                alignItems: "center",
                                direction: "ltr"
                            }}>
                                {otpValues.map((value, index) => (
                                    <TextField
                                        key={index}
                                        variant="standard"
                                        margin="normal"
                                        value={value}
                                        onChange={(e) =>
                                            handleOTPChange(index, e)
                                        }
                                        inputProps={{
                                            maxLength: 1,
                                            className: "login-token",
                                            ref: (el: HTMLInputElement) =>
                                                (inputRefs.current[index] = el),
                                            style: { textAlign: "center" },
                                        }}
                                        sx={{ width: "30px" }}
                                    />
                                ))}
                            </Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    textAlign: "center",
                                    display: "block",
                                    color: canResend ? "#E42628" : "#888",
                                    fontWeight: canResend ? 600 : 400,
                                    cursor: canResend ? "pointer" : "default",
                                }}
                                onClick={handleResendCode}
                            >
                                {canResend
                                    ? "دریافت مجدد کد"
                                    : `دریافت مجدد کد پس از ${timer} ثانیه`}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color="#434343"
                                sx={{
                                    direction: "rtl",
                                    fontFamily: "YekanBakh-bold",
                                    textAlign: "right",
                                    fontSize: "14px",
                                    my: 2,

                                }}
                            >
                                کلمه عبور جدید خود را وارد کنید
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color="primary.main"
                                sx={{ px: 1 }}
                            >
                                کلمه عبور
                            </Typography>

                            <TextValidator
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                type={showPassword ? "text" : "password"}
                                onChange={handleinitialPasswordChange}
                                name="initialPassword"
                                value={formData.initialPassword}
                                validators={[
                                    "required",
                                    "isPasswordMinLength",
                                    "isPasswordHasCapital"
                                ]}
                                errorMessages={[
                                    "کلمه عبور الزامی است",
                                    "کلمه عبور باید حداقل 8 کاراکتر باشد",
                                    "کلمه عبور باید حداقل یک حرف بزرگ داشته باشد"
                                ]}
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
                                        backgroundColor: '#ECEFF1',
                                        borderRadius: '12px',
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
                                variant="subtitle2"
                                color="primary.main"
                                sx={{ px: 1,mt:1.5 }}
                            >
                                تکرار کلمه عبور
                            </Typography>

                            <TextValidator
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                type={showConfirmPassword ? "text" : "password"}
                                onChange={handleConfirmedPasswordChange}
                                name="confirmPassword"
                                value={formData.confirmedPassword}
                                validators={[
                                    "required",
                                    "isPasswordMatch"
                                ]}
                                errorMessages={[
                                    "تکرار کلمه عبور الزامی است",
                                    "کلمه عبور و تکرار آن باید یکسان باشند"
                                ]}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleToggleConfirmPassword}
                                                edge="start"
                                            >
                                                {!showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#ECEFF1',
                                        borderRadius: '12px',
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

                            <ButtonComponent title="تغییر کلمه عبور"
                                isFormValid={true}
                                isPending={isPending}
                            />
                        </ValidatorForm>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
