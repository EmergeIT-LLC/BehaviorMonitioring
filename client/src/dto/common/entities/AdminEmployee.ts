export type AdminEmployee = {
  adminID: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  role: 'root' | 'admin' | 'manager';
  isActive: boolean;
  companyID: number;
  companyName: string;
  dateCreated: string;
  lastLogin?: string;
};
