import {
  Button,
  Card,
  Grid,
  Input,
  Note,
  Spacer,
  Text,
  useToasts,
} from "@geist-ui/core";
import React, { FormEventHandler, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../core/APIClient";
import { LoginStatus } from "../../core/constants/Auth";
import { AppRoutes } from "../../core/constants/Routing";
import { useAuthContext } from "../../core/context/AuthContext";
import Layout from "../components/Layout";

const LoginView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { loginStatus, setLoggedIn } = useAuthContext();

  useEffect(() => {
    if (
      loginStatus === LoginStatus.LOGGED_IN &&
      location.pathname === AppRoutes.LOGIN
    ) {
      navigate(AppRoutes.HOME);
    }
  }, []);

  const [, setToast] = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await login(username, password);
      setIsLoading(false);

      if (!response.success) {
        setError("Login failed. Please check your details and try again.");
      } else {
        setLoggedIn(response.user);
        setToast({
          text: `Welcome back, ${response.user.name}.`,
          type: "success",
        });
        navigate(AppRoutes.HOME);
      }
    } catch (error) {
    } finally {
    }
  };

  return (
    <Layout title="Login" heading="Login" breadcrumbs={null}>
      <Grid.Container justify="center">
        <Grid>
          <Card shadow hoverable={false} width="500px">
            <Text h1 font="30px">
              Login
            </Text>
            {error && (
              <>
                <Note type="error" label="Error" filled>
                  {error}
                </Note>
                <Spacer h={1} />
              </>
            )}
            <form onSubmit={handleSubmit}>
              <Input
                width="100%"
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              >
                Username
              </Input>
              <Spacer h={1} />
              <Input.Password
                width="100%"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              >
                Password
              </Input.Password>
              <Spacer h={1} />
              <Button loading={isLoading} auto type="success" htmlType="submit">
                Sign In
              </Button>
            </form>
          </Card>
        </Grid>
      </Grid.Container>
    </Layout>
  );
};

export default LoginView;
