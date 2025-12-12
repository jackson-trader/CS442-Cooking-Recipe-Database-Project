"use client";

import { useSession } from "@/src/context/CsrfContext";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL|| "http://localhost:8080";

export function useApi() {
    const { csrfToken } = useSession();

    const apiFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
        const headers = new Headers(init.headers || {});
        const method = (init.method || "GET").toUpperCase();


        const needsCsrf = method !== "GET" && method !== "HEAD";
        if (needsCsrf && csrfToken) {
            headers.set("X-XSRF-TOKEN", csrfToken);
        }


        let url: string;

        if (typeof input === "string") {
            url = input.startsWith("http")
                ? input
                : `${API_BASE}${input}`;
        } else {
            url = input.toString().startsWith("http")
                ? input.toString()
                : `${API_BASE}${input}`;
        }

        return fetch(url, {
            ...init,
            headers,
            credentials: "include",
        });
    };

    return { apiFetch };
}
