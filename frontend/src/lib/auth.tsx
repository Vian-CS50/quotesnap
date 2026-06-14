"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8341";

export interface AuthUser {
  id: number;
  email: string;
  full_name: string | null;
  business_name: string | null;
  is_subscribed: boolean;
  subscription_tier: string;
  totp_enabled: boolean;
  quotes_used: number;
  quotes_remaining: number;
  has_custom_pricing: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ requires_2fa?: boolean; temp_token?: string; error?: string }>;
  login2FA: (email: string, password: string, totp_code: string) => Promise<{ error?: string }>;
  signup: (data: { email: string; password: string; full_name: string; business_name?: string }) => Promise<{ error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("qs_access_token") || localStorage.getItem("access_token");
}

function setToken(token: string) {
  localStorage.setItem("qs_access_token", token);
  localStorage.setItem("access_token", token);
}

function clearToken() {
  localStorage.removeItem("qs_access_token");
  localStorage.removeItem("qs_refresh_token");
  localStorage.removeItem("access_token");
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (res.status === 401) {
    // Try refresh
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${getToken()}`;
      return fetch(`${API_URL}${path}`, { ...options, headers });
    }
  }
  return res;
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = localStorage.getItem("qs_refresh_token");
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.access_token);
      return true;
    }
  } catch {}
  clearToken();
  return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await apiFetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchMe().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.detail || "Login failed" };

      if (data.requires_2fa) {
        return { requires_2fa: true, temp_token: data.temp_token };
      }

      setToken(data.access_token);
      localStorage.setItem("qs_refresh_token", data.refresh_token);
      await fetchMe();
      return {};
    } catch {
      return { error: "Network error" };
    }
  };

  const login2FA = async (email: string, password: string, totp_code: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, totp_code }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.detail || "2FA login failed" };

      setToken(data.access_token);
      localStorage.setItem("qs_refresh_token", data.refresh_token);
      await fetchMe();
      return {};
    } catch {
      return { error: "Network error" };
    }
  };

  const signup = async (data: { email: string; password: string; full_name: string; business_name?: string }) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) return { error: result.detail || "Signup failed" };

      setToken(result.access_token);
      localStorage.setItem("qs_refresh_token", result.refresh_token);
      await fetchMe();
      return {};
    } catch {
      return { error: "Network error" };
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {}
    clearToken();
    setUser(null);
    window.location.href = "/";
  };

  const refreshUser = async () => {
    await fetchMe();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, login2FA, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

export { apiFetch };
