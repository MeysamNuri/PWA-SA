import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import InnerPageHeader from "@/core/components/innerPagesHeader";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
import PersonalityViewHooks from "../Hooks/usePersonalityHooks";
import PersonalityPickerCard from "../Components/PersonalityCard";
import { Icon } from '@/core/components/icons';
import { useThemeContext } from '@/core/context/useThemeContext';

export const PersonalitySelectionView: React.FC = () => {
    const { palette } = useTheme();
    const { isDarkMode } = useThemeContext();

    const {
        userPersonality,
        options,
        isPending,
        isUserPersonalityPending,
        error,
        handlePersonalityChange,

    } = PersonalityViewHooks();


    if (isPending || isUserPersonalityPending) return <AjaxLoadingComponent />


    if (error) {
        return (
            <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="error" sx={{ bgcolor: "white", p: 3, direction: "rtl" }}>
                    خطا در بارگذاری شخصیت‌ها. لطفاً دوباره تلاش کنید.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: palette.background.default }}>
            <InnerPageHeader title="انتخاب انواع شخصیت" path="/user-profile" />
            {userPersonality && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 3 }}>
                    <img
                        src={`/icons/personalities/${isDarkMode ? 'dark' : 'light'}/${userPersonality?.picture}`}
                        alt={userPersonality.name}
                        style={{ width: 350, height: 350, objectFit: "contain", borderRadius: 8 }}
                    />
                </Box>
            )}
            <Box sx={{ mt: 0, maxWidth: 800, mx: "auto" }}>
                <PersonalityPickerCard
                    icon={<Icon name="user" isDarkMode={isDarkMode} width={24} height={24} />}
                    title="شخصیت و علایق"
                    options={options}
                    value={userPersonality?.id ?? null}
                    onChange={ handlePersonalityChange}
                />
            </Box>


        </Box>
    );
};
