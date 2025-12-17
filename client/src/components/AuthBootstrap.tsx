"use client";

import { useEffect } from "react";
import axios from "axios";
import { setAccessToken, clearAccessToken } from "@/lib/tokenStore";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_UR;

export default function AuthBootstrap() {
    useEffect(() => {
        (async () => {
        try {
            const res = await axios.post(`${API_BASE}/auth/refresh`, null, {
            withCredentials: true,
            });
            setAccessToken(res.data.accessToken);
        } catch {
            clearAccessToken();
        }
        })();
    }, []);

    return null;
}