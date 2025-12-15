export type Notes = {
    noteID: string;
    sessionDate: string;
    sessionTime: string;
    notes: string;
    clinetID: string;
    clientName: string;
    entered_by?: string; // Alias for enteredBy (backend might use this)
}