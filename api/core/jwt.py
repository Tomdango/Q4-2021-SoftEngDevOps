from datetime import datetime, timedelta
from functools import wraps
from typing import Optional, Tuple

from api.core.context import context
from api.models import User
from flask import request

from jwt import decode, encode


def create_token(user: User) -> str:
    """
    """

    expiry = datetime.now() + timedelta(hours=8)

    payload = {"user": user.to_json(), "exp": expiry.timestamp()}
    return encode(payload, "secret", algorithm="HS256")


def verify_token(token: str) -> Tuple[bool, Optional[dict]]:
    try:
        decoded_jwt = decode(token, "secret", algorithms=["HS256"])
        return True, decoded_jwt
    except:  # pylint:disable=bare-except
        return False, None


def ensure_user_logged_in(pass_token: bool = False):
    """ """

    def decorator(func):
        """ """

        @wraps(func)
        def wrapped_f(*args, **kwargs):

            token = request.headers.get("Authorization")

            if not token:
                return {"message": "You are not authorized to perform this action."}, 401

            if "Bearer" in token:
                token = token.split("Bearer ").pop()

            is_valid, token = verify_token(token)
            if not is_valid:
                return {"message": "Invalid Authorization Token"}, 401

            user_id = token.get("user", {}).get("id")

            exists = context.db.users.exists_by_id(user_id)
            if not exists:
                return {"message": "You are not authorized to perform this action."}, 401

            if pass_token:
                return func(*args, **kwargs, token=token)

            return func(*args, **kwargs)

        return wrapped_f

    return decorator
