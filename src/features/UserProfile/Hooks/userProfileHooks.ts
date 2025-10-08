import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useUserProfile from "./APIHooks";
import { useThemeContext } from "@/core/context/useThemeContext";

export default function useUserProfileHooks() {
    const { palette } = useTheme();
    const { userProfileData, isPending } = useUserProfile()
    const routeNavigate = useNavigate()
    
    // Theme management from context
    const { isDarkMode, toggleTheme } = useThemeContext();

    const handlePassword = () => {
        routeNavigate("/forget-password", { state: { phoneNumber: userProfileData?.phoneNumber } })
    }
    const handleBack = () => {
        routeNavigate("/home")
    }

    const serial = useMemo(() => {
        return userProfileData?.getUserProfileDtos?.map((i) => i.serial)[0]
    }, [userProfileData])

    return {
        handleBack,
        handlePassword,
        serial,
        palette,
        isPending,
        userProfileData,
        isDarkMode,
        toggleTheme
    }
}