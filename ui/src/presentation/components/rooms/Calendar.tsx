import { Spinner } from "@geist-ui/core";
import moment from "moment";
import React from "react";
import { Calendar, Event, momentLocalizer, SlotInfo } from "react-big-calendar";

type RoomCalendarProps = {
  events: Event[];
  isLoading: boolean;
  onSelection: (slot: SlotInfo) => void;
};

const RoomCalendar: React.FC<RoomCalendarProps> = ({
  events,
  isLoading,
  onSelection,
}) => {
  const minTime = new Date();
  const maxTime = new Date();

  minTime.setHours(7, 0, 0);
  maxTime.setHours(20, 0, 0);

  return (
    <>
      {isLoading && <Spinner mb={1} />}
      <Calendar
        events={events}
        localizer={momentLocalizer(moment)}
        defaultView="day"
        views={["day", "work_week", "week"]}
        onSelectSlot={onSelection}
        popup
        step={15}
        selectable
        min={minTime}
        max={maxTime}
      />
    </>
  );
};

export default RoomCalendar;
