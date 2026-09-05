from datetime import datetime

from app.extensions import db


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)

    # The user this notification is for.
    user_id = db.Column(db.Integer, nullable=False, index=True)

    # A short machine-readable category, e.g. "booking_created",
    # "booking_status_changed", "mover_approved", "mover_rejected",
    # "new_review".
    type = db.Column(db.String(40), nullable=False)

    title = db.Column(db.String(150), nullable=False)
    body = db.Column(db.Text, nullable=True)

    # Optional link back to the booking this notification is about.
    booking_id = db.Column(db.Integer, nullable=True, index=True)

    read_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        index=True
    )

    def __repr__(self):
        return f"<Notification {self.id}: {self.type} -> user {self.user_id}>"
