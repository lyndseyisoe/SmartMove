from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.models.notification import Notification


notifications_bp = Blueprint(
    "notifications", __name__, url_prefix="/notifications"
)


def notification_to_dict(notification):
    return {
        "id": notification.id,
        "type": notification.type,
        "title": notification.title,
        "body": notification.body,
        "booking_id": notification.booking_id,
        "read_at": notification.read_at.isoformat() if notification.read_at else None,
        "created_at": notification.created_at.isoformat(),
    }


@notifications_bp.get("/")
@jwt_required()
def list_notifications():
    """List the authenticated user's notifications, newest first."""
    user_id = int(get_jwt_identity())

    try:
        limit = min(int(request.args.get("limit", 50)), 100)
    except (TypeError, ValueError):
        limit = 50

    query = Notification.query.filter_by(user_id=user_id)

    if request.args.get("unread") == "true":
        query = query.filter(Notification.read_at.is_(None))

    notifications = (
        query
        .order_by(Notification.created_at.desc())
        .limit(limit)
        .all()
    )

    unread_count = Notification.query.filter_by(
        user_id=user_id, read_at=None
    ).count()

    return jsonify({
        "notifications": [notification_to_dict(n) for n in notifications],
        "unread_count": unread_count,
    }), 200


@notifications_bp.get("/unread-count")
@jwt_required()
def unread_count():
    user_id = int(get_jwt_identity())

    count = Notification.query.filter_by(
        user_id=user_id, read_at=None
    ).count()

    return jsonify({"unread_count": count}), 200


@notifications_bp.patch("/<int:notification_id>/read")
@jwt_required()
def mark_read(notification_id):
    user_id = int(get_jwt_identity())

    notification = Notification.query.filter_by(
        id=notification_id, user_id=user_id
    ).first()

    if notification is None:
        return jsonify({"error": "Notification not found"}), 404

    if notification.read_at is None:
        notification.read_at = datetime.utcnow()
        db.session.commit()

    return jsonify({"notification": notification_to_dict(notification)}), 200


@notifications_bp.post("/read-all")
@jwt_required()
def mark_all_read():
    user_id = int(get_jwt_identity())

    Notification.query.filter_by(user_id=user_id, read_at=None).update(
        {"read_at": datetime.utcnow()}
    )
    db.session.commit()

    return jsonify({"message": "All notifications marked as read"}), 200
