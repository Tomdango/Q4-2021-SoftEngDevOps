import { Button, Description, Grid, Text } from "@geist-ui/core";
import React, { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../core/constants/Routing";
import { useAuthContext } from "../../core/context/AuthContext";
import useLogout from "../../core/hooks/UseLogout";

type HeaderProps = {
  title: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  const location = useLocation();
  const logout = useLogout();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  if (location.pathname === AppRoutes.LOGIN) return null;

  return (
    <Grid.Container mt={3}>
      <Grid lg alignItems="center">
        {typeof title === "string" ? <Text h1>{title}</Text> : title}
        <Button auto ml={2} type="secondary" onClick={() => navigate(AppRoutes.ROOMS)}>
          Search Rooms
        </Button>
        {user.role === "admin" && (
          <Button
            type="error"
            auto
            ml={1}
            onClick={() => navigate(AppRoutes.ADMIN)}
          >
            Admin Panel
          </Button>
        )}
      </Grid>
      <Grid lg justify="flex-end" alignItems="center">
        <Button type="secondary" auto ml={1} onClick={() => logout()}>
          Logout
        </Button>
        <Description ml={1} title={`Role: ${user.role}`} content={user.name} />
      </Grid>
    </Grid.Container>
  );
};
export default Header;
