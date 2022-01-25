import {
  Breadcrumbs,
  Button,
  Description,
  Fieldset,
  Grid,
  Input,
  Note,
  Select,
  Spacer,
  Text,
} from "@geist-ui/core";
import React from "react";
import { AppRoutes } from "../../core/constants/Routing";
import { useAuthContext } from "../../core/context/AuthContext";
import RoomManagement from "../components/admin/RoomManagement";
import Layout from "../components/Layout";

const AdminView: React.FC = () => {
  const { user } = useAuthContext();

  if (user.role !== "admin") {
    return <p>You do not have permission to view this page.</p>;
  }

  return (
    <Layout
      title="Admin Panel"
      heading="Admin Panel"
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Item href={AppRoutes.HOME}>Home</Breadcrumbs.Item>
          <Breadcrumbs.Item>Admin Panel</Breadcrumbs.Item>
        </Breadcrumbs>
      }
    >
      <Grid.Container mt={2} gap={4}>
        <Grid xs={12} direction="column">
          <RoomManagement />
        </Grid>
        <Grid xs={12} direction="column">
          <Description title="User Management" mb={1} />

          <Fieldset.Group value="Create User" height="min-content">
            <Fieldset label="Create User">
              <form>
                <Input type="default" placeholder="Name" width="100%" />
                <Spacer h={0.5} />
                <Input type="default" placeholder="Username" width="100%" />
                <Spacer h={0.5} />
                <Input type="default" placeholder="Password" width="100%" />
                <Spacer h={0.5} />
                <Select placeholder="Role">
                  <Select.Option>Admin</Select.Option>
                  <Select.Option>User</Select.Option>
                </Select>
                <Spacer h={1} />
                <Button type="success" htmlType="submit" auto>
                  Create User
                </Button>
              </form>
            </Fieldset>

            <Fieldset label="Delete User">
              <form>
                <Note type="error" label="Warning">
                  This action is destructive. All data related to the user,
                  including bookings, will be deleted.
                </Note>
                <Grid.Container
                  justify="center"
                  alignItems="center"
                  mt={1}
                  mb={2}
                >
                  <Grid xs>
                    <Input label="Username" width="100%" />
                  </Grid>
                  <Grid>
                    <Text
                      pl={1}
                      pr={1}
                      style={{ fontWeight: 600, textTransform: "uppercase" }}
                    >
                      or
                    </Text>
                  </Grid>
                  <Grid xs>
                    <Input label="User ID" width="100%" />
                  </Grid>
                </Grid.Container>
                <Input.Password label="Confirm your password" width="100%" />
                <Button type="error" mt={1} auto>
                  Delete User
                </Button>
              </form>
            </Fieldset>
          </Fieldset.Group>
        </Grid>
      </Grid.Container>
    </Layout>
  );
};

export default AdminView;
