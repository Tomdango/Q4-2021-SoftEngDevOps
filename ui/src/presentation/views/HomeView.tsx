import { Breadcrumbs, Grid } from "@geist-ui/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../core/context/AuthContext";
import AvailableRooms from "../components/bookings/AvailableRooms";
import UpcomingBookings from "../components/bookings/UpcomingBookings";
import Layout from "../components/Layout";

const HomeView: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  return (
    <Layout
      title="Dashboard"
      heading="Dashboard"
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        </Breadcrumbs>
      }
    >
      <Grid.Container gap={4}>
        <Grid xs={24} lg={8}>
          <UpcomingBookings />
        </Grid>
        <Grid xs={24} lg={16}>
          <AvailableRooms />
        </Grid>
      </Grid.Container>
    </Layout>
  );
};

export default HomeView;
