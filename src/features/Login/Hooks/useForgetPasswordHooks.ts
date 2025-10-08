import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import useForgetPasswordHooks from "./APIHooks/useForgetPassword";
import type { ChangeEvent } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
// import { Value } from "@/core/components/MainCard/MainCard.styles";

export default function useForgetPasswordHook() {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { handleChangePasswordByOTP, isPending } = useForgetPasswordHooks();

    const location = useLocation();

    const [formData, setFormData] = useState({
        initialPassword: "",
        confirmedPassword: "",
    });
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
    const handleinitialPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, initialPassword: event.target.value });
    };
    const handleConfirmedPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, confirmedPassword: event.target.value });
    };

    const handleSubmitChangePassword = () => {
        const obj = {
            confirmPassword: formData.confirmedPassword,
            newPassword: formData.initialPassword,
            otpCode: otpValues.join(""),
            phoneNumber: location.state.phoneNumber
        }
        handleChangePasswordByOTP(obj);

    };
    useEffect(() => {

        // Password validation rules
        ValidatorForm.addValidationRule("isPasswordMinLength", (value) => {
            return value.length >= 8;
        });

        ValidatorForm.addValidationRule("isPasswordHasCapital", (value) => {
            return /[A-Z]/.test(value);
        });

        ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
            return value === formData.initialPassword;
        });

        return () => {
            ValidatorForm.removeValidationRule('isPasswordMinLength');
            ValidatorForm.removeValidationRule('isPasswordHasCapital');
            ValidatorForm.removeValidationRule('isPasswordMatch');
        };
    }, [formData.initialPassword]);

    const handleTogglePassword = () => setShowPassword((prev) => !prev);
    const handleToggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

    return {
        handleTogglePassword,
        handleOTPChange,
        handleSubmitChangePassword,
        handleinitialPasswordChange,
        handleToggleConfirmPassword,
        handleConfirmedPasswordChange,
        showPassword,
        isPending,
        otpValues,
        inputRefs,
        formData,
        location,
        showConfirmPassword
    };
} 