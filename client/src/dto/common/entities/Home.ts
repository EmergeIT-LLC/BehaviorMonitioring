export interface Home {
    homeID: number;
    homeName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    capacity: number;
    currentOccupancy: number;
    companyID: number;
    companyName?: string;
    dateCreated: string;
    isActive: boolean;
}
