"use client";
import Axios from 'axios';

//Grabbed from Behavior/Detail/Page.tsx
export const getClientTargetBehaviorBaseData = async (clientID: string | number, bID: string | number, loggedInUser: string) => {
    let statusCodeRecieved: number = 0;
    const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getAClientTargetBehavior';

    try {
        const response = await Axios.post(url, {
            "clientID": clientID,
            "behaviorID": bID,
            "employeeUsername": loggedInUser
        });
        if (response.data.statusCode === 200) {
            return {statusCode: response.data.statusCode, behaviorSkillData: response.data.behaviorSkillData};
        } else {
            statusCodeRecieved = response.data.statusCode;
            throw new Error(response.data.serverMessage);
        }    
    } catch (error) {
        return {statusCode: statusCodeRecieved, errorMessage: String(error)};
    }
}