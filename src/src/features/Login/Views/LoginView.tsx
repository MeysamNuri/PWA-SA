import "./styles.scss";
import InputAdornment from "@mui/material/InputAdornment";
import { Container, Typography, Box, useTheme } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import useLoginHook from "../Hooks/useLoginHooks";
import LogoSection from "../Components/logoSection";
import ButtonComponent from "@/core/components/Button";

export default function LoginView() {
    const theme = useTheme();
    const {
        handleSubmit,
        handleChange,
        formData,
        setIsFormValid,
        palette,
        handleRules,
        isFormValid,
        isPending,
        handlePasswordLoginClick,

    } = useLoginHook();

    return (
        <Box className="login-page">
            <Container maxWidth="sm">
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
                            به دستیار هوشمند هلو خوش آمدید!
                        </Typography>
                    </Box>

                    <Box sx={{
                        background: theme.palette.background.paper,
                        padding: "20px 15px 10px 15px",
                        borderRadius: "0 0 16px 16px",
                        textAlign: "start"
                    }}>
                        <ValidatorForm
                            onSubmit={handleSubmit}

                        > 
                            <Typography
                                variant="subtitle2"
                                color="primary.main"
                                sx={{ px: 1 }}
                            >
                                لطفا شماره موبایل خود را وارد نمایید.
                            </Typography>

                            <TextValidator
                                fullWidth
                                type="tel"
                                variant="outlined"
                                margin="normal"
                                validators={[
                                    "isPhoneNumberNotEmpty",
                                    "isPhoneNumber11Digits",
                                    "isPhoneNumberStartsWithZero",
                                ]}
                                
                                onChange={handleChange}
                                name="PhoneNumber"
                                value={formData.phoneNumber}
                                validatorListener={(v: boolean) =>
                                    setIsFormValid(v)
                                }
                                errorMessages={[
                                    "شماره موبایل نباید خالی باشد",
                                    "شماره موبایل باید 11 رقم باشد",
                                    "شماره موبایل شما باید با 09 شروع شود",
                                ]}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img
                                                src={`${import.meta.env.BASE_URL}images/loginicons/linear-icon.png`}
                                                alt="mobile icon"
                                                style={{
                                                    width: 24,
                                                    height: 24,
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mt: "unset",
                                    color: palette.text.secondary,
                                    direction: "ltr",
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: palette.background.default,
                                        borderRadius: "12px",
                                        "& fieldset": {
                                            border: "none",
                                        },
                                        "&:hover fieldset": {
                                            border: "none",
                                        },
                                        "&.Mui-focused fieldset": {
                                            border: "none",
                                        },
                                    },
                                }}
                            />

                            <Typography
                                variant="caption"
                                sx={{
                                    textAlign: "right",
                                    color: palette?.button?.main || palette?.error?.main || '#E42628',
                                    fontWeight: 500,
                                    display: "flex",
                                    padding: "5px 10px 15px 0",
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

                            <Box
                                sx={{
                                    display: "flex",
                                    mb: 2,
                                    direction: "rtl",
                                }}
                            >
                                <span
                                    style={{
                                        position: "relative",
                                        width: 24,
                                        height: 24,
                                        display: "inline-block",
                                    }}
                                >
                                    <img
                                        src={`${import.meta.env.BASE_URL}images/loginicons/Group 36887.png`}
                                        alt="tick"
                                    />
                                </span>
                                <Typography variant="caption">
                                    <span
                                        style={{
                                            color: palette.error.main,
                                            paddingLeft: "3px",
                                            whiteSpace: "nowrap",
                                            cursor: "pointer",
                                        }}
                                        onClick={handleRules}
                                    >
                                        قوانین و شرایط
                                    </span>{" "}
                                    استفاده از دستیار هوشمند هلو را خوانده‌ام و
                                    با آن موافقم.
                                </Typography>
                            </Box>
                            <ButtonComponent title="دریافت کد تأیید"
                                isFormValid={isFormValid}
                                isPending={isPending} />
                        </ValidatorForm>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
