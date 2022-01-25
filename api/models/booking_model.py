from dataclasses import dataclass
from datetime import datetime


@dataclass
class Booking:
    id: int
    note: str
    room_id: int
    user_id: int
    time_from: datetime
    time_to: datetime

    @property
    def json(self) -> dict:
        return {
            "id": self.id,
            "note": self.note,
            "room_id": self.room_id,
            "user_id": self.user_id,
            "time_from": int(self.time_from.timestamp()),
            "time_to": int(self.time_to.timestamp())
        }
