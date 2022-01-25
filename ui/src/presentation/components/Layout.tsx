import { Divider, Page } from "@geist-ui/core";
import React, { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginStatus } from "../../core/constants/Auth";
import { AppRoutes } from "../../core/constants/Routing";
import { useAuthContext } from "../../core/context/AuthContext";
import Header from "./Header";

type LayoutProps = {
  title: ReactNode;
  heading: string;
  breadcrumbs: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  heading,
  breadcrumbs,
}) => {
  const { loginStatus } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname !== AppRoutes.LOGIN &&
      loginStatus === LoginStatus.LOGGED_OUT
    ) {
      navigate(AppRoutes.LOGIN, { replace: true });
    }
  }, [loginStatus, location.pathname, navigate]);

  useEffect(() => {
    window.document.title = heading;
  }, [heading]);

  useEffect(() => {
    window.scroll({ top: 0 });
  }, []);

  return (
    <Page>
      <Page.Header>
        <Header title={title} />
        {breadcrumbs}
        <Divider mb={3} />
      </Page.Header>
      <Page.Content pt={0}>{children}</Page.Content>
    </Page>
  );
};

export default Layout;
