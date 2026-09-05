from datetime import date

from app import create_app
from app.extensions import db
from app.users.model import User
from app.models.booking import Booking
from app.models.review import Review
from app.models.notification import Notification

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    client = User(
        name="Alice Wanjiku",
        email="alice@example.com",
        role="client",
        status="approved",
    )
    client.set_password("password123")

    mover = User(
        name="Bob Mwangi",
        email="bob@example.com",
        role="mover",
        status="approved",
        company_name="Bob's Moving Co.",
        phone="+254 712 345 678",
        bio="Experienced mover with 5+ years in Nairobi.",
        service_area="Nairobi, Kiambu",
        pricing_type="hourly",
        price_per_hour=1500,
        price_per_distance=200
    )
    mover.set_password("password123")

    # A second mover still waiting on admin approval, to exercise the
    # approval queue out of the box.
    pending_mover = User(
        name="Grace Njeri",
        email="grace@example.com",
        role="mover",
        status="pending",
        company_name="Grace Relocations",
        phone="+254 711 222 333",
        bio="New to the platform, awaiting approval.",
        service_area="Nairobi",
        pricing_type="distance",
        price_per_distance=250,
    )
    pending_mover.set_password("password123")

    admin = User(
        name="Carol Admin",
        email="carol@example.com",
        role="admin",
        status="approved",
    )
    admin.set_password("password123")

    db.session.add_all([client, mover, pending_mover, admin])
    db.session.commit()

    booking1 = Booking(
        client_id=client.id,
        mover_id=mover.id,
        moving_date=date(2026, 9, 15),
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
        moving_date=date(2026, 10, 2),
        status="pending",
        pickup_address="Karen, Nairobi",
        pickup_latitude=-1.3196,
        pickup_longitude=36.7264,
        destination_address="South B, Nairobi",
        destination_latitude=-1.3150,
        destination_longitude=36.8450,
    )

    booking3 = Booking(
        client_id=client.id,
        mover_id=mover.id,
        moving_date=date(2026, 7, 20),
        status="completed",
        pickup_address="Lavington, Nairobi",
        pickup_latitude=-1.2762,
        pickup_longitude=36.7686,
        destination_address="Runda, Nairobi",
        destination_latitude=-1.2183,
        destination_longitude=36.8172,
    )

    db.session.add_all([booking1, booking2, booking3])
    db.session.commit()

    review1 = Review(
        booking_id=booking3.id,
        client_id=client.id,
        mover_id=mover.id,
        rating=5,
        comment="Bob and his crew were fast, careful, and friendly. Highly recommend!",
    )
    db.session.add(review1)

    notification1 = Notification(
        user_id=mover.id,
        type="booking_created",
        title="New booking request",
        body=f"{client.name} requested a move on {booking2.moving_date}.",
        booking_id=booking2.id,
    )
    notification2 = Notification(
        user_id=client.id,
        type="booking_status_changed",
        title="Booking confirmed",
        body=f"Your move on {booking1.moving_date} is now confirmed.",
        booking_id=booking1.id,
    )
    db.session.add_all([notification1, notification2])
    db.session.commit()

    print("Seeded database with:")
    print(f"  Users: {User.query.count()} (including 1 mover pending approval)")
    print(f"  Bookings: {Booking.query.count()}")
    print(f"  Reviews: {Review.query.count()}")
    print(f"  Notifications: {Notification.query.count()}")
