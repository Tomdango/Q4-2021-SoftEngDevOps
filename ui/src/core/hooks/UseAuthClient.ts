import { useEffect, useState } from "react";
import { refresh } from "../APIClient";
import { LoginStatus } from "../constants/Auth";

const useAuthClient = () => {
  const [loginStatus, setLoginStatus] = useState(LoginStatus.LOADING);
  const [user, setUser] = useState<any>({});

  const setLoggedIn = (user: any) => {
    setUser(user);
    setLoginStatus(LoginStatus.LOGGED_IN);
  };

  const setLoggedOut = () => {
    setUser({});
    setLoginStatus(LoginStatus.LOGGED_OUT);
  };

  useEffect(() => {
    const initAuth = async () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken === null) {
        setLoginStatus(LoginStatus.LOGGED_OUT);
        return;
      }

      const result = await refresh();
      if (result.success) {
        setLoggedIn(result.user);
      } else {
        localStorage.removeItem("authToken");
        setLoginStatus(LoginStatus.LOGGED_OUT);
      }
    };
    initAuth();
  }, []);

  return {
    user,
    loginStatus,
    setLoggedIn,
    setLoggedOut,
  };
};

export default useAuthClient;
