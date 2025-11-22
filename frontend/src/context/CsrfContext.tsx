"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

type User = { username: string; roles?: string[] };

type SessionValue = {
  // CSRF
  csrfToken: string | null;
  refreshCsrf: () => Promise<string>;

  // Auth state
  user: User | null;
  loading: boolean;
  error: string | null;

  // Auth actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

// default
const SessionCtx = createContext<SessionValue>({
  csrfToken: null,
  refreshCsrf: async () => "",
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshCsrf(): Promise<string> {
    const res = await fetch(`${API}/api/auth/csrf`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch CSRF");
    const { csrfToken } = await res.json();
    setCsrfToken(csrfToken);
    return csrfToken;
  }

  async function refreshUser() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/auth/me`, { credentials: "include" });
      setUser(res.ok ? await res.json() : null);
    } catch {
      setUser(null);
      setError("Failed to load session");
    } finally {
      setLoading(false);
    }
  }

  async function login(username: string, password: string) {
    const token = csrfToken ?? (await refreshCsrf());
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": token, 
      },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    await refreshUser();
  }

  async function logout() {
    const token = csrfToken ?? (await refreshCsrf());
    await fetch(`${API}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "X-XSRF-TOKEN": token },
    });
    setUser(null);
  }

  useEffect(() => {
    (async () => {
      try {
        await refreshCsrf();
      } finally {
        await refreshUser();
      }
    })();
  }, []);

  const value = useMemo(
    () => ({ csrfToken, refreshCsrf, user, loading, error, login, logout, refreshUser }),
    [csrfToken, user, loading, error]
  );

  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
};

export const useSession = () => useContext(SessionCtx);
