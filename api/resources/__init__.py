from flask_restx import Api

from .auth import ns as auth_ns
from .bookings import ns as bookings_ns
from .rooms import ns as rooms_ns

api = Api(
    title="Room Booking API",
    version="1.0",
    doc="/api",
    description="Simple Room Booking API",
    contact="Thomas Judd-Cooper",
    contact_email="me@tomjuddcooper.co.uk"
)

api.add_namespace(auth_ns, "/api/auth")
api.add_namespace(rooms_ns, "/api/rooms")
api.add_namespace(bookings_ns, "/api/bookings")
