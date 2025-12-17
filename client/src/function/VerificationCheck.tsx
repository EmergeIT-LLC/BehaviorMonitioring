export const SetLoggedInUser = (loginSuccessful: boolean, user: { uName: string, compID: string | number, compName: string, isAdmin: boolean }) => {
    if (typeof window === 'undefined') return true;
    
    if (loginSuccessful) {
        const dataToStore = {
            bmLoggedInStatus: loginSuccessful,
            bmUsername: user.uName,
            bmCompanyID: String(user.compID),
            bmCompanyName: user.compName,
            bmAdmin: user.isAdmin
        };

        localStorage.setItem('bmUserData', JSON.stringify(dataToStore));
    }
    else {
        ClearLoggedInUser();
    }
}

export const ClearLoggedInUser = () => {
    if (typeof window === 'undefined') return true;

    localStorage.removeItem('bmUserData');
}

export const GetLoggedInUserStatus = () => {
    if (typeof window === 'undefined') return true;

    const userData = localStorage.getItem('bmUserData');
    if (userData) {
        const parsedData = JSON.parse(userData);
        return Boolean(parsedData.bmLoggedInStatus);
    }
    return false;
}

export const GetLoggedInUser = () => {
    if (typeof window === 'undefined') return true;

    if (GetLoggedInUserStatus()) {
        const userData = localStorage.getItem('bmUserData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            return String(parsedData.bmUsername);
        }
    }
    return null;
}

export const GetAdminStatus = () => {
    if (typeof window === 'undefined') return true;
    
    if (GetLoggedInUserStatus()) {
        const userData = localStorage.getItem('bmUserData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            return Boolean(parsedData.bmAdmin);
        }
    }
    return false;
}

export const NeedToLogout = (uName: string) => {
    if (typeof window === 'undefined') return true;
    
    if (GetLoggedInUserStatus() && uName === GetLoggedInUser()) {
        return false;
    }

    ClearLoggedInUser();
    return true;
}