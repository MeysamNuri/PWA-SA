import {
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate } from 'react-router-dom'; // Changed to 'react-router-dom' for clarity
import type { IMenuItems } from '@/core/types/IMenuItems';
import { Icon } from '@/core/components/icons';
import { useThemeContext } from '@/core/context/useThemeContext';
import { useUserSerialStore } from "@/core/zustandStore";
import useUserProfile from '@/features/UserProfile/Hooks/APIHooks';

interface ILayoutHooks {
    onClose?: () => void;
}

export default function useLayoutHooks({ onClose }: ILayoutHooks = {}) {
    const handleClose = onClose ?? (() => { });
    const { isDarkMode } = useThemeContext()
    const hideAppBar = location.pathname === '/nearDueReceivableCheques'; // maybe we don't use this line
    const routeNavigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const setUserSerial = useUserSerialStore((state) => state.setUserSerial)
    const { userProfileData } = useUserProfile()

    const menuItems: IMenuItems[] = [
        {
            Value: "home",
            Name: 'خانه',
            Navigation: "/home",
            SubMenuItems: [],
            // Icon: <img src={`${import.meta.env.BASE_URL}images/sidebar/home.png`} alt="خانه" style={{ width: 24, height: 24 }} />
            Icon: <Icon name="home" isDarkMode={isDarkMode} />,
        },
        {
            Value: "checks", Name: 'چک‌ها', Navigation: null, SubMenuItems: [
                { Name: 'چک‌های دریافتی', Navigation: "/cheques/receivable-cheques" },
                { Name: 'چک‌های پرداختی', Navigation: "/cheques/payable-cheques" },
                { Name: ' تاریخ گذشته وصول نشده', Navigation: "/cheques/OverDueReceivableCheques" }
            ], Icon: <Icon name="cheque" isDarkMode={isDarkMode} />,
        },
        {
            Value: "sales", Name: 'فروش', Navigation: null, SubMenuItems: [
                { Name: 'فروش و سود', Navigation: "/salesrevenue" },
                { Name: 'کالاهای پرفروش', Navigation: "/topSellingProducts" },
                { Name: 'کالاهای پرسود', Navigation: "/topRevenuableProducts" }
            ], Icon: <Icon name="sales" isDarkMode={isDarkMode} />,

        },
        {
            Value: "inventory", Name: 'موجودی کالا', Navigation: null, SubMenuItems: [
                { Name: 'کالاهای پرفروش ناموجود', Navigation: "/GetInSaleOutOfStockProductsView" },
            ], Icon: <Icon name="warebalance" isDarkMode={isDarkMode} />,

        },
        {
            Value: "availableFunds", Name: 'مانده نقد و بانک', Navigation: "/availableFunds", SubMenuItems: [],
            Icon: <Icon name="availablefunds" isDarkMode={isDarkMode} />,

        },
        {
            Value: "prices", Name: 'تابلو زنده قیمت‌ها', Navigation: null, SubMenuItems: [
                { Name: 'نرخ ارز', Navigation: "/currencyRates" },
                { Name: 'نرخ طلا ', Navigation: "/currencyRates" },
                { Name: 'نرخ سکه ', Navigation: "/currencyRates" }
            ], Icon: <Icon name="currencyrates" isDarkMode={isDarkMode} width={24} height={24} />,
        },
        {
            Value: "cashBank", Name: 'حساب کاربری', Navigation: "/user-profile", SubMenuItems: [],
            Icon: <Icon name="user" isDarkMode={isDarkMode} width={24} height={24} />,

        },
        {
            Value: "supports", Name: 'پشتیبانی', Navigation: "/supports", SubMenuItems: [],
            Icon: <Icon name="supports" isDarkMode={isDarkMode} width={24} height={24} />,

        },
    ];

    const handleClickMenu = (menu: IMenuItems) => {

        if (menu.Navigation === null) {
            setOpenMenu(openMenu === menu.Name ? null : menu.Name);
        } else {
            routeNavigate(menu.Navigation);
            handleClose();
        }
    };

    const handleClick = (path: string) => {
        routeNavigate(path);
        handleClose();
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        routeNavigate("/login");
        handleClose();
    };
    const handleUserProfile = () => {
        routeNavigate("/user-profile")
    }
 

    const serial = useMemo(() => {
        return userProfileData?.getUserProfileDtos?.map((i) => i.serial)[0]
    }, [userProfileData])

    useEffect(() => {
        if (serial) {
            setUserSerial(serial)
        }
    }, [serial])
    return {
        setSidebarOpen,
        setOpenMenu,
        hideAppBar,
        sidebarOpen,
        openMenu,
        menuItems,
        handleLogout,
        handleClick,
        handleClickMenu,
        handleUserProfile,
        userProfileData
    }

}
