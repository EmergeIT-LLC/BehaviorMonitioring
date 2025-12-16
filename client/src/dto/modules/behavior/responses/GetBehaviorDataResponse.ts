import type { BehaviorSkillData } from '../../../common/entities/BehaviorSkill';

export type GetBehaviorDataResponse = {
  statusCode: number;
  behaviorSkillData: BehaviorSkillData[];
  serverMessage?: string;
  errorMessage?: string;
};
