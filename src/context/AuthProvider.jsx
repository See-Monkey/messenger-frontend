import { useEffect, useState } from "react";
import * as authApi from "../api/auth.js";
import { getMe } from "../api/users.js";
import { AuthContext } from "./authContext.js";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    authApi.logout();
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    async function initializeAuth() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getMe();
        setUser(currentUser);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setUser,
        isAuthenticated: !!user,
        loading,
        login: async (data) => {
          const res = await authApi.login(data);
          if (res?.token) {
            setToken(res.token);

            if (res.user) {
              setUser(res.user);
            }
          }
          return res;
        },
        register: async (data) => {
          const res = await authApi.register(data);
          if (res?.token) {
            setToken(res.token);

            if (res.user) {
              setUser(res.user);
            }
          }
          return res;
        },
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
