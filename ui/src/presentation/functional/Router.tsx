import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { AppViews } from "../../core/constants/Routing";

const AppRoutes: React.FC = () => useRoutes(AppViews);

const Router: React.FC = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default Router;
