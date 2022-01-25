from datetime import datetime

from api.core import docs
from api.core.context import context
from api.core.jwt import ensure_user_logged_in
from api.models import Room
from api.models.booking_model import Booking
from flask import request
from flask_restx import Namespace, Resource, fields

ns = Namespace("rooms", description="Rooms Operations")

room_model = ns.model("Room", {
    "id": fields.Integer(required=True, description="The ID of the room"),
    "name": fields.String(required=True, description="The name of the room"),
    "description": fields.String(required=False, description="A description of the room"),
    "capacity": fields.Integer(required=True, description="The capacity of the room"),
    "location": fields.String(required=True, description="The location of the room")
})


@ns.route("/")
class Rooms(Resource):
    """
    /rooms API Resource
    """

    @ensure_user_logged_in()
    @ns.param(**docs.Params.BEARER_TOKEN)
    @ns.response(*docs.Responses.UNAUTHORIZED)
    @ns.marshal_list_with(room_model)
    def get(self):
        """
        Returns a list of all rooms
        """
        return [room.json for room in context.db.rooms.all()]


@ns.route("/<string:room_id>")
class SingleRoom(Resource):
    """
    /rooms/{room_id} API Resource
    """

    @ensure_user_logged_in()
    @ns.marshal_with(room_model)
    @ns.response(*docs.Responses.NOT_FOUND)
    def get(self, room_id: str):
        """
        Returns a single room by its a unique id
        """
        room = context.db.rooms.get_by_id(room_id)
        if room is None:
            return {"message": "Not Found"}, 404

        return room.json


@ns.route("/create")
class CreateRoom(Resource):

    request_model = ns.model("CreateRoomRequestBody", {
        "name": fields.String(required=True, description="The name of the room"),
        "description": fields.String(description="A description of the room (optional)"),
        "capacity": fields.Integer(required=True, description="The capacity of the room"),
        "location": fields.String(required=True, description="The location of the room")
    })

    @ensure_user_logged_in()
    @ns.expect(request_model, validate=True)
    def post(self):
        """
        Creates a single room and returns the room ID
        """
        room = self._parse_post_body()
        context.db.rooms.add(room)

        return {
            "message": "Created Room",
            "room_id": room.id
        }

    @staticmethod
    def _parse_post_body() -> Room:
        """"""
        return Room(id=None, **request.json)


@ns.route("/<string:room_id>/bookings")
class GetBookingsByRoomID(Resource):
    """"""

    @ns.param("range", description="Query time range (unix timestamps, i.e. 1642935600-1642939200)")
    def get(self, room_id: str):
        """Returns the bookings for a room"""

        query_range = request.args.get("range")
        if query_range is not None:
            split_range = query_range.split("-")
            if len(split_range) != 2:
                return {"message": "Invalid Time Range"}, 400

            time_from, time_to = split_range

            bookings = context.db.bookings.get_all_by_time(
                datetime.fromtimestamp(int(time_from)),
                datetime.fromtimestamp(int(time_to)),
                room_id
            )

        else:
            bookings = context.db.bookings.get_all_by_room_id(room_id)

        return [booking.json for booking in bookings]


@ns.route("/<string:room_id>/book")
class BookRoom(Resource):

    request_model = ns.model("BookRoomRequestModel", {
        "note": fields.String(description="A note to accompany the booking"),
        "time_from": fields.Integer(required=True, description="The start time of the booking (unix timestamp)"),
        "time_to": fields.Integer(required=True, description="The end time of the booking (unix timestamp)")
    })

    @ensure_user_logged_in(pass_token=True)
    @ns.param(**docs.Params.BEARER_TOKEN)
    @ns.expect(request_model, validate=True)
    @ns.response(*docs.Responses.NOT_FOUND)
    def post(self, room_id: str, token: dict):
        """
        Books a room for a certain timeslot
        """

        body = dict(request.json)

        # Check the room exists
        room = context.db.rooms.get_by_id(room_id)
        if not room:
            return {
                "message": "Not Found"
            }, 404

        time_from = datetime.fromtimestamp(body.get("time_from"))
        time_to = datetime.fromtimestamp(body.get("time_to"))

        existing_bookings = context.db.bookings.get_all_by_time(
            time_from, time_to, room_id)
        if len(existing_bookings) > 0:
            return {
                "message": "This booking overlaps with an existing booking",
                "existing_bookings": [booking.json for booking in existing_bookings]
            }, 400



        # Add the booking
        booking = Booking(
            id=None,
            room_id=room_id,
            user_id=token.get("user", {}).get("id"),
            note=body.get("note"),
            time_from=datetime.fromtimestamp(body.get("time_from")),
            time_to=datetime.fromtimestamp(body.get("time_to"))
        )

        context.db.bookings.add(booking)
        return booking.json
