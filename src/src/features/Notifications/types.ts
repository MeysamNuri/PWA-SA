export interface INotificationItems {
    id: string;
    title: string;
    description: string;
    link: string;
    body: string;
    isRead: boolean;
    backgroundColor: string;
    viewDate: string;
    jalaliDate?: string;
    created: string;
    url: string;
}

export interface INotificationResponse {
    items: INotificationItems[]
    skip: number,
    take: number,
    totalCount: number,
    totalPages: number
}

export type readStatus="all" | "true" | "false"