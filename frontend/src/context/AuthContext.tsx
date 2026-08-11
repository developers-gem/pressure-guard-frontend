import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthUser } from "@/api/types";
import * as api from "@/api/resources";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; credentials?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem("pg_user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("pg_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .fetchMe()
      .then((u) => {
        setUser(u);
        localStorage.setItem("pg_user", JSON.stringify(u));
      })
      .catch(() => {
        localStorage.removeItem("pg_token");
        localStorage.removeItem("pg_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user: u } = await api.login(email, password);
    localStorage.setItem("pg_token", token);
    localStorage.setItem("pg_user", JSON.stringify(u));
    setUser(u);
  };

  const register = async (payload: { name: string; email: string; password: string; credentials?: string }) => {
    const { token, user: u } = await api.register(payload);
    localStorage.setItem("pg_token", token);
    localStorage.setItem("pg_user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("pg_token");
    localStorage.removeItem("pg_user");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
