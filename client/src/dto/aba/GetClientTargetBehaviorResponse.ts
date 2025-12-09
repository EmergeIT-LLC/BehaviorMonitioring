import type { behaviorSkillData } from './BehaviorSkillData';

export type GetClientTargetBehaviorResponse = {
    statusCode: number;
    behaviorSkillData: behaviorSkillData[];
    serverMessage: string;
};