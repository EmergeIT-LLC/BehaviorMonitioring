import type { behaviorSkillData } from './BehaviorSkillData';

export type GetClientArchivedBehaviorResponse = {
    statusCode: number;
    behaviorSkillData: behaviorSkillData[];
    serverMessage: string;
};