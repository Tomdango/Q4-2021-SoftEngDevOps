import sqlite3
from abc import ABCMeta, abstractmethod
from contextlib import contextmanager
from sqlite3 import Connection

from api import config


class AbstractRepository(metaclass=ABCMeta):

    conn: Connection

    def __init__(self):
        """"""
        self.conn = sqlite3.connect(config.DB_NAME, check_same_thread=False)
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
