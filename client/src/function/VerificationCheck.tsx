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

export const SetLoggedInUser = (loginSuccessful: boolean, uName: string, isAdmin: boolean) => {
    if (loginSuccessful) {
        localStorage.setItem('bmLoggedInStatus', "true");
        localStorage.setItem('bmUsername', uName);

        if (isAdmin) {
            localStorage.setItem('bmAdmin', "true")
        }
    }
    else {
        ClearLoggedInUser();
    }
}

export const ClearLoggedInUser = () => {
    localStorage.clear();
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

    ClearLoggedInUser();
    return true;
}