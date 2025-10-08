import type { ISubMenuItems } from "./ISubMenuItems";

export interface IMenuItems {
    Name: string;
    Value: string;
    Navigation: string | null;
    SubMenuItems: ISubMenuItems[];
    Icon: JSX.Element | null;
}