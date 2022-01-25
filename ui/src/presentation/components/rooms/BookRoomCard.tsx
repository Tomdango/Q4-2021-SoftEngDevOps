import {
  Button,
  Card,
  Description,
  Grid,
  Note,
  Text,
  Textarea,
} from "@geist-ui/core";
import moment from "moment";
import React, { FormEventHandler } from "react";
import { formatDate } from "../../../core/utils/DateUtils";

type BookRoomCardProps = {
  isLoading: boolean;
  overlap: boolean;
  note: string;
  onNoteChange: (note: string) => any;
  onSubmit: FormEventHandler;
  fromDate: Date | null;
  toDate: Date | null;
};

const BookRoomCard: React.FC<BookRoomCardProps> = ({
  overlap,
  isLoading,
  fromDate,
  toDate,
  note,
  onNoteChange,
  onSubmit,
}) => {
  return (
    <Card shadow width="100%" height="min-content" mb={2}>
      <Text h2 font="25px">
        Book
      </Text>
      {!(fromDate && toDate) && (
        <Note label="Hint" type="success" mb={2}>
          Click and drag on a free space in the calendar to select a time.
        </Note>
      )}
      {overlap && (
        <Note type="error" label="Error" mb={2}>
          This selection overlaps with an existing booking
        </Note>
      )}
      <Grid.Container>
        <Grid xs={9}>
          <Description title="Start Time" content={formatDate(fromDate)} />
        </Grid>
        <Grid xs={9}>
          <Description title="End Time" content={formatDate(toDate)} />
        </Grid>
        <Grid xs={6}>
          <Description
            title="Duration (Hours)"
            content={
              fromDate && toDate
                ? `${moment(toDate).diff(fromDate, "hour", true)}`
                : "-"
            }
          />
        </Grid>
      </Grid.Container>
      <form onSubmit={onSubmit}>
        <Textarea
          required
          placeholder="Add a note"
          mt={1}
          value={note}
          onChange={(e) => onNoteChange(e.currentTarget.value)}
          width="100%"
          disabled={!(fromDate && toDate) || isLoading || overlap}
        />
        <Button
          mt={1}
          type="success"
          htmlType="submit"
          loading={isLoading}
          disabled={!(fromDate && toDate) || overlap}
        >
          Save Booking
        </Button>
      </form>
    </Card>
  );
};

export default BookRoomCard;
