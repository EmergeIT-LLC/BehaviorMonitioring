import type { SessionNote } from '../../../common/entities/SessionNote';

export type GetSessionNotesResponse = {
  statusCode: number;
  sessionNoteData: SessionNote[];
  serverMessage?: string;
  errorMessage?: string;
};
