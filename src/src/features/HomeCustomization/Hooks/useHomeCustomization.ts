import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { arrayMove } from '@dnd-kit/sortable';
import { useGetPageName } from './APIHooks/useGetPageName';
import { useGetDisplaySetting } from './APIHooks/useGetDisplaySetting';
import { useUpdateDisplaySetting } from './APIHooks/useUpdatePageVisibility';
import type { HomeCustomizationItem } from '../types';
import { PAGE_NAME_MAPPING } from '../types';

export const useHomeCustomization = () => {
    const queryClient = useQueryClient();
    const { data: pageNameData, isLoading, error } = useGetPageName();
    const { data: displaySettingData } = useGetDisplaySetting();
    const updateDisplaySetting = useUpdateDisplaySetting();
    const [customizationItems, setCustomizationItems] = useState<HomeCustomizationItem[]>([]);

    useEffect(() => {
        if (pageNameData?.Data) {
            // Get enabled page names and sort order from server
            const enabledPageNames = displaySettingData?.Data?.displaySetting?.map(item => item.pageName) || [];
            const sortMap = new Map(displaySettingData?.Data?.displaySetting?.map(item => [item.pageName, item.sort]) || []);

            const items: HomeCustomizationItem[] = pageNameData.Data.map((item: any) => ({
                pageId: item.pageId,
                pageName: item.pageName,
                persianTitle: PAGE_NAME_MAPPING[item.pageName] || item.pageName,
                isEnabled: enabledPageNames.includes(item.pageName), // Use server data
                sort: sortMap.get(item.pageName) ?? 0 // Use server sort order or default to 0
            }));

            // Sort items by sort order
            const sortedItems = items.sort((a, b) => a.sort - b.sort);
            setCustomizationItems(sortedItems);
        }
    }, [pageNameData, displaySettingData]);

    const toggleItem = (pageId: string) => {
        const item = customizationItems.find(i => i.pageId === pageId);
        if (!item) return;

        const newEnabledState = !item.isEnabled;
        setCustomizationItems(prev =>
            prev.map(i =>
                i.pageId === pageId
                    ? { ...i, isEnabled: newEnabledState }
                    : i
            )
        );
    };

    const reorderItems = (activeId: string, overId: string) => {
        setCustomizationItems((items) => {
            const oldIndex = items.findIndex(item => item.pageId === activeId);
            const newIndex = items.findIndex(item => item.pageId === overId);
            if (oldIndex === -1 || newIndex === -1) {
                return items;
            }

            const reorderedItems = arrayMove(items, oldIndex, newIndex);
            return reorderedItems.map((item, index) => ({
                ...item,
                sort: index
            }));
        });
    };

    const saveCustomization = async () => {
        try {


            // Send all settings to API
            const displaySettings = customizationItems.map((item, index) => ({
                PageId: item.pageId,
                IsActive: item.isEnabled,
                Sort: index
            }));


            const response = await updateDisplaySetting.mutateAsync({
                DisplaySetting: displaySettings
            });


            // Only save to localStorage if API call is successful
            if (response.Status) {
                const enabledItems = customizationItems.filter(item => item.isEnabled);
                localStorage.setItem('homeCustomization', JSON.stringify(enabledItems));

                // Refresh display settings from server
                await queryClient.invalidateQueries({ queryKey: ['getDisplaySetting'] });
            }
        } catch (error) {
         return error
        }
    };


    return {
        customizationItems,
        isLoading,
        error,
        toggleItem,
        reorderItems,
        saveCustomization,
        isUpdating: updateDisplaySetting?.isPending
    };
};
