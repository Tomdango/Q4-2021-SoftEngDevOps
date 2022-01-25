from flask_restx import Namespace, Resource

from api.core.context import context
from api.core.jwt import ensure_user_logged_in

ns = Namespace("bookings", description="Bookings Operations")


class Bookings(Resource):

    def get(self):
        """
        Returns a list of bookings
        """


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
