import Cookies from 'js-cookies';

export const SetCookies = (name: string, value: string, expirationTime: string, path: string, secure: boolean, sameSite: 'strict' | 'lax' | 'none') => {

    const cookieOptions = {
        path: path,
        secure: secure,
        sameSite: sameSite,
        expires: new Date(expirationTime)
    };

    Cookies.set(name, value, cookieOptions);
};

export const isCookieValid = () => {
    const cookieName = 'bmAuthServices-' + GetLoggedInUser();
    const cookieValue = Cookies.get(cookieName);

    if (cookieValue) {
        // Cookie exists, parse its content
        try {
            const parsedValue = JSON.parse(cookieValue);

            // Check if the expiration date is valid
            const expirationDate = new Date(parsedValue.expirationDate);
            const currentTime = new Date();

            if (currentTime > expirationDate) {
                // True if current time is after expiration
                localStorage.clear();
                return false;
            }
            // True if current time is before expiration
            return true;
        } catch (error) {
            console.error('Failed to parse cookie value:', error);
            return false;
        }
    }
    // Cookie doesn't exist
    return false;
};

export const SetLoggedInUser = (loginSuccessful: boolean, uName: string, isAdmin: boolean) => {
    if (loginSuccessful) {
        localStorage.setItem('bmLoggedInStatus', "true");
        localStorage.setItem('bmUsername', uName);

        if (isAdmin) {
            localStorage.setItem('bmAdmin', "true")
        }
    }
    else {
        localStorage.clear();
    }
}

export const GetLoggedInUserStatus = () => {
    const isUserLoggedStatus = localStorage.getItem('bmLoggedInStatus');

    if (isUserLoggedStatus === "true") {
        return true;
    }
    return false;
}

export const GetLoggedInUser = () => {
    if (GetLoggedInUserStatus()) {
        return localStorage.getItem('bmUsername');
    }
    return null;
}

export const GetAdminStatus = () => {
    if (GetLoggedInUserStatus()) {
        if (localStorage.getItem('bmAdmin') !== null && localStorage.getItem('bmAdmin') === "true") {
            return true;
        }
        return false;
    }
    return false;
}

export const NeedToLogout = (uName: string) => {
    if (GetLoggedInUserStatus() && uName === GetLoggedInUser()) {
        return false;
    }

    localStorage.clear();
    return true;
}