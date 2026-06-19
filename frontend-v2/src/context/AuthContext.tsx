"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from "react";
import type { User, LoginCredentials, SignupData } from "@/types";
import { getToken, setToken, removeToken, isTokenValid } from "@/lib/auth";
import { login as apiLogin, signup as apiSignup, getMe, forgotPassword as apiForgotPassword } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = useMemo(() => !!user && !!token, [user, token]);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedToken = getToken();
      if (storedToken && isTokenValid(storedToken)) {
        setTokenState(storedToken);
        const me = await getMe();
        setUser(me.user);
      } else {
        removeToken();
        setTokenState(null);
        setUser(null);
      }
    } catch {
      removeToken();
      setTokenState(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      try {
        const res = await apiLogin(credentials);
        setToken(res.token);
        setTokenState(res.token);
        const me = await getMe();
        setUser(me.user);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const signup = useCallback(
    async (data: SignupData) => {
      setIsLoading(true);
      try {
        const res = await apiSignup(data);
        setToken(res.token);
        setTokenState(res.token);
        const me = await getMe();
        setUser(me.user);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUser(null);
    router.push("/");
  }, [router]);

  const forgotPassword = useCallback(async (email: string) => {
    await apiForgotPassword(email);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated,
      login,
      signup,
      logout,
      checkAuth,
      forgotPassword,
    }),
    [user, token, isLoading, isAuthenticated, login, signup, logout, checkAuth, forgotPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
