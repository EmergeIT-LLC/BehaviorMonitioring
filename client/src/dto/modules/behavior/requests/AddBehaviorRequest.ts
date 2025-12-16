export type AddBehaviorRequest = {
  employeeUsername: string;
  behaviors: Array<{
    clientName: string;
    clientID: number;
    behaviorName: string;
    behaviorCategory: string;
    behaviorDefinition: string;
    behaviorMeasurement: string;
    type: 'Behavior' | 'Skill';
  }>;
};
