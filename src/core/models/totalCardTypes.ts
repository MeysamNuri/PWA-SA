export interface TotalCardProps {
    rows: Array<{
        title: string;
        value: number;
        color?: string;
        unit?: string;
    }>;
    cardColor?: string;
}
