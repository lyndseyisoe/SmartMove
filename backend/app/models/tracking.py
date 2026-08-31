from datetime import datetime

from app.extensions import db


class TrackingItem(db.Model):
    __tablename__ = "tracking_items"

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, nullable=False, index=True)
    item_name = db.Column(db.String(160), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="packed")
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "booking_id": self.booking_id,
            "item_name": self.item_name,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
