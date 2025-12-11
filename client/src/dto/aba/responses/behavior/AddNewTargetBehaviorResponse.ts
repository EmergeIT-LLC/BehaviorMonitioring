import { Behavior } from "../../common/behavior/Behavior";

export interface AddNewTargetBehaviorResponse {
    statusCode: number;
    serverMessage?: string;
    behaviorsAdded?: boolean;
    failedBehaviors?: Behavior[];
}