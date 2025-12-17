/**
 * Type for behaviors being added via the Add Behavior page
 * Matches the structure of AddBehaviorRequest.behaviors array items
 */
export type BehaviorToAdd = {
  clientName: string;
  clientID: number;
  behaviorName: string;
  behaviorCategory: string;
  behaviorDefinition: string;
  behaviorMeasurement: string;
  type: 'Behavior' | 'Skill';
};
