export interface INotificationResponse {
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
    url:string;

}