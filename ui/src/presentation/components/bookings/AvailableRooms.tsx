import { Button, Card, Spinner, Table, Text } from "@geist-ui/core";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRooms } from "../../../core/APIClient";

const withButtons = (rooms: any[], navigate: Function) =>
  rooms.map((room) => ({
    ...room,
    button: (
      <Button
        auto
        type="success"
        onClick={() => navigate(`/app/rooms/${room.id}`)}
      />
    ),
  }));

const AvailableRooms: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const data = await getAllRooms();
      setRooms(withButtons(data, navigate));
      setIsLoading(false);
    };
    loadData();
  }, [navigate]);

  return (
    <Card shadow width="100%">
      <Text h2 font="20px">
        Available Rooms
      </Text>
      {isLoading && <Spinner />}
      {!isLoading && rooms.length === 0 && (
        <Text p>There are currently no available rooms.</Text>
      )}
      {!isLoading && rooms.length > 1 && (
        <Table data={rooms} emptyText="-">
          <Table.Column prop="name" label="Name" />
          <Table.Column prop="description" label="Description" />
          <Table.Column prop="capacity" label="Capacity" />
          <Table.Column prop="location" label="Location" />
          <Table.Column prop="button" width={1} />
        </Table>
      )}
    </Card>
  );
};

export default AvailableRooms;
