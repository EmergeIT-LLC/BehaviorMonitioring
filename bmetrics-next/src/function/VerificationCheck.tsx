import Cookies from 'js-cookie';

export const SetCookies = (name: string, value: object, expirationTime: string, path: string, secure: boolean, sameSite: 'strict' | 'lax' | 'none') => {
    const cookieOptions = {
        path: path,
        secure: secure,
        sameSite: sameSite,
        expires: new Date(expirationTime)
    };

    const values = { ...value, expirationDate: expirationTime };
    Cookies.set(name, JSON.stringify(values), cookieOptions);
};

export const isCookieValid = () => {
    if (typeof window === 'undefined') return true;
    
    const cookieName = "bmAuthServices-" + GetLoggedInUser();
    const cookieValue = Cookies.get(cookieName);

    if (cookieValue) {
        // Cookie exists, parse its content
        try {
            const parsedValue = JSON.parse(cookieValue);

            // Check if the parsed value has a valid expirationDate
            if (parsedValue.expirationDate) {
                const expirationDate = new Date(parsedValue.expirationDate);

                // Validate the expiration date
                if (isNaN(expirationDate.getTime())) {
                    return false;
                }

                const currentTime = new Date();

                if (currentTime > expirationDate) {
                    // True if current time is after expiration
                    ClearLoggedInUser();
                    return false;
                }
                // True if current time is before expiration
                return true;
            } else {
                ClearLoggedInUser();
                return false;
            }
        } catch (error) {
            ClearLoggedInUser();
            return false;
        }
    }
    // Cookie doesn't exist
    ClearLoggedInUser();
    return false;
};

export const DeleteCookies = (name: string, expirationTime: string, path: string) => {

    const cookieOptions = {
        path: path,
        expires: new Date(expirationTime)
    };

    Cookies.remove(name, cookieOptions);
};

export const isAuthenticated = () => isCookieValid();

export const SetLoggedInUser = (loginSuccessful: boolean, uName: string, compID: string | number, compName: string, isAdmin: boolean) => {
    if (typeof window === 'undefined') return true;
    
    if (loginSuccessful) {
        const dataToStore = {
            bmLoggedInStatus: loginSuccessful,
            bmUsername: uName,
            bmCompanyID: String(compID),
            bmCompanyName: compName,
            bmAdmin: isAdmin
        };

        localStorage.setItem('bmUserData', JSON.stringify(dataToStore));
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

export const NeedToLogout = (uName: string) => {
    if (typeof window === 'undefined') return true;
    
    if (GetLoggedInUserStatus() && uName === GetLoggedInUser()) {
        return false;
    }

    ClearLoggedInUser();
    return true;
}