from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.models.booking import Booking
from app.models.message import Message
from app.users.model import User


messages_bp = Blueprint("messages", __name__, url_prefix="/messages")


def current_user():
    return db.session.get(User, int(get_jwt_identity()))


def accessible_booking(booking_id, user):
    if user.role == "mover":
        return Booking.query.filter_by(id=booking_id, mover_id=user.id).first()
    return Booking.query.filter_by(id=booking_id, client_id=user.id).first()


def message_to_dict(message):
    return {
        "id": message.id,
        "booking_id": message.booking_id,
        "sender_id": message.sender_id,
        "recipient_id": message.recipient_id,
        "body": message.body,
        "created_at": message.created_at.isoformat(),
        "read_at": message.read_at.isoformat() if message.read_at else None,
    }


@messages_bp.get("/conversations")
@jwt_required()
def conversations():
    user = current_user()
    if user is None:
        return jsonify({"error": "User not found"}), 404

    column = Booking.mover_id if user.role == "mover" else Booking.client_id
    bookings = Booking.query.filter(column == user.id).order_by(Booking.updated_at.desc()).all()
    result = []
    for booking in bookings:
        other_id = booking.client_id if user.role == "mover" else booking.mover_id
        other = db.session.get(User, other_id)
        last = (Message.query.filter_by(booking_id=booking.id)
                .order_by(Message.created_at.desc()).first())
        unread = Message.query.filter_by(booking_id=booking.id, recipient_id=user.id, read_at=None).count()
        result.append({
            "booking_id": booking.id,
            "other_user": {"id": other.id, "name": other.name, "role": other.role} if other else None,
            "booking": {"status": booking.status, "moving_date": booking.moving_date.isoformat(), "pickup_address": booking.pickup_address},
            "last_message": message_to_dict(last) if last else None,
            "unread_count": unread,
        })
    return jsonify(result), 200


@messages_bp.get("/<int:booking_id>")
@jwt_required()
def get_messages(booking_id):
    user = current_user()
    booking = accessible_booking(booking_id, user) if user else None
    if booking is None:
        return jsonify({"error": "Conversation not found"}), 404

    Message.query.filter_by(booking_id=booking.id, recipient_id=user.id, read_at=None).update({"read_at": datetime.utcnow()})
    db.session.commit()
    messages = Message.query.filter_by(booking_id=booking.id).order_by(Message.created_at.asc()).all()
    return jsonify([message_to_dict(message) for message in messages]), 200


@messages_bp.post("/<int:booking_id>")
@jwt_required()
def send_message(booking_id):
    user = current_user()
    booking = accessible_booking(booking_id, user) if user else None
    if booking is None:
        return jsonify({"error": "Conversation not found"}), 404
    data = request.get_json() or {}
    body = str(data.get("body", "")).strip()
    if not body:
        return jsonify({"error": "Message body is required"}), 400
    if len(body) > 2000:
        return jsonify({"error": "Message body must be 2000 characters or fewer"}), 400

    recipient_id = booking.client_id if user.role == "mover" else booking.mover_id
    recipient = db.session.get(User, recipient_id)
    if recipient is None:
        return jsonify({"error": "The other participant could not be found"}), 400
    message = Message(booking_id=booking.id, sender_id=user.id, recipient_id=recipient_id, body=body)
    db.session.add(message)
    booking.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"message": message_to_dict(message)}), 201
