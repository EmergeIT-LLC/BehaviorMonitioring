import type { SessionNote } from '../../../common/entities/SessionNote';

export type GetSessionNotesResponse = {
  statusCode: number;
  sessionNotesData: SessionNote[];
  serverMessage?: string;
  errorMessage?: string;
};
