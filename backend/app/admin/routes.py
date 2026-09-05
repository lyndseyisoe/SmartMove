from flask import Blueprint, jsonify, request
from sqlalchemy import func

from app.extensions import db
from app.models.booking import Booking
from app.models.payment import Payment
from app.notifications.service import notify
from app.users.model import User
from app.utils import role_required


admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


def user_to_dict(user):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "status": user.status,
        "rejection_reason": user.rejection_reason,
        "company_name": user.company_name,
        "phone": user.phone,
        "service_area": user.service_area,
        "created_at": user.created_at.isoformat(),
    }


def booking_summary_to_dict(booking):
    return {
        "id": booking.id,
        "client_id": booking.client_id,
        "mover_id": booking.mover_id,
        "status": booking.status,
        "moving_date": booking.moving_date.isoformat(),
        "quoted_amount": float(booking.quoted_amount) if booking.quoted_amount is not None else None,
        "created_at": booking.created_at.isoformat(),
    }


@admin_bp.get("/users")
@role_required("admin")
def list_users(current_user):
    """List all users, optionally filtered by role and/or status."""
    role = request.args.get("role")
    status = request.args.get("status")

    query = User.query

    if role:
        query = query.filter(User.role == role)

    if status:
        query = query.filter(User.status == status)

    users = query.order_by(User.created_at.desc()).all()

    return jsonify([user_to_dict(user) for user in users]), 200


@admin_bp.get("/users/<int:user_id>")
@role_required("admin")
def get_user(current_user, user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"user": user_to_dict(user)}), 200


@admin_bp.get("/movers/pending")
@role_required("admin")
def pending_movers(current_user):
    """Shortcut for the admin approval queue."""
    movers = (
        User.query
        .filter_by(role="mover", status="pending")
        .order_by(User.created_at.asc())
        .all()
    )

    return jsonify([user_to_dict(mover) for mover in movers]), 200


@admin_bp.post("/movers/<int:mover_id>/approve")
@role_required("admin")
def approve_mover(current_user, mover_id):
    mover = db.session.get(User, mover_id)

    if mover is None or mover.role != "mover":
        return jsonify({"error": "Mover not found"}), 404

    mover.status = "approved"
    mover.rejection_reason = None

    notify(
        user_id=mover.id,
        type_="mover_approved",
        title="Your mover application was approved",
        body="You're now visible to clients and can start receiving bookings.",
    )

    db.session.commit()

    return jsonify({"message": "Mover approved", "user": user_to_dict(mover)}), 200


@admin_bp.post("/movers/<int:mover_id>/reject")
@role_required("admin")
def reject_mover(current_user, mover_id):
    mover = db.session.get(User, mover_id)

    if mover is None or mover.role != "mover":
        return jsonify({"error": "Mover not found"}), 404

    data = request.get_json() or {}
    reason = str(data.get("reason", "")).strip() or None

    mover.status = "rejected"
    mover.rejection_reason = reason

    notify(
        user_id=mover.id,
        type_="mover_rejected",
        title="Your mover application was not approved",
        body=reason or "Contact support for more information.",
    )

    db.session.commit()

    return jsonify({"message": "Mover rejected", "user": user_to_dict(mover)}), 200


@admin_bp.get("/bookings")
@role_required("admin")
def list_bookings(current_user):
    """A simple bookings report, optionally filtered by status."""
    status = request.args.get("status")

    query = Booking.query

    if status:
        query = query.filter(Booking.status == status)

    bookings = query.order_by(Booking.created_at.desc()).limit(200).all()

    return jsonify([booking_summary_to_dict(booking) for booking in bookings]), 200


@admin_bp.get("/stats")
@role_required("admin")
def stats(current_user):
    """Platform-level counts for an admin dashboard."""
    users_by_role = dict(
        db.session.query(User.role, func.count(User.id)).group_by(User.role).all()
    )
    bookings_by_status = dict(
        db.session.query(Booking.status, func.count(Booking.id)).group_by(Booking.status).all()
    )
    pending_mover_approvals = User.query.filter_by(role="mover", status="pending").count()
    total_paid_out = db.session.query(
        func.coalesce(func.sum(Payment.amount), 0)
    ).filter(Payment.status == "paid").scalar()

    return jsonify({
        "users_by_role": users_by_role,
        "bookings_by_status": bookings_by_status,
        "pending_mover_approvals": pending_mover_approvals,
        "total_paid_out": float(total_paid_out or 0),
    }), 200
