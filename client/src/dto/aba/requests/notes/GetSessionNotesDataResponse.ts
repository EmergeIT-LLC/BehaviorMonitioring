import { Notes } from "../../common/notes/Notes";

export type GetSessionNotesDataResponse = {
    statusCode: number;
    sessionNotesData: Notes[];
    serverMessage: string;
    errorMessage?: string;
};