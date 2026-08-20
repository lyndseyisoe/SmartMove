from datetime import datetime

from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models.booking import Booking


bookings_bp = Blueprint("bookings", __name__, url_prefix="/bookings")


@bookings_bp.post("/")
def create_booking():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    required_fields = [
        "client_id",
        "mover_id",
        "moving_date",
        "pickup_address",
        "destination_address",
    ]

    missing_fields = [
        field for field in required_fields
        if field not in data
    ]

    if missing_fields:
        return jsonify({
            "error": "Missing required fields",
            "fields": missing_fields
        }), 400

    try:
        moving_date = datetime.strptime(
            data["moving_date"],
            "%Y-%m-%d"
        ).date()
    except (ValueError, TypeError):
        return jsonify({
            "error": "moving_date must use YYYY-MM-DD format"
        }), 400

    booking = Booking(
        client_id=data["client_id"],
        mover_id=data["mover_id"],
        moving_date=moving_date,
        status="pending",
        pickup_address=data["pickup_address"],
        pickup_latitude=data.get("pickup_latitude"),
        pickup_longitude=data.get("pickup_longitude"),
        destination_address=data["destination_address"],
        destination_latitude=data.get("destination_latitude"),
        destination_longitude=data.get("destination_longitude"),
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({
        "message": "Booking created successfully",
        "booking": {
            "id": booking.id,
            "client_id": booking.client_id,
            "mover_id": booking.mover_id,
            "moving_date": booking.moving_date.isoformat(),
            "status": booking.status,
            "pickup_address": booking.pickup_address,
            "pickup_latitude": booking.pickup_latitude,
            "pickup_longitude": booking.pickup_longitude,
            "destination_address": booking.destination_address,
            "destination_latitude": booking.destination_latitude,
            "destination_longitude": booking.destination_longitude,
            "created_at": booking.created_at.isoformat(),
            "updated_at": booking.updated_at.isoformat(),
        }
    }), 201


@bookings_bp.patch("/<int:booking_id>")
def update_booking(booking_id):
    booking = db.session.get(Booking, booking_id)

    if booking is None:
        return jsonify({"error": "Booking not found"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    allowed_statuses = {
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
    }

    if "status" in data:
        if data["status"] not in allowed_statuses:
            return jsonify({
                "error": "Invalid booking status",
                "allowed_statuses": sorted(allowed_statuses)
            }), 400

        booking.status = data["status"]

    if "moving_date" in data:
        try:
            booking.moving_date = datetime.strptime(
                data["moving_date"],
                "%Y-%m-%d"
            ).date()
        except (ValueError, TypeError):
            return jsonify({
                "error": "moving_date must use YYYY-MM-DD format"
            }), 400

    db.session.commit()

    return jsonify({
        "message": "Booking updated successfully",
        "booking": {
            "id": booking.id,
            "client_id": booking.client_id,
            "mover_id": booking.mover_id,
            "moving_date": booking.moving_date.isoformat(),
            "status": booking.status,
            "pickup_address": booking.pickup_address,
            "pickup_latitude": booking.pickup_latitude,
            "pickup_longitude": booking.pickup_longitude,
            "destination_address": booking.destination_address,
            "destination_latitude": booking.destination_latitude,
            "destination_longitude": booking.destination_longitude,
            "created_at": booking.created_at.isoformat(),
            "updated_at": booking.updated_at.isoformat(),
        }
    })

@bookings_bp.get("/")
def get_bookings():
    bookings = Booking.query.order_by(
        Booking.created_at.desc()
    ).all()

    return jsonify([
        {
            "id": booking.id,
            "client_id": booking.client_id,
            "mover_id": booking.mover_id,
            "moving_date": booking.moving_date.isoformat(),
            "status": booking.status,
            "pickup_address": booking.pickup_address,
            "pickup_latitude": booking.pickup_latitude,
            "pickup_longitude": booking.pickup_longitude,
            "destination_address": booking.destination_address,
            "destination_latitude": booking.destination_latitude,
            "destination_longitude": booking.destination_longitude,
            "created_at": booking.created_at.isoformat(),
            "updated_at": booking.updated_at.isoformat(),
        }
        for booking in bookings
    ])


@bookings_bp.get("/<int:booking_id>")
def get_booking(booking_id):
    booking = db.session.get(Booking, booking_id)

    if booking is None:
        return jsonify({"error": "Booking not found"}), 404

    return jsonify({
        "id": booking.id,
        "client_id": booking.client_id,
        "mover_id": booking.mover_id,
        "moving_date": booking.moving_date.isoformat(),
        "status": booking.status,
        "pickup_address": booking.pickup_address,
        "pickup_latitude": booking.pickup_latitude,
        "pickup_longitude": booking.pickup_longitude,
        "destination_address": booking.destination_address,
        "destination_latitude": booking.destination_latitude,
        "destination_longitude": booking.destination_longitude,
        "created_at": booking.created_at.isoformat(),
        "updated_at": booking.updated_at.isoformat(),
    })