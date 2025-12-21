export type UpdateClientRequest = {
  clientID: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  homeID: number;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  allergies?: string;
  medications?: string;
  notes?: string;
  isActive: boolean;
  companyID: number;
};
