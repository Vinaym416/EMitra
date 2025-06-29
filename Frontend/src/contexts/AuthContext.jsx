import React, { createContext, useContext } from "react";
import { useAuthUser } from "../hooks/useAuthuser";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { authUser, isLoading, error } = useAuthUser();
  return (
    <AuthContext.Provider value={{ authUser, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}