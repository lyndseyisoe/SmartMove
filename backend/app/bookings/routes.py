from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.maps.service import calculate_distance
from app.models.booking import Booking
from app.quotes.service import calculate_quote


bookings_bp = Blueprint(
    "bookings",
    __name__,
    url_prefix="/bookings"
)


def booking_to_dict(booking):
    """Convert a Booking model into a JSON-friendly dictionary."""
    return {
        "id": booking.id,
        "client_id": booking.client_id,
        "mover_id": booking.mover_id,
        "moving_date": booking.moving_date.isoformat(),
        "status": booking.status,
        "quoted_amount": float(booking.quoted_amount) if booking.quoted_amount is not None else None,
        "quote_distance_km": booking.quote_distance_km,
        "estimated_hours": booking.estimated_hours,
        "item_count": booking.item_count,
        "floor_number": booking.floor_number,
        "has_elevator": booking.has_elevator,
        "pickup_address": booking.pickup_address,
        "pickup_latitude": booking.pickup_latitude,
        "pickup_longitude": booking.pickup_longitude,
        "destination_address": booking.destination_address,
        "destination_latitude": booking.destination_latitude,
        "destination_longitude": booking.destination_longitude,
        "created_at": booking.created_at.isoformat(),
        "updated_at": booking.updated_at.isoformat(),
    }


@bookings_bp.post("/")
@jwt_required()
def create_booking():
    """
    Create a booking for the currently authenticated user.
    The client_id comes from the JWT token.
    """

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    required_fields = [
        "mover_id",
        "moving_date",
        "pickup_address",
        "destination_address",
    ]

    missing_fields = [
        field
        for field in required_fields
        if not data.get(field)
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

    client_id = int(get_jwt_identity())

    try:
        quote_inputs = {
            "distance_km": data["quote_distance_km"],
            "estimated_hours": data["estimated_hours"],
            "item_count": data.get("item_count", 0),
            "floor_number": data.get("floor_number", 0),
            "has_elevator": data.get("has_elevator", True),
        }
        quote = calculate_quote(**quote_inputs)
    except (KeyError, ValueError) as error:
        return jsonify({"error": f"A valid quote is required before booking: {error}"}), 400

    booking = Booking(
        client_id=client_id,
        mover_id=data["mover_id"],
        moving_date=moving_date,
        status="pending",
        quoted_amount=quote["total_estimate"],
        quote_distance_km=quote_inputs["distance_km"],
        estimated_hours=quote_inputs["estimated_hours"],
        item_count=quote_inputs["item_count"],
        floor_number=quote_inputs["floor_number"],
        has_elevator=quote_inputs["has_elevator"],
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
        "booking": booking_to_dict(booking)
    }), 201


@bookings_bp.get("/")
@jwt_required()
def get_bookings():
    """
    Return only bookings belonging to the authenticated user.
    """

    client_id = int(get_jwt_identity())

    bookings = (
        Booking.query
        .filter_by(client_id=client_id)
        .order_by(Booking.created_at.desc())
        .all()
    )

    return jsonify([
        booking_to_dict(booking)
        for booking in bookings
    ]), 200


@bookings_bp.get("/<int:booking_id>")
@jwt_required()
def get_booking(booking_id):
    """
    Get one booking belonging to the authenticated user.
    """

    client_id = int(get_jwt_identity())

    booking = (
        Booking.query
        .filter_by(
            id=booking_id,
            client_id=client_id
        )
        .first()
    )

    if booking is None:
        return jsonify({
            "error": "Booking not found"
        }), 404

    return jsonify({
        "booking": booking_to_dict(booking)
    }), 200


@bookings_bp.patch("/<int:booking_id>")
@jwt_required()
def update_booking(booking_id):
    """
    Update the moving date or status of a user's booking.
    """

    client_id = int(get_jwt_identity())

    booking = (
        Booking.query
        .filter_by(
            id=booking_id,
            client_id=client_id
        )
        .first()
    )

    if booking is None:
        return jsonify({
            "error": "Booking not found"
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

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
        "booking": booking_to_dict(booking)
    }), 200


@bookings_bp.get("/<int:booking_id>/distance")
@jwt_required()
def get_booking_distance(booking_id):
    """
    Calculate the distance between the pickup and destination
    of a booking belonging to the authenticated user.
    """

    client_id = int(get_jwt_identity())

    booking = (
        Booking.query
        .filter_by(
            id=booking_id,
            client_id=client_id
        )
        .first()
    )

    if booking is None:
        return jsonify({
            "error": "Booking not found"
        }), 404

    try:
        distance_km = calculate_distance(
            booking.pickup_latitude,
            booking.pickup_longitude,
            booking.destination_latitude,
            booking.destination_longitude,
        )
    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400

    return jsonify({
        "booking_id": booking.id,
        "pickup_address": booking.pickup_address,
        "destination_address": booking.destination_address,
        "distance_km": distance_km,
    }), 200
