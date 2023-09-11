import React, { useContext, createContext } from "react";
import { AuthServiceProp } from "../@types/auth-service";
import { useAuthService } from "../hooks/useAuthService";

const AuthServiceContext = createContext<AuthServiceProp | null>(null);

export const AuthServiceProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const authService = useAuthService();
  return (
    <AuthServiceContext.Provider value={authService}>
      {children}
    </AuthServiceContext.Provider>
  );
};

export const useAuthServiceContext = (): AuthServiceProp => {
  const authService = useContext(AuthServiceContext);
  if (!authService) {
    throw new Error(
      "useAuthServiceContext must be used within AuthServiceProvider"
    );
  }
  return authService;
};
