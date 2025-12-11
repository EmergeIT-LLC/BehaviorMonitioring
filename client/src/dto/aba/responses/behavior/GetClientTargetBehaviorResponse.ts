import type { TargetBehaviorData } from '../../common/behavior/TargetBehaviorData';

export type GetClientTargetBehaviorResponse = {
    statusCode: number;
    behaviorSkillData: TargetBehaviorData[];
    serverMessage: string;
    errorMessage?: string;
};