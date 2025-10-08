import { useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import UseSendOTPHooks from './APIHooks/useSendOTP';
import useLoginByOTPHooks from './APIHooks/useLoginByOTP';
import { useNavigate, useLocation } from 'react-router'

export default function useSendOTPHooks() {
    const { mutate, responseData, isPending: OTPVerifyLoading } = UseSendOTPHooks()
    const { handleLoginByOTP, isPending } = useLoginByOTPHooks()
    const [timer, setTimer] = useState<number>(120);
    const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [canResend, setCanResend] = useState<boolean>(false);
    const { palette } = useTheme();

    const navigate = useNavigate()
    const location = useLocation()

    const handleResendCode = () => {
        if (canResend) {
            mutate({ phoneNumber: location.state?.phoneNumber });

        }
    };

    useEffect(() => {
        if (responseData?.Status) {
            setTimer(120);
            setCanResend(false);
        }
    }, [responseData])

    useEffect(() => {
        if (!location.state?.phoneNumber) {
            navigate('/login')
        }
    }, [location.state, navigate])

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(countdown);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleOTPChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { value } = event.target;
        if (!/^[0-9]*$/.test(value)) return;

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value.slice(-1);
        setOtpValues(newOtpValues);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        } else if (!value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    useEffect(() => {
        if (otpValues.join("").length === 6) {
            handleSubmitOTP()
        }
    }, [otpValues])

    const handleBack = () => {
        navigate('/login', { state: location.state })

    }
    const handleSubmitOTP = () => {
        const obj = {
            phoneNumber: location.state?.phoneNumber,
            code: otpValues.join("")
        }
        handleLoginByOTP(obj)
    }
    const handlePasswordLoginClick = () => {
        navigate("/password-login", { state: location.state });
    }
    return {
        handleResendCode,
        handleOTPChange,
        handleSubmitOTP,
        handleBack,
        handlePasswordLoginClick,
        timer,
        canResend,
        otpValues,
        inputRefs,
        palette,
        location,
        isPending,
        OTPVerifyLoading
    };
}
