from datetime import datetime
from typing import List, Optional, Tuple

from api.models.booking_model import Booking
from api.models.room_model import Room
from api.models.user_model import User
from api.repository.rooms_repository import RoomsRepository
from api.repository.user_repository import UserRepository

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

    def get_by_id(self, booking_id: str) -> Optional[Booking]:
        """"""
        query = """
        SELECT * FROM bookings
        INNER JOIN users ON users.id = bookings.user_id
        INNER JOIN rooms ON rooms.id = bookings.room_id
        WHERE bookings.id = ?
        """

        with self.open_cursor() as cursor:
            cursor.execute(query, (booking_id,))
            result = cursor.fetchone()

        return self._tuple_to_booking(result) if result else None

    def get_all_by_room_id(self, room_id: str) -> List[Booking]:
        """
        Gets all bookings by a room id
        """

        query = """
        SELECT * FROM bookings
        INNER JOIN users ON users.id = bookings.user_id
        INNER JOIN rooms ON rooms.id = bookings.room_id
        WHERE room_id = ?
        """

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
            query = """
            SELECT * FROM bookings
            INNER JOIN users ON users.id = bookings.user_id
            INNER JOIN rooms ON rooms.id = bookings.room_id
            WHERE time_from BETWEEN ? AND ?
            """
            params = (time_from, time_to)

        else:
            query = """
            SELECT * FROM bookings
            INNER JOIN users ON users.id = bookings.user_id
            INNER JOIN rooms ON rooms.id = bookings.room_id
            WHERE room_id = ? AND time_from BETWEEN ? AND ?
            """
            params = (room_id, time_from, time_to)

        with self.open_cursor() as cursor:
            cursor.execute(query, params)
            results = cursor.fetchall()

        return [self._tuple_to_booking(result) for result in results]

    def get_all_by_user_id(self, user_id: str) -> List[Booking]:
        """"""
        query = """
        SELECT * FROM bookings
        INNER JOIN users ON users.id = bookings.user_id
        INNER JOIN rooms ON rooms.id = bookings.room_id
        WHERE user_id = ?
        """

        with self.open_cursor() as cursor:
            cursor.execute(query, (user_id,))
            results = cursor.fetchall()

        return [self._tuple_to_booking(result) for result in results]

    def delete(self, booking: Booking) -> None:
        """
        """

        query = "DELETE FROM bookings WHERE id = ?"

        with self.open_cursor() as cursor:
            cursor.execute(query, (booking.id,))

    def delete_all_by_user_id(self, user_id: str) -> None:
        """"""
        query = "DELETE FROM bookings WHERE user_id = ?"
        with self.open_cursor() as cursor:
            cursor.execute(query, (user_id,))

    def _tuple_to_booking(self, data: Tuple) -> Booking:
        """ """

        booking_data = dict(zip(self.HEADERS, data[:6]))
        user_data = dict(zip(UserRepository.HEADERS, data[6:11]))
        room_data = dict(zip(RoomsRepository.HEADERS, data[11:]))

        time_from_timestamp = booking_data.get("time_from")
        time_to_timestamp = booking_data.get("time_to")

        booking_data["time_from"] = datetime.fromisoformat(time_from_timestamp)
        booking_data["time_to"] = datetime.fromisoformat(time_to_timestamp)

        return Booking(**booking_data, user=User(**user_data), room=Room(**room_data))
