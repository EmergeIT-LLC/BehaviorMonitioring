import axios, { AxiosRequestConfig, Method } from 'axios';
import { RetrieveAccessToken, RetrieveRefreshToken, ClearLoggedInUser } from '../function/VerificationCheck';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_UR;

async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = RetrieveRefreshToken();
    if (!refreshToken) return null;

    try {
        const res = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefresh } = res.data;

        localStorage.setItem('bmAccessToken', accessToken);
        localStorage.setItem('bmRefreshToken', newRefresh);

        return accessToken;
    } catch {
        return null;
    }
}

export async function api<T = any>(
    method: Method,
    path: string,
    payload?: any
): Promise<T> {
    const tokenWithBearer = RetrieveAccessToken(); // e.g. "Bearer eyJhbGciOi..."

    const config: AxiosRequestConfig = {
        method,
        url: `${API_BASE}${path}`,
        headers: {},
    };

    if (method.toLowerCase() === 'get') {
        config.params = payload;
    } else {
        config.data = payload;
    }

    if (tokenWithBearer) {
        (config.headers as any).Authorization = tokenWithBearer;
    }

    try {
        const res = await axios(config);
        return res.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            const newAccess = await refreshAccessToken();
            if (!newAccess) {
                ClearLoggedInUser();
                throw error;
            }

            const retryConfig: AxiosRequestConfig = {
                ...config,
                headers: {
                    ...(config.headers || {}),
                    Authorization: `Bearer ${newAccess}`,
                },
            };

            const retryRes = await axios(retryConfig);
            return retryRes.data;
        }

        throw error;
    }
}