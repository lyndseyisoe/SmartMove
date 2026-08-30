from app import create_app
from app.extensions import db
from app.users.model import User
from app.models.booking import Booking

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    client = User(name="Alice Wanjiku", email="alice@example.com", role="client")
    client.set_password("password123")

    mover = User(name="Bob Mwangi", email="bob@example.com", role="mover")
    mover.set_password("password123")

    admin = User(name="Carol Admin", email="carol@example.com", role="admin")
    admin.set_password("password123")

    db.session.add_all([client, mover, admin])
    db.session.commit()

    booking1 = Booking(
        client_id=client.id,
        mover_id=mover.id,
        moving_date="2026-09-15",
        status="confirmed",
        pickup_address="Kilimani, Nairobi",
        pickup_latitude=-1.2921,
        pickup_longitude=36.8219,
        destination_address="Westlands, Nairobi",
        destination_latitude=-1.2634,
        destination_longitude=36.8056,
    )

    booking2 = Booking(
        client_id=client.id,
        mover_id=mover.id,
        moving_date="2026-10-02",
        status="pending",
        pickup_address="Karen, Nairobi",
        pickup_latitude=-1.3196,
        pickup_longitude=36.7264,
        destination_address="South B, Nairobi",
        destination_latitude=-1.3150,
        destination_longitude=36.8450,
    )

    db.session.add_all([booking1, booking2])
    db.session.commit()

    print("Seeded database with:")
    print(f"  Users: {User.query.count()}")
    print(f"  Bookings: {Booking.query.count()}")
