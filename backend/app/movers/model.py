from datetime import datetime

from app.extensions import db


class Mover(db.Model):
    __tablename__ = "movers"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        nullable=False,
        unique=True,
        index=True
    )

    company_name = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    phone = db.Column(
        db.String(30),
        nullable=False
    )

    service_area = db.Column(
        db.String(150),
        nullable=False
    )

    vehicle_type = db.Column(
        db.String(100),
        nullable=False
    )

    vehicle_capacity = db.Column(
        db.Float,
        nullable=True
    )

    price_per_km = db.Column(
        db.Float,
        nullable=True
    )

    is_available = db.Column(
        db.Boolean,
        nullable=False,
        default=True
    )

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
        return f"<Mover {self.id}: {self.company_name}>"