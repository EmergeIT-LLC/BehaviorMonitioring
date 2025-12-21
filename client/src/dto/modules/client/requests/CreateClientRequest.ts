export type CreateClientRequest = {
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
  companyID: number;
};
