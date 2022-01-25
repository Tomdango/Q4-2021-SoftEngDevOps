from unittest import TestCase

from api.models.user_model import User
from api.repository.user_repository import UserRepository


class TestAbstractRepository(TestCase):

    def setUp(self) -> None:
        self.repository = UserRepository()

    def test_add_inserts_user(self):
        """
        Test that create_table is called and raises a NotImplementedError
        """
        user = User(
            id=None,
            name="Test User 1",
            username="testuser1",
            password="password",
            role="admin"
        )

        success = self.repository.add(user)

        self.assertTrue(success)
        self.assertIsInstance(user.id, int)
