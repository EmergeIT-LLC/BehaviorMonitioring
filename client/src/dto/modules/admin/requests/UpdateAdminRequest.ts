export type UpdateAdminRequest = {
  adminID: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'root' | 'admin' | 'manager';
  isActive: boolean;
};
