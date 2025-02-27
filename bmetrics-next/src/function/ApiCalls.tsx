"use client";
import Axios from 'axios';

//Grabbed from Behavior/Add/Page.tsx
export const getClientNames = async (loggedInUser : string) => {
    let statusCodeRecieved: number = 0;
    const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getAllClientInfo';

    try {
        const response = await Axios.post(url, { "employeeUsername": loggedInUser });
        if (response.data.statusCode === 200) {
            const fetchedOptions = response.data.clientData.map((clientData: { clientID: number, fName: string, lName: string }) => ({
                value: clientData.clientID,
                label: `${clientData.fName} ${clientData.lName}`,
            }));
            return {statusCodeRecieved: response.data.statusCode, fetchedOptions};
        } else {
            statusCodeRecieved = response.data.statusCode;
            throw new Error(response.data.serverMessage);
        }
    } catch (error) {
        return {statusCode: statusCodeRecieved, errorMessage: String(error)};
    }
};


//Grabbed from Behavior/Detail/Page.tsx
export const getClientActiveBehaviorBaseData = async (clientID: string | number, bID: string | number, loggedInUser: string) => {
    let statusCodeRecieved: number = 0;
    const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getAClientTargetBehavior';

    try {
        const response = await Axios.post(url, {
            "clientID": clientID,
            "behaviorID": bID,
            "employeeUsername": loggedInUser
        });
        if (response.data.statusCode === 200) {
            return {statusCodeRecieved: response.data.statusCode, behaviorSkillData: response.data.behaviorSkillData};
        } else {
            statusCodeRecieved = response.data.statusCode;
            throw new Error(response.data.serverMessage);
        }    
    } catch (error) {
        return {statusCode: statusCodeRecieved, errorMessage: String(error)};
    }
}

//Grabbed from Behavior/Detail/Page.tsx
export const getClientActiveBehaviorData = async (clientID: string | number, bID: string | number, loggedInUser: string) => {
    let statusCodeRecieved: number = 0;
    const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getTargetBehavior';

    try {
        const response = await Axios.post(url, {
            "clientID": clientID,
            "behaviorID": bID,
            "employeeUsername": loggedInUser
        });
        if (response.data.statusCode === 200) {
            return {statusCodeRecieved: response.data.statusCode, behaviorSkillData: response.data.behaviorSkillData.reverse()};
        } else {
            statusCodeRecieved = response.data.statusCode;
            throw new Error(response.data.serverMessage);
        }    
    } catch (error) {
        return {statusCode: statusCodeRecieved, errorMessage: String(error)};
    }
}

//Grabbed from Behavior/Archive_Detail/Page.tsx
export const getClientArchivedBehaviorBaseData = async (clientID: string | number, bID: string | number, loggedInUser: string) => {
    let statusCodeRecieved: number = 0;
    const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getAClientArchivedBehavior';

    try {
        const response = await Axios.post(url, {
            "clientID": clientID,
            "behaviorID": bID,
            "employeeUsername": loggedInUser
        });
        if (response.data.statusCode === 200) {
            return {statusCodeRecieved: response.data.statusCode, behaviorSkillData: response.data.behaviorSkillData, measurement: response.data.behaviorSkillData[0].measurement};
        } else {
            statusCodeRecieved = response.data.statusCode;
            throw new Error(response.data.serverMessage);
        }    
    } catch (error) {
        return {statusCode: statusCodeRecieved, errorMessage: String(error)};
    }
}

//Grabbed from Behavior/Archive_Detail/Page.tsx
export const getClientArchiveBehaviorData = async (clientID: string | number, bID: string | number, loggedInUser: string) => {
    let statusCodeRecieved: number = 0
    const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getAArchivedBehaviorData';

    try {
        const response = await Axios.post(url, {
            "clientID": clientID,
            "behaviorID": bID,
            "employeeUsername": loggedInUser
        });
        if (response.data.statusCode === 200) {
            return {statusCodeRecieved: response.data.statusCode, behaviorSkillData: response.data.behaviorSkillData.reverse()};
        } else {
            statusCodeRecieved = response.data.statusCode;
            throw new Error(response.data.serverMessage);
        }    
    } catch (error) {
        return {statusCode: statusCodeRecieved, errorMessage: String(error)};
    }
}