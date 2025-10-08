import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { ValidatorForm } from "react-material-ui-form-validator";
import UseSendOTPHooks from "../Hooks/APIHooks/useSendOTP";
import { useNavigate, useLocation } from "react-router";
import type { ChangeEvent } from "react";
import { toast } from "react-toastify";

export default function useLoginHook() {

    const { palette } = useTheme();
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate()
    const location = useLocation()

    const [formData, setFormData] = useState({
        phoneNumber: location.state?.phoneNumber ?? "",
    });

    const { mutate, isPending } = UseSendOTPHooks()

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, phoneNumber: event.target.value });
    };

    useEffect(() => {
        ValidatorForm.addValidationRule("isPhoneNumberNotEmpty", (value) => {
            return value.trim() !== ""; // Check if value is not just whitespace
        });

        ValidatorForm.addValidationRule("isPhoneNumber11Digits", (value) => {
            const digitsOnly = value.replace(/\D/g, "");
            return digitsOnly.length === 11;
        });

        ValidatorForm.addValidationRule(
            "isPhoneNumberStartsWithZero",
            (value) => {
                return value.trim().startsWith("0");
            },
        );

        return () => {
            ValidatorForm.removeValidationRule('isPhoneNumberNotEmpty');
            ValidatorForm.removeValidationRule('isPhoneNumber11Digits');
            ValidatorForm.removeValidationRule('isPhoneNumberStartsWithZero');
            // Clear location.state on unmount
            // if (location.state) {
            //   navigate(location.pathname, { replace: true, state: undefined });
            // }
        };
    }, []);

    const handleSubmit = () => {
        mutate(
            { phoneNumber: formData.phoneNumber },
            {
                onSuccess: () => {
                    navigate("/otpVerification", { state: formData });
                },
            },
        );
    };



    const handleRules = () => {
        navigate("/rules-regulations")
    };


    useEffect(() => {
        // You can add more validation here if needed
        if (
            formData.phoneNumber &&
            formData.phoneNumber.trim() !== "" &&
            formData.phoneNumber.replace(/\D/g, "").length === 11 &&
            formData.phoneNumber.startsWith("0")
        ) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [formData.phoneNumber]);

    const handlePasswordLoginClick = () => {
        // Check if form is valid before navigation
        if (isFormValid) {
            navigate("/password-login", { state: formData });
        } else {
            toast.warning("لطفا شماره موبایل خود را وارد کنید")
        }
    }

    const handleTogglePassword = () => setShowPassword((prev) => !prev);

    //end=======================
    return {
        handleSubmit,
        handleChange,
        setIsFormValid,
        handleRules,
        handlePasswordLoginClick,
        handleTogglePassword,
        formData,
        palette,
        isFormValid,
        isPending,
        location,
        showPassword,


    };
}
