import type { TargetBehaviorData } from '../../common/behavior/TargetBehaviorData';

export type GetArchivedBehaviorDataResponse = {
    statusCode: number;
    behaviorSkillData: TargetBehaviorData[];
    serverMessage?: string;
    errorMessage?: string;
};
