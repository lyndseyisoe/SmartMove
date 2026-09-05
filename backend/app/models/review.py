from datetime import datetime

from app.extensions import db


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)

    # One review per booking.
    booking_id = db.Column(db.Integer, nullable=False, unique=True, index=True)

    client_id = db.Column(db.Integer, nullable=False, index=True)
    mover_id = db.Column(db.Integer, nullable=False, index=True)

    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    __table_args__ = (
        db.CheckConstraint("rating >= 1 AND rating <= 5", name="ck_reviews_rating_range"),
    )

    def __repr__(self):
        return f"<Review {self.id}: booking {self.booking_id} rating {self.rating}>"
