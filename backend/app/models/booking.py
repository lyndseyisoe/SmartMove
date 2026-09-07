from datetime import datetime

from app.extensions import db


class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)

    # References to the client and mover.
    # Their actual models belong to other team members.
    client_id = db.Column(db.Integer, nullable=False)
    mover_id = db.Column(db.Integer, nullable=False)

    moving_date = db.Column(db.Date, nullable=False)

    status = db.Column(
        db.String(20),
        nullable=False,
        default="pending"
    )
    quoted_amount = db.Column(db.Numeric(10, 2), nullable=True)
    quote_distance_km = db.Column(db.Float, nullable=True)
    estimated_hours = db.Column(db.Float, nullable=True)
    item_count = db.Column(db.Integer, nullable=True)
    floor_number = db.Column(db.Integer, nullable=True)
    has_elevator = db.Column(db.Boolean, nullable=True)

    # Pickup location
    pickup_address = db.Column(db.String(255), nullable=False)
    pickup_latitude = db.Column(db.Float, nullable=True)
    pickup_longitude = db.Column(db.Float, nullable=True)

    # Destination location
    destination_address = db.Column(db.String(255), nullable=False)
    destination_latitude = db.Column(db.Float, nullable=True)
    destination_longitude = db.Column(db.Float, nullable=True)

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def __repr__(self):
        return f"<Booking {self.id}>"
