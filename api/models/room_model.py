from dataclasses import dataclass


@dataclass
class Room:
    id: int
    name: str
    description: str
    capacity: int
    location: str


    @property
    def json(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "capacity": self.capacity,
            "location": self.location
        }
