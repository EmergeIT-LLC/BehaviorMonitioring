import type { BehaviorSkill } from '../../../common/entities/BehaviorSkill';

export type GetBehaviorResponse = {
  statusCode: number;
  behaviorSkillData: BehaviorSkill[];
  measurement?: string;
  serverMessage?: string;
  errorMessage?: string;
};
