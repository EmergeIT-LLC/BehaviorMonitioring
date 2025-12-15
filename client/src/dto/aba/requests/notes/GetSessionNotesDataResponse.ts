import { Notes } from "../../common/notes/notes";

export type GetSessionNotesDataResponse = {
    statusCode: number;
    sessionNotesData: Notes[];
    serverMessage: string;
    errorMessage?: string;
};