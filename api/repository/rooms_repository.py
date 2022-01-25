from typing import List, Optional, Tuple

from api.models import Room

from .abstract_repository import AbstractRepository


class RoomsRepository(AbstractRepository):

    HEADERS = ["id", "name", "description", "capacity", "location"]

    def create_table(self) -> None:
        """"""
        query = """
        CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(20),
            description VARCHAR(20),
            capacity INTEGER,
            location VARCHAR(20)
        )
        """

        with self.open_cursor() as cursor:
            cursor.execute(query)

    def get_by_id(self, room_id: str) -> Optional[Room]:
        """"""
        query = "SELECT * FROM rooms WHERE id = ?"

        with self.open_cursor() as cursor:
            cursor.execute(query, (room_id,))
            result = cursor.fetchone()

        return self._tuple_to_room(result) if result else None

    def add(self, room: Room):
        """Adds a room into the database"""

        query = """
        INSERT INTO rooms (name, description, capacity, location) VALUES (?, ?, ?, ?)
        """

        with self.open_cursor() as cursor:
            cursor.execute(query, (room.name, room.description,
                           room.capacity, room.location))
            room.id = cursor.lastrowid

    def all(self) -> List[Room]:
        """"""
        query = "SELECT * FROM rooms"

        with self.open_cursor() as cursor:
            cursor.execute(query)
            results = cursor.fetchall()

        return [self._tuple_to_room(result) for result in results]

    def _tuple_to_room(self, data: Tuple) -> Room:
        return Room(**dict(zip(self.HEADERS, data)))
