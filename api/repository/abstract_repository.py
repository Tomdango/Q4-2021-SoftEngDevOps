import sqlite3
from abc import ABCMeta, abstractmethod
from contextlib import contextmanager
from sqlite3 import Connection
from sys import modules


class AbstractRepository(metaclass=ABCMeta):

    conn: Connection

    DB_NAME = "roombooking.db"

    def __init__(self):
        """"""
        db_name = "file::memory:" if "pytest" in modules else self.DB_NAME
        self.conn = sqlite3.connect(db_name, check_same_thread=False)
        self.create_table()

    @abstractmethod
    def create_table(self) -> None:
        """"""
        raise NotImplementedError()

    @contextmanager
    def open_cursor(self):
        """"""
        cursor = self.conn.cursor()
        try:
            yield cursor
        finally:
            cursor.close()
            self.conn.commit()
