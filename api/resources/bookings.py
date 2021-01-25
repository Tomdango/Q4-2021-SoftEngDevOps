from api.core.context import context
from api.core.jwt import ensure_user_logged_in
from flask_restx import Namespace, Resource

ns = Namespace("bookings", description="Bookings Operations")


@ns.route("/current-user")
class GetBookingsByUser(Resource):
    """ """

    @ensure_user_logged_in(pass_token=True)
    def get(self, token: dict):
        """Returns all bookings created by the current user"""

        user_id = token.get("user", {}).get("id")
        if user_id is None:
            return {"message": "Invalid Token"}, 400

        bookings = context.db.bookings.get_all_by_user_id(user_id)
        return [booking.json for booking in bookings]


@ns.route("/<string:booking_id>")
class SingleBooking(Resource):
    """"""

    @ensure_user_logged_in()
    def get(self, booking_id: str):
        """"""
        booking = context.db.bookings.get_by_id(booking_id)

        if not booking:
            return {"message": "Not Found"}, 404

        return booking.json

    @ensure_user_logged_in(pass_token=True)
    def delete(self, booking_id: str, token: dict):
        """"""
        logged_in_user = token.get("user", {})

        booking = context.db.bookings.get_by_id(booking_id)

        if not booking:
            return {"message": "Not Found"}, 404

        if booking.user_id != logged_in_user.get("id") and logged_in_user.get("role") != "admin":
            return {"message": "You are not authorized to perform this action"}, 401

        context.db.bookings.delete(booking)
        return {"message": "Deleted Booking"}
