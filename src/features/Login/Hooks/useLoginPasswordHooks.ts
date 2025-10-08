import {
    // use,
    useEffect,
    useState
} from "react";
import { useNavigate, useLocation } from "react-router";
import useLoginPassword from "./APIHooks/useLoginPassword";
import type { ChangeEvent } from "react";

export default function usePasswordLoginHook() {

    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const { mutate, data, isPending } = useLoginPassword();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        password: "",
    });
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, password: event.target.value });
    };


    const handleSubmitPassword = () => {
        mutate({ phoneNumber: location.state?.phoneNumber, password: formData.password });

    };
    const handleBack = () => {
        navigate('/login', { state: location.state });
    };

    useEffect(() => {
        if (formData.password.length > 0) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [formData.password]);

    const handleFogetPassword = () => {
        navigate('/forget-password', { state: location.state });
    }
    return {
        setIsFormValid,
        handleSubmitPassword,
        handleBack,
        handleChange,
        handleFogetPassword,
        isPending,
        formData,
        isFormValid,
        location,
        data,

    };
} 