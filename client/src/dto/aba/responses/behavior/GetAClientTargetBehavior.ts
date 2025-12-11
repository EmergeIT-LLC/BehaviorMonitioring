import type { behaviorData } from '../../common/behavior/BehaviorData';

export type GetAClientTargetBehaviorResponse = {
    statusCode: number;
    behaviorSkillData: behaviorData[];
    serverMessage: string;
    errorMessage?: string;
};