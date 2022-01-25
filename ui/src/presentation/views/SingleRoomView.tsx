import {
  Breadcrumbs,
  Card,
  Grid,
  Spinner,
  Text,
  useToasts,
} from "@geist-ui/core";
import React, { FormEventHandler, useEffect, useState } from "react";
import { Event, SlotInfo } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useParams } from "react-router-dom";
import {
  bookRoom,
  getBookingsByRoomID,
  getRoomByID,
} from "../../core/APIClient";
import { checkIfDateEntriesOverlap } from "../../core/utils/DateUtils";
import Layout from "../components/Layout";
import BookRoomCard from "../components/rooms/BookRoomCard";
import RoomCalendar from "../components/rooms/Calendar";
import RoomDetails from "../components/rooms/RoomDetails";

const SingleRoomView: React.FC = () => {
  const { roomID } = useParams();
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isBookLoading, setIsBookLoading] = useState(false);

  const [, setToast] = useToasts();

  const [roomData, setRoomData] = useState<any>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [overlap, setOverlap] = useState(false);

  const [note, setNote] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event>({});

  useEffect(() => {
    if (!roomID) return;
    const loadData = async () => {
      setRoomData(await getRoomByID(roomID));
      setIsPageLoading(false);

      const bookings = await getBookingsByRoomID(roomID);
      setEvents(
        bookings.map((booking: any) => {
          const timeFrom = new Date(booking.time_from * 1000);
          const timeTo = new Date(booking.time_to * 1000);

          return {
            title: booking.note || "(No Title)",
            start: timeFrom,
            end: timeTo,
            resource: booking,
          };
        })
      );
      setIsEventsLoading(false);
    };
    loadData();
  }, [roomID]);

  if (isPageLoading) {
    return (
      <Layout
        title={
          <>
            <Spinner scale={3} mr={0.5} />
            <Text h1>Loading</Text>
          </>
        }
        heading="Loading"
        breadcrumbs={null}
      >
        <Grid.Container
          width="100%"
          height="80vh"
          justify="center"
          alignItems="center"
        >
          <Spinner scale={2} />
        </Grid.Container>
      </Layout>
    );
  }

  const handleSelection = (slot: SlotInfo) => {
    const startTime = new Date(slot.start);
    const endTime = new Date(slot.end);

    const hasOverlap = checkIfDateEntriesOverlap([
      { from: startTime, to: endTime },
      ...events.map((event) => ({
        from: new Date(event.start || 0),
        to: new Date(event.end || 0),
      })),
    ]);
    setOverlap(hasOverlap);
    setSelectedEvent({
      start: startTime,
      end: endTime,
      title: "Unconfirmed Booking",
    });
  };

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    if (!roomID || !selectedEvent.start || !selectedEvent.end) return;

    setIsBookLoading(true);

    await bookRoom(roomID, selectedEvent.start, selectedEvent.end, note);

    setToast({ text: "Booking Confirmed", type: "success" });

    setEvents((e) => [...e, { ...selectedEvent, title: note }]);
    setSelectedEvent({});
    setIsBookLoading(false);
    setNote("");
  };

  return (
    <Layout
      title={`Viewing Room: ${roomData.name}`}
      heading={roomData.name}
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Item href="/app/home">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/app/rooms/">Rooms</Breadcrumbs.Item>
          <Breadcrumbs.Item>{roomData.name}</Breadcrumbs.Item>
        </Breadcrumbs>
      }
    >
      <Grid.Container gap={3}>
        <Grid xs={24} lg={10} direction="column">
          <BookRoomCard
            isLoading={isBookLoading}
            overlap={overlap}
            fromDate={selectedEvent.start || null}
            toDate={selectedEvent.end || null}
            note={note}
            onNoteChange={setNote}
            onSubmit={handleSubmit}
          />
          <RoomDetails {...roomData} />
        </Grid>
        <Grid xs={24} lg={14}>
          <Card shadow hoverable={false} width="100%">
            <RoomCalendar
              events={[...events, selectedEvent]}
              isLoading={isEventsLoading}
              onSelection={handleSelection}
            />
          </Card>
        </Grid>
      </Grid.Container>
    </Layout>
  );
};

export default SingleRoomView;
