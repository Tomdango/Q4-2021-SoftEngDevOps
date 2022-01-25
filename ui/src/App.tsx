import { CssBaseline, GeistProvider } from "@geist-ui/core";
import React from "react";
import { AuthProvider } from "./core/context/AuthContext";
import Router from "./presentation/functional/Router";

const App: React.FC = () => {
  return (
    <GeistProvider>
      <CssBaseline />
      <AuthProvider>
        <Router />
      </AuthProvider>
    </GeistProvider>
  );
};

export default App;
