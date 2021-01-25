from api.core import docs
from api.core.context import context
from api.core.jwt import create_token, ensure_user_logged_in
from api.models.user_model import User
from flask import request
from flask_restx import Namespace, Resource, fields

ns = Namespace("auth", description="Auth Operations")


@ns.route("/register")
class Register(Resource):
    request_model = ns.model("RegisterRequestBody", {
        "name": fields.String(required=True, description="The name of the user"),
        "username": fields.String(required=True, description="The username of the user"),
        "password": fields.String(required=True, description="The password of the user"),
        "role": fields.String(required=True, description="The role of the user")
    }, strict=True)

    @ns.expect(request_model, validate=True)
    @ns.response(*docs.Responses.REGISTERED_USER)
    @ns.response(*docs.Responses.UNAUTHORIZED)
    @ns.response(*docs.Responses.USERNAME_EXISTS)
    @ns.param(**docs.Params.BEARER_TOKEN)
    def post(self):
        """Registers a new user into the database"""

        data = dict(request.json)

        name = data.get("name")
        username = data.get("username")
        password = data.get("password")
        role = data.get("role")

        # Check for an existing user with that username
        existing_user = context.db.users.get_by_username(username)

        if existing_user is not None:
            return {
                "message": "That username has already been taken"
            }, 400

        user = User(
            id=None,
            name=name,
            username=username,
            password=User.hash_password(password),
            role=role
        )

        context.db.users.add(user)

        return {
            "message": "Successfully registered new user",
            "user_id": user.id
        }, 201


@ns.route("/login")
class Login(Resource):

    request_model = ns.model("LoginRequestBody", {
        "username": fields.String(required=True, description="The user's username"),
        "password": fields.String(required=True, description="The user's password")
    }, strict=True)

    @ns.response(*docs.Responses.LOGIN_SUCCESSFUL)
    @ns.response(*docs.Responses.LOGIN_FAILED)
    @ns.expect(request_model, validate=True)
    def post(self):
        """Logs in a user, returning an authentication token"""
        data = dict(request.json)

        username = data.get("username")
        password = data.get("password")

        user = context.db.users.get_by_username(username)
        if user is None:
            return {"message": "Login Failed"}, 401

        if not user.verify_password(password):
            return {"message": "Login Failed"}, 401

        return {"message": "Logged In", "user": user.to_json(), "token": create_token(user)}


@ns.route("/refresh")
class Refresh(Resource):
    @ns.param(**docs.Params.BEARER_TOKEN)
    @ensure_user_logged_in(pass_token=True)
    def get(self, token: dict):
        """Returns the user details for a session"""

        user_id = token.get("user", {}).get("id")
        if user_id is None:
            return {"message": "Invalid Token"}, 400

        user = context.db.users.get_by_id(user_id)
        return user.to_json()


@ns.route("/users/<string:user_id>")
class UserResource(Resource):
    @ns.param(**docs.Params.BEARER_TOKEN)
    @ensure_user_logged_in(pass_token=True)
    def delete(self, user_id: str, token: dict):
        """"""
        logged_in_user = token.get("user", {})

        if logged_in_user.get("id") != user_id and logged_in_user.get("role") != "admin":
            return {
                "message": "You are not authorized to perform this action"
            }, 401

        context.db.bookings.delete_all_by_user_id(user_id)
        context.db.users.delete_by_id(user_id)

        return {"message": "Deleted User"}, 200
