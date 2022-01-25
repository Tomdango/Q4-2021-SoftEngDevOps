import { createContext, useContext } from "react";
import { LoginStatus } from "../constants/Auth";
import useAuthClient from "../hooks/UseAuthClient";

export const AuthContext = createContext<ReturnType<typeof useAuthClient>>({
  user: {},
  loginStatus: LoginStatus.LOADING,
  setLoggedIn: () => undefined,
  setLoggedOut: () => undefined,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const client = useAuthClient();
  return client.loginStatus === LoginStatus.LOADING ? null : (
    <AuthContext.Provider value={client}>{children}</AuthContext.Provider>
  );
};
