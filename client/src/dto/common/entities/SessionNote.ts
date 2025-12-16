/**
 * Session note entity
 */
export type SessionNote = {
  sessionNoteDataID: string;
  noteID?: string; // Alias
  clientID: string;
  clientName: string;
  sessionDate: string;
  sessionTime: string;
  sessionNotes: string;
  notes?: string; // Alias
  enteredBy: string;
  entered_by?: string; // Alias for consistency
  date_entered?: string;
  time_entered?: string;
  // UI properties (added after mapping)
  value?: string;
  label?: string;
};
