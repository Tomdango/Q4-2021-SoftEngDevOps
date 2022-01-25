import { Card, Spinner, Table, Text } from "@geist-ui/core";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getBookingsForCurrentUser } from "../../../core/APIClient";

const withButton = (data: any[]) => data.forEach(() => {});

const UpcomingBookings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingBookings, setUpcomingBookings] = useState<Array<any>>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const bookings = await getBookingsForCurrentUser();
        setUpcomingBookings(bookings);
        setIsLoading(false);
      } catch {
        setIsLoading(true);
      }
    };
    loadData();
  }, []);

  return (
    <Card shadow width="100%" height="min-content">
      <Text h2 font="20px">
        Your Upcoming Bookings
      </Text>

      {isLoading && <Spinner />}
      {!isLoading && upcomingBookings.length === 0 && (
        <Text p>You have no upcoming bookings.</Text>
      )}

      {!isLoading && upcomingBookings.length > 0 && (
        <Table data={upcomingBookings} emptyText="-">
          <Table.Column prop="id" label="ID"></Table.Column>
          <Table.Column prop="note" label="Note"></Table.Column>
          <Table.Column
            prop="time_from"
            label="From"
            render={(time_from) => (
              <>{moment(new Date(time_from * 1000)).toLocaleString()}</>
            )}
          />
          <Table.Column
            prop="time_to"
            label="From"
            render={(time_from) => (
              <>{new Date(time_from * 1000).toLocaleString()}</>
            )}
          />
        </Table>
      )}
    </Card>
  );
};

export default UpcomingBookings;
