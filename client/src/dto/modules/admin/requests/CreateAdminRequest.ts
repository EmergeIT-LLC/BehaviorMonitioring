export type CreateAdminRequest = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  role: 'root' | 'admin' | 'manager';
  companyID: number;
};
