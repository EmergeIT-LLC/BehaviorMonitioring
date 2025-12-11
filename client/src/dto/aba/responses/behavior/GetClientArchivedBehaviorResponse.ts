import type { behaviorData } from '../../common/behavior/BehaviorData';

export type GetClientArchivedBehaviorResponse = {
    statusCode: number;
    behaviorSkillData: behaviorData[];
    serverMessage: string;
    errorMessage?: string;
};