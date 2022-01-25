from dataclasses import dataclass

from argon2 import PasswordHasher
from argon2.exceptions import Argon2Error


@dataclass
class User:
    """User Model"""

    id: int
    name: str
    username: str
    password: str
    role: str

    @classmethod
    def hash_password(cls, password: str) -> str:
        """
        """
        return PasswordHasher().hash(password)

    def verify_password(self, raw_password: str) -> bool:
        """"""
        try:
            return PasswordHasher().verify(self.password, raw_password)
        except Argon2Error:
            return False

    def to_json(self, sensitive: bool = False) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "username": self.username,
            "password": self.password if sensitive else None,
            "role": self.role
        }
