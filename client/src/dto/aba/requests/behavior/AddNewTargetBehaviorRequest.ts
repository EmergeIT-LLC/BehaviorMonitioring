import { Behavior } from "../../common/behavior/Behavior";

export interface AddNewTargetBehaviorRequest {
    employeeUsername: string;
    behaviors: Behavior[];
}