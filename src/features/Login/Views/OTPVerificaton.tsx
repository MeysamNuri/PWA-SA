import "./styles.scss";
import { Container, Typography, Box, TextField, useTheme } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ValidatorForm } from "react-material-ui-form-validator";
import useOTPVerify from "../Hooks/useOTPVerifyHooks";
import BackArrow from "../Components/backArrow";
import LogoSection from "../Components/logoSection";
import ButtonComponent from "@/core/components/Button";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
export default function OTPVerification() {
    const theme = useTheme();
    const {
        handleSubmitOTP,
        timer,
        canResend,
        handleResendCode,
        handleOTPChange,
        handlePasswordLoginClick,
        otpValues,
        inputRefs,
        location,
        isPending,
        handleBack,
        OTPVerifyLoading
    } = useOTPVerify();
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
                            ورود کد تأیید
                        </Typography>
                    </Box>

                    <Box sx={{
                        background: theme.palette.background.paper,
                        padding: "20px 15px 10px 15px",
                        borderRadius: "0 0 16px 16px",
                        textAlign: "start"
                    }}>
                        <ValidatorForm
                            onSubmit={handleSubmitOTP}
                        >
                            <Typography
                                variant="subtitle2"
                                color="primary.main"
                                sx={{ px: 1 }}
                            >
                                کد تأیید ارسالی به شماره{" "}
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
                                    textAlign: "right",
                                    color: "#E42628",
                                    fontWeight: 500,
                                    display: "flex",
                                    padding: "5px 10px 0px 0",
                                    cursor: "pointer",
                                    gap: "5px",
                                }}
                                onClick={handlePasswordLoginClick}

                            >
                                ورود با کلمه عبور
                                <ArrowBackIosNewIcon
                                    sx={{
                                        width: "15px",
                                        height: "10px",
                                        mt: "4px",
                                    }}
                                />
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
                                    gap: "5px",
                                }}
                                onClick={handleBack}
                            >
                                ویرایش شماره موبایل
                                <ArrowBackIosNewIcon
                                    sx={{
                                        width: "15px",
                                        height: "10px",
                                        mt: "4px",
                                    }}
                                />
                            </Typography>

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
                                {
                                    OTPVerifyLoading ? <AjaxLoadingComponent /> :
                                        canResend
                                            ? "دریافت مجدد کد"
                                            : `دریافت مجدد کد پس از ${timer} ثانیه`}

                            </Typography>
                            <ButtonComponent title="تأیید"
                                isFormValid={otpValues.join("").length == 6 ? true : false}
                                isPending={isPending}
                            />
                        </ValidatorForm>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
