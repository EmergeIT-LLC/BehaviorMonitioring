

export const GetLoggedInUserStatus = () => {
    const isUserLoggedStatus = localStorage.getItem('bmLoggedInStatus');

    if (isUserLoggedStatus) {
        return true;
    }
    return false;
}

export const GetLoggedInUser = () => {
    if (GetLoggedInUserStatus()) {
        return localStorage.getItem('bmUsername');
    }
}

export const NeedToLogout = (uName: string) => {
    if (GetLoggedInUserStatus() && uName === GetLoggedInUser()) {
        return false;
    }
    return true;
}