export interface Ticket {
    id: number;
    title: string;
    description: string;
    contactInfo: string;
    status: string;
    createdTimeStamp: Date;
    latestUpdateTimeStamp: Date;
}