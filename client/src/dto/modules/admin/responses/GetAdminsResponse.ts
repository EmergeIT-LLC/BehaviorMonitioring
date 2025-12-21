import type { AdminEmployee } from '../../../common/entities/AdminEmployee';

export type GetAdminsResponse = {
  statusCode: number;
  admins: AdminEmployee[];
  totalCount?: number;
  serverMessage?: string;
  errorMessage?: string;
};
