import { PAGE_NAME_MAPPING, type HomeCustomizationItem, type PageNameItem } from "@/features/HomeCustomization/types";
import { useEffect, useState } from "react";
import { useGetPageName } from '@/features/HomeCustomization/Hooks/APIHooks/useGetPageName';


function HomePageDefaultItems() {
    const [homeDefaultCustomeList, setHomDefaultCustomList] = useState<HomeCustomizationItem[]>()
    const { data: pageNameData, isLoading: pageNameDataLoading } = useGetPageName();

    useEffect(() => {
        if (!pageNameData?.Data) return;

        const homeList = pageNameData.Data.map((item: PageNameItem, index: number) => ({
            isEnabled: true,
            pageId: item.pageId,
            pageName: item.pageName,
            persianTitle: PAGE_NAME_MAPPING[item.pageName],
            sort: index,
        }));

        setHomDefaultCustomList(homeList);
    }, [pageNameData]);

    return {
        homeDefaultCustomeList,
        pageNameDataLoading
    }
}


export default HomePageDefaultItems;