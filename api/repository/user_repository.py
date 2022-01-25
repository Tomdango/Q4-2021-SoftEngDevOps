from typing import Literal, Optional

from api.models.user_model import User

from .abstract_repository import AbstractRepository


class UserRepository(AbstractRepository):

    HEADERS = ("id", "name", "username", "password", "role")

    def create_table(self) -> None:
        query = """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            username TEXT,
            password TEXT,
            role TEXT
        )"""

        with self.open_cursor() as cursor:
            cursor.execute(query)

    def add(self, user: User) -> Literal[True]:
        """"""

        query = """
        INSERT INTO users (
            name,
            username,
            password,
            role
        ) VALUES (?, ?, ?, ?)"""

        with self.open_cursor() as cursor:
            cursor.execute(query, (user.name, user.username,
                           user.password, user.role))
            user.id = cursor.lastrowid

        return True

    def get_by_username(self, username: str) -> Optional[User]:
        """
        Returns a user by their username, None if the user does not exist
        """

        query = "SELECT * FROM users WHERE username = ?"

        with self.open_cursor() as cursor:
            cursor.execute(query, (username,))
            result = cursor.fetchone()

        return self._tuple_to_user(result) if result else None

    def get_by_id(self, user_id: str) -> Optional[User]:
        """
        Returns a user by their user_id, None if the user does not exist
        """

        query = "SELECT * FROM users WHERE id = ?"

        with self.open_cursor() as cursor:
            cursor.execute(query, (user_id,))
            result = cursor.fetchone()

        return self._tuple_to_user(result) if result else None

    @classmethod
    def _tuple_to_user(cls, data: tuple) -> User:
        """Converts a returned tuple from the database to the user"""
        return User(**dict(zip(cls.HEADERS, data)))
