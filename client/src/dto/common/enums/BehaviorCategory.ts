/**
 * Behavior category constants
 */
export const BEHAVIOR_CATEGORIES = [
  'Select a Behavior Category',
  'Aggression',
  'Dangerous Acts',
  'Disrobing',
  'Disruption',
  'Elopement',
  'Feeding/Mealtime',
  'Inappropriate Social',
  'Moto Stereotypy',
  'Noncompliance/Refusal',
  'Other',
  'Property Destruction',
  'Rituals/Compulsive/Habit/Tics',
  'Self-Injury',
  'Sexual Behavior',
  'Sleep/Toileting',
  'Verbal',
  'Visual Stereotype',
  'Vocal'
] as const;

export type BehaviorCategory = typeof BEHAVIOR_CATEGORIES[number];
