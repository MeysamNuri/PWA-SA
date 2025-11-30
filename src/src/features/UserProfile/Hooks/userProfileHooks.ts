import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useUserProfile from "./APIHooks";
import { useThemeContext } from "@/core/context/useThemeContext";
import { useUserSerialStore } from "@/core/zustandStore";
import useGetUserPersonality from "@/features/Personality/Hooks/APIHooks/useGetPersonality";

export default function useUserProfileHooks() {
    const { palette } = useTheme();
    const { userProfileData, isPending } = useUserProfile()
    const routeNavigate = useNavigate()
    const setUserSerial = useUserSerialStore((state) => state.setUserSerial)
    const { userPersonality, isPending: personalityLoading, refetch: refetchPersonality } = useGetUserPersonality();

    // Theme management from context
    const { isDarkMode, toggleTheme } = useThemeContext();

    const handlePassword = () => {
        routeNavigate("/forget-password", { state: { phoneNumber: userProfileData?.phoneNumber } })
    }

    const handleBack = () => {
        routeNavigate("/home")
    }

    const handleHomepageCustomization = () => {
        routeNavigate("/homepage-customization")
    }

    const serial = useMemo(() => {
        return userProfileData?.getUserProfileDtos?.map((i) => i.serial)[0]
    }, [userProfileData])


    useEffect(() => {
        if (serial) {
            setUserSerial(serial)
        }
    }, [serial, setUserSerial])




    // React way to handle visibility change without addEventListener
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                refetchPersonality();
            }
        };

        document.onvisibilitychange = handleVisibilityChange;
        return () => { document.onvisibilitychange = null };
    }, [refetchPersonality]);


    return {
        handleBack,
        handlePassword,
        toggleTheme,
        handleHomepageCustomization,
        serial,
        palette,
        isPending,
        userProfileData,
        isDarkMode,
        personalityLoading,
        userPersonality
    }
}