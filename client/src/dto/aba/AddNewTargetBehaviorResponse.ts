import { Behavior } from "./Behavior";

export interface AddNewTargetBehaviorResponse {
    statusCode: number;
    serverMessage?: string;
    behaviorsAdded?: boolean;
    failedBehaviors?: Behavior[];
}