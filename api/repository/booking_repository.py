from datetime import datetime
from typing import List, Optional, Tuple

from api.models.booking_model import Booking

from .abstract_repository import AbstractRepository


class BookingRepository(AbstractRepository):
    """"""

    HEADERS = ["id", "note", "room_id", "user_id", "time_from", "time_to"]

    def create_table(self) -> None:
        """"""
        query = """
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            note TEXT,
            room_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            time_from timestamp NOT NULL,
            time_to timestamp NOT NULL,
            FOREIGN KEY (room_id)
                REFERENCES rooms (id),
            FOREIGN KEY (user_id)
                REFERENCES bookings (id)
        )
        """

        with self.open_cursor() as cursor:
            cursor.execute(query)

    def add(self, booking: Booking) -> None:
        """
        Add a room booking
        """

        query = """
        INSERT INTO bookings (
            note,
            room_id,
            user_id,
            time_from,
            time_to
        ) VALUES (?, ?, ?, ?, ?)"""

        with self.open_cursor() as cursor:
            cursor.execute(query, (booking.note, booking.room_id, booking.user_id,
                           booking.time_from, booking.time_to))
            booking.id = cursor.lastrowid

    def get_all_by_room_id(self, room_id: str) -> List[Booking]:
        """
        Gets all bookings by a room id
        """

        query = "SELECT * FROM bookings WHERE room_id = ?"

        with self.open_cursor() as cursor:
            cursor.execute(query, (room_id,))
            results = cursor.fetchall()

        return [self._tuple_to_booking(result) for result in results]

    def get_all_by_time(self, time_from: datetime, time_to: datetime, room_id: Optional[str] = None) -> List[Booking]:
        """
        Gets all bookings within time frame
        Optionally can use a room_id to also select by room id
        """

        if room_id is None:
            query = "SELECT * FROM bookings WHERE time_from BETWEEN ? AND ?"
            params = (time_from, time_to)

        else:
            query = "SELECT * FROM bookings WHERE room_id = ? AND time_from BETWEEN ? AND ?"
            params = (room_id, time_from, time_to)

        with self.open_cursor() as cursor:
            cursor.execute(query, params)
            results = cursor.fetchall()

        return [self._tuple_to_booking(result) for result in results]

    def get_all_by_user_id(self, user_id: str) -> List[Booking]:
        """"""
        query = "SELECT * FROM bookings WHERE user_id = ?"

        with self.open_cursor() as cursor:
            cursor.execute(query, (user_id,))
            results = cursor.fetchall()

        return [self._tuple_to_booking(result) for result in results]

    def _tuple_to_booking(self, data: Tuple) -> Booking:
        """ """
        data_dict = dict(zip(self.HEADERS, data))

        time_from_timestamp = data_dict.get("time_from")
        time_to_timestamp = data_dict.get("time_to")

        data_dict["time_from"] = datetime.fromisoformat(time_from_timestamp)
        data_dict["time_to"] = datetime.fromisoformat(time_to_timestamp)

        return Booking(**data_dict)
