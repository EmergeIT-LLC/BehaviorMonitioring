"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { setAccessToken, clearAccessToken } from "@/lib/tokenStore";
import { scheduleSilentRefresh } from "../lib/authScheduler";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

// Track if bootstrap is complete
let isBootstrapped = false;
let isBootstrapping = false;

export function getBootstrapStatus() {
    return { isBootstrapped, isBootstrapping };
}

export default function AuthBootstrap() {
    const [, setReady] = useState(false);

    useEffect(() => {
        if (isBootstrapping || isBootstrapped) return;
        
        isBootstrapping = true;
        
        (async () => {
            try {
                const res = await axios.post(`${API_BASE}/auth/refresh`, null, {
                    withCredentials: true,
                });
                setAccessToken(res.data.accessToken);
                scheduleSilentRefresh(res.data.accessToken);
            } catch {
                clearAccessToken();
            } finally {
                isBootstrapped = true;
                isBootstrapping = false;
                setReady(true);
            }
        })();
    }, []);

    return null;
}