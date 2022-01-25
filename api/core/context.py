from api.repository import BookingRepository, RoomsRepository
from api.repository.user_repository import UserRepository


class DatabaseContext:
    rooms = RoomsRepository()
    bookings = BookingRepository()
    users = UserRepository()

class ApplicationContext:
    db = DatabaseContext()

context = ApplicationContext()
