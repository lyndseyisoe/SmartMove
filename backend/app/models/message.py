from datetime import datetime

from app.extensions import db


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, nullable=False, index=True)
    sender_id = db.Column(db.Integer, nullable=False, index=True)
    recipient_id = db.Column(db.Integer, nullable=False, index=True)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    read_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f"<Message {self.id}>"
