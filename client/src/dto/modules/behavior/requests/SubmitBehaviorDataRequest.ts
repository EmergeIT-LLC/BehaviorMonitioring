export type SubmitBehaviorDataRequest = {
  clientID: number;
  targetBehaviorDataID: number;
  sessionDate: string;
  sessionTime: string;
  count?: number | string;
  duration?: string;
  trial?: number | string;
  employeeUsername: string;
};
