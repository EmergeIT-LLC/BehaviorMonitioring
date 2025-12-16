import type { Client } from '../../common/entities/Client';

export type GetAllClientsResponse = {
  statusCode: number;
  clientData: Client[];
  serverMessage?: string;
  errorMessage?: string;
};
