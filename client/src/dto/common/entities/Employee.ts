/**
 * Core employee/user entity
 */
export type Employee = {
  employeeID: number;
  username: string;
  email?: string;
  role: string;
  companyID: number;
};

/**
 * Authenticated user information
 */
export type AuthUser = {
  username: string;
  role: string;
  token?: string;
};
