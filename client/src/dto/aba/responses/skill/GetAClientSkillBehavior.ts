import type { skillData } from '../../common/skill/SkillData';

export type GetAClientSkillBehaviorResponse = {
    statusCode: number;
    behaviorSkillData: skillData[];
    serverMessage: string;
    errorMessage?: string;
};