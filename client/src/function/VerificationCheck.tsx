import { getAccessToken } from '../lib/tokenStore';
import { getBootstrapStatus } from '../components/AuthBootstrap';

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
    if (typeof window === 'undefined') return false;

    // Check if we're still bootstrapping - don't log out yet
    const { isBootstrapping, isBootstrapped } = getBootstrapStatus();
    
    // Check localStorage for user data first
    const userData = localStorage.getItem('bmUserData');
    if (!userData) return false;
    
    const parsedData = JSON.parse(userData);
    if (!parsedData.bmLoggedInStatus) return false;
    
    // If still bootstrapping and user data exists, stay logged in
    if (isBootstrapping) return true;
    
    // After bootstrap completes, check for token
    if (isBootstrapped) {
        const token = getAccessToken();
        return Boolean(token);
    }
    
    // Before bootstrap starts, check for token
    const token = getAccessToken();
    return Boolean(token);
}

export const GetLoggedInUser = () => {
    if (typeof window === 'undefined') return null;

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