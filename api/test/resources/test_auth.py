from unittest import TestCase

from api.app import Application
from api.core.context import context
from api.core.jwt import create_token
from api.models.user_model import User


class TestAuth(TestCase):
    """"""

    def setUp(self) -> None:
        self.app = Application()

        self.admin = User(
            id=None,
            name="Test Admin",
            username="admin",
            password="admin",
            role="admin"
        )
        self.assertTrue(context.db.users.add(self.admin))

    def test_register(self):
        """"""
        # Add an Admin user to our DB
        token = create_token(self.admin)

        request_data = {
            "name": "New Test User",
            "username": "NewUsername",
            "password": "NewPassword",
            "role": "user"
        }

        with self.app.app.test_client() as client:
            response = client.post(
                "/api/auth/register",
                json=request_data,
                headers={"Authorization": f"Bearer {token}"})

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json, {
            "message": "Successfully registered new user",
            "user_id": 2
        })

        # Check user is saved in DB
        created_user = context.db.users.get_by_id(2)

        self.assertIsNotNone(created_user)
        self.assertEqual(created_user.id, 2)
        self.assertEqual(created_user.name, "New Test User")
        self.assertEqual(created_user.username, "NewUsername")
        self.assertEqual(created_user.role, "user")

        # Check password has been hashed
        self.assertIn("argon2", created_user.password)
        self.assertTrue(created_user.verify_password("NewPassword"))
