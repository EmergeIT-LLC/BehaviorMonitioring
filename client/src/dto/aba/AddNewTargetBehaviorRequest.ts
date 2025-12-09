import { Behavior } from "./Behavior";

export interface AddNewTargetBehaviorRequest {
    employeeUsername: string;
    behaviors: Behavior[];
}