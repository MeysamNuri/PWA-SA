import type { ReactNode } from "react";

export interface IRowData {
    title: string;
    value: number | string;
    unit?: string;
    rowSize?: number;
    valueColor?: string;
    type?: number | string;
    headerColor?: string;
    showArrow?: boolean;
    isPositiveChange?: boolean;
}

export interface IMainCardPropsBase {
    bankName?: string,
    index?: number;
    headerTitle: string;
    headerIcon?: string;
    isCollapsible?: boolean;
    headerValue?: string | number;
    headerUnit?: string;
    shownRows?: number;
    footer?: ReactNode;
    rows: IRowData[];
    path?: string;
    isExpanded?: boolean;
    onToggle?: () => void;
}
