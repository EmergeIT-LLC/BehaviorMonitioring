import type { ClientDTO } from '../../../common/ClientDTO';

export type GetAllClientInfoResponse = {
  statusCode: number;
  clientData: ClientDTO[];
  serverMessage?: string;
};