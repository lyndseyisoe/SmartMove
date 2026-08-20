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