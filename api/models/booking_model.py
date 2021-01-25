from dataclasses import dataclass
from datetime import datetime

from api.models.room_model import Room
from api.models.user_model import User


@dataclass
class Booking:
    id: int
    note: str
    room_id: int
    user_id: int
    time_from: datetime
    time_to: datetime
    user: User
    room: Room

    @property
    def json(self) -> dict:
        return {
            "id": self.id,
            "note": self.note,
            "room_id": self.room_id,
            "user_id": self.user_id,
            "time_from": int(self.time_from.timestamp()),
            "time_to": int(self.time_to.timestamp()),
            "user": self.user.to_json(),
            "room": self.room.json
        }
