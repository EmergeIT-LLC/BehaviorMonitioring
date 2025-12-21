export interface UpdateHomeRequest {
    homeID: number;
    homeName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    capacity: number;
    isActive: boolean;
}
