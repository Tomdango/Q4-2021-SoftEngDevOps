import { Spinner } from "@geist-ui/core";
import moment from "moment";
import React from "react";
import {
  Calendar,
  Event,
  EventPropGetter,
  momentLocalizer,
  SlotInfo,
} from "react-big-calendar";
import { useAuthContext } from "../../../core/context/AuthContext";

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
  const { user } = useAuthContext();

  const minTime = new Date();
  const maxTime = new Date();

  minTime.setHours(7, 0, 0);
  maxTime.setHours(20, 0, 0);

  const getEventProps: EventPropGetter<any> = (event) => {
    return {
      style: {
        backgroundColor: event.user.id === user.id ? "green" : undefined,
      },
    };
  };

  return (
    <>
      {isLoading && <Spinner mb={1} />}
      <Calendar
        events={events}
        localizer={momentLocalizer(moment)}
        defaultView="day"
        views={["day", "work_week", "week"]}
        onSelectSlot={onSelection}
        eventPropGetter={getEventProps}
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
