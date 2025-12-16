/**
 * Core behavior/skill entity (base metadata)
 */
export type BehaviorSkill = {
  bsID: number;
  name: string;
  definition: string;
  measurement: string;
  category: string;
  type: 'Behavior' | 'Skill';
  clientID: number;
  clientName: string;
  dataToday?: number;
  entered_by: string;
  date_entered: string;
  time_entered: string;
  status: 'Active' | 'Archived';
};

/**
 * Behavior/Skill data entry (session data)
 */
export type BehaviorSkillData = {
  behaviorDataID: string;
  bsID: number;
  clientID: number;
  clientName: string;
  sessionDate: string;
  sessionTime: string;
  count: string | number;
  duration: string | number;
  trial?: string | number;
  entered_by: string;
  date_entered: string;
  time_entered: string;
  status: string;
};
