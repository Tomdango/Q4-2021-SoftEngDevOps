import {
  Breadcrumbs,
  Button,
  Card,
  Description,
  Grid,
  Input,
  Spinner,
  Table,
} from "@geist-ui/core";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { getAllRooms } from "../../core/APIClient";
import Layout from "../components/Layout";

const RoomsView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allRooms, setAllRooms] = useState<any[]>([]);
  const [displayRooms, setDisplayRooms] = useState<any[]>([]);

  const [location, setLocation] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const rooms = await getAllRooms();
      setAllRooms(rooms);
      setDisplayRooms(
        rooms.map((room: any) => ({
          ...room,
          button: (
            <Button auto onClick={() => navigate(`/app/rooms/${room.id}`)}>
              View
            </Button>
          ),
        }))
      );

      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const addButton = (room: any) => ({
      ...room,
      button: (
        <Button
          auto
          type="success"
          onClick={() => navigate(`/app/rooms/${room.id}`)}
        >
          View
        </Button>
      ),
    });

    const filteredRooms = allRooms
      .filter((room) =>
        room.location.toLowerCase().includes(location.toLowerCase())
      )
      .filter((room) =>
        minCapacity ? room.capacity >= parseInt(minCapacity) : true
      )
      .filter((room) =>
        maxCapacity ? room.capacity <= parseInt(maxCapacity) : true
      )
      .map(addButton);

    setDisplayRooms(() => filteredRooms);
  }, [allRooms, minCapacity, maxCapacity, location]);

  return (
    <Layout
      title="Rooms"
      heading="Rooms"
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Item>Home</Breadcrumbs.Item>
          <Breadcrumbs.Item>Rooms</Breadcrumbs.Item>
        </Breadcrumbs>
      }
    >
      <Card shadow width="100%">
        <Description title="Filter" mb={1} />
        <Grid.Container gap={2}>
          <Grid sm={4}>
            <Input
              label="Location"
              width="100%"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Grid>
          <Grid sm={4}>
            <Input
              label="Minimum Capacity"
              htmlType="number"
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
            />
          </Grid>
          <Grid sm={4}>
            <Input
              label="Maximum Capacity"
              htmlType="number"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
            />
          </Grid>
        </Grid.Container>
      </Card>
      <Card shadow mt={2}>
        <Description title="Search Results" mb={1} />
        {isLoading ? (
          <Spinner scale={2} mb={2} />
        ) : (
          <Table data={displayRooms}>
            <Table.Column prop="name" label="Name" />
            <Table.Column prop="description" label="Description" />
            <Table.Column prop="location" label="Location" />
            <Table.Column prop="capacity" label="Capacity" />
            <Table.Column width={1} prop="button" />
          </Table>
        )}
      </Card>
    </Layout>
  );
};

export default RoomsView;
