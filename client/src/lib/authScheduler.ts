import { setAccessToken, clearAccessToken } from "./tokenStore";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

export function scheduleSilentRefresh(accessToken: string) {
    if (refreshTimeout) clearTimeout(refreshTimeout);

    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    const expMs = payload.exp * 1000;
    const refreshAt = expMs - 30_000; // 30s early
    const delay = Math.max(refreshAt - Date.now(), 1000);

    refreshTimeout = setTimeout(async () => {
        try {
        const res = await axios.post(`${API_BASE}/auth/refresh`, null, { withCredentials: true });
        setAccessToken(res.data.accessToken);
        scheduleSilentRefresh(res.data.accessToken);
        } catch {
        clearAccessToken();
        }
    }, delay);
}
