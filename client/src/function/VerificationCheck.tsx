export const SetLoggedInUser = (loginSuccessful: boolean, accessToken: string, refreshToken: string, user: { uName: string, compID: string | number, compName: string, isAdmin: boolean }) => {
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
        localStorage.setItem('bmAccessToken', accessToken);
        localStorage.setItem('bmRefreshToken', refreshToken);
    }
    else {
        ClearLoggedInUser();
    }
}

export const ClearLoggedInUser = () => {
    if (typeof window === 'undefined') return true;

    localStorage.clear();
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

export const RetrieveAccessToken = () => {
    if (typeof window === 'undefined') return true;

    const accessToken = localStorage.getItem('bmAccessToken');
    if (accessToken) {
        return `Bearer ${String(accessToken)}`;
    }
    return null;
}

export const RetrieveRefreshToken = () => {
    if (typeof window === 'undefined') return true;

    const refreshToken = localStorage.getItem('bmRefreshToken');
    if (refreshToken) {
        return `Bearer ${String(refreshToken)}`;
    }
    return null;
}


export const NeedToLogout = (uName: string) => {
    if (typeof window === 'undefined') return true;
    
    if (GetLoggedInUserStatus() && uName === GetLoggedInUser()) {
        return false;
    }

    ClearLoggedInUser();
    return true;
}