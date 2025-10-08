import {
    useState,
} from "react";
import { useNavigate } from 'react-router-dom'; // Changed to 'react-router-dom' for clarity
import type { IMenuItems } from '@/core/models/IMenuItems';
// import { getTheme } from "@/theme";

interface ILayoutHooks {
    onClose?: () => void;
}

export default function useLayoutHooks({ onClose }: ILayoutHooks = {}) {
    const handleClose = onClose ?? (() => { });
    const hideAppBar = location.pathname === '/nearDueReceivableCheques'; // maybe we don't use this line
    const routeNavigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const menuItems: IMenuItems[] = [
        {
            Value: "home",
            Name: 'خانه',
            Navigation: "/home",
            SubMenuItems: [],
            Icon: <img src={`${import.meta.env.BASE_URL}images/sidebar/home.png`} alt="خانه" style={{ width: 24, height: 24 }} />
        },
        {
            Value: "checks", Name: 'چک‌ها', Navigation: null, SubMenuItems: [
                { Name: 'چک‌های دریافتی', Navigation: "/cheques/receivable-cheques" },
                { Name: 'چک‌های پرداختی', Navigation: "/cheques/payable-cheques" },
                { Name: ' تاریخ گذشته وصول نشده', Navigation: "/cheques/OverDueReceivableCheques" }
            ], Icon: <img src={`${import.meta.env.BASE_URL}images/sidebar/cheque.png`} alt="چک ها" style={{ width: 24, height: 24 }} />
        },
        {
            Value: "sales", Name: 'فروش', Navigation: null, SubMenuItems: [
                { Name: 'فروش و سود', Navigation: "/salesrevenue" },
                { Name: 'کالاهای پرفروش', Navigation: "/topSellingProducts" },
                { Name: 'کالاهای پرسود', Navigation: "/topRevenuableProducts" }
            ], Icon: <img src={`${import.meta.env.BASE_URL}images/sidebar/sales.png`} alt="فروش" style={{ width: 24, height: 24 }} />

        },
        {
            Value: "inventory", Name: 'موجودی کالا', Navigation: null, SubMenuItems: [
                { Name: 'کالاهای پرفروش ناموجود', Navigation: "/GetInSaleOutOfStockProductsView" },
            ], Icon: <img src={`${import.meta.env.BASE_URL}images/sidebar/warebalance.png`} alt="موجودی کالا" style={{ width: 24, height: 24 }} />

        },
        {
            Value: "availableFunds", Name: 'مانده نقد و بانک', Navigation: "/availableFunds", SubMenuItems: [],
            Icon: <img src={`${import.meta.env.BASE_URL}images/sidebar/availablefunds.png`} alt="مانده نقد و بانک" style={{ width: 24, height: 24 }} />

        },
        {
            Value: "prices", Name: 'تابلو زنده قیمت‌ها', Navigation: null, SubMenuItems: [
                { Name: 'نرخ ارز', Navigation: "/currencyRates" },
                { Name: 'نرخ طلا ', Navigation: "/currencyRates" },
                { Name: 'نرخ سکه ', Navigation: "/currencyRates" }
            ], Icon: <img src={`${import.meta.env.BASE_URL}images/sidebar/currencyrates.png`} alt="تابلو زنده قیمت ها" style={{ width: 24, height: 24 }} />
        },
        {
            Value: "cashBank", Name: 'حساب کاربری', Navigation: "/user-profile", SubMenuItems: [],
            Icon: <img src={`${import.meta.env.BASE_URL}images/sidebar/user.png`} alt="حساب کاربری'" style={{ width: 24, height: 24 }} />

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
        // mode,
        // theme,
        // toggleMode,
    }

}
