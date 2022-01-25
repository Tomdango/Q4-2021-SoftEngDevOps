class HTTPStatus:
    OK = 200
    CREATED = 201
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    NOT_FOUND = 404


class Responses:

    LOGIN_SUCCESSFUL = (HTTPStatus.OK, "Login successful")
    REGISTERED_USER = (HTTPStatus.CREATED, "Registered new user")
    USERNAME_EXISTS = (HTTPStatus.BAD_REQUEST, "Username already exists")
    LOGIN_FAILED = (HTTPStatus.UNAUTHORIZED, "Login failed")
    UNAUTHORIZED = (HTTPStatus.UNAUTHORIZED, "Unauthorized")
    NOT_FOUND = (HTTPStatus.NOT_FOUND, "Not Found")


class Params:
    BEARER_TOKEN = {
        "name": "Authorization",
        "description": "Bearer Token",
        "_in": "header",
        "required": True
    }
