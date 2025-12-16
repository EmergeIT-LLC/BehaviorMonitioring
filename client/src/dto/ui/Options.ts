/**
 * Generic dropdown option type
 */
export type DropdownOption<T = string | number> = {
  value: T;
  label: string;
};

/**
 * Client dropdown option
 */
export type ClientOption = DropdownOption<number>;

/**
 * Behavior/Skill dropdown option with additional metadata
 */
export type BehaviorSkillOption = {
  value: string | number;
  label: string;
  definition?: string;
  dateCreated?: string;
  measurementType?: string;
  behaviorCategory?: string;
  dataToday?: number;
};

/**
 * Selected behavior/skill for multi-select operations
 */
export type SelectedBehaviorSkill = {
  id: string;
  name: string;
  clientName?: string;
  measurementType?: string;
};

/**
 * Extended session note for display
 */
export type SessionNoteOption = {
  value: string;
  label: string;
  clientID: string;
  clientName: string;
  sessionDate: string;
  sessionTime: string;
  sessionNotes: string;
  enteredBy: string;
  entered_by?: string;
};
