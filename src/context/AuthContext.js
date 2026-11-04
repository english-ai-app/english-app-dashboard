import { createContext, useState } from "react";
import { AUTH_STORAGE_KEY } from "../utils/AxiosCustomize";

const getStoredAuth = () => {
  const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!storedAuth) {
    return null;
  }

  try {
    const authData = JSON.parse(storedAuth);
    return authData.accessToken ? authData : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [initialAuth] = useState(getStoredAuth);
  const [user, setUser] = useState(initialAuth);
  const [role, setRole] = useState(initialAuth?.roles || []);

  const login = (authData) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    setUser(authData);
    setRole(authData.roles || []);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setRole([]);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
