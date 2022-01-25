import { AppRoutes } from "../constants/Routing";

const useLogout = () => {
  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.href = AppRoutes.LOGIN;
  };

  return logout;
};

export default useLogout;
