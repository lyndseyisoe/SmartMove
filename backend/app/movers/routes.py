from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.movers.model import Mover
from app.users.model import User


movers_bp = Blueprint(
    "movers",
    __name__,
    url_prefix="/movers"
)


def mover_to_dict(mover):
    """Convert a Mover model into a JSON-friendly dictionary."""
    return {
        "id": mover.id,
        "user_id": mover.user_id,
        "company_name": mover.company_name,
        "description": mover.description,
        "phone": mover.phone,
        "service_area": mover.service_area,
        "vehicle_type": mover.vehicle_type,
        "vehicle_capacity": mover.vehicle_capacity,
        "price_per_km": mover.price_per_km,
        "is_available": mover.is_available,
        "created_at": mover.created_at.isoformat(),
        "updated_at": mover.updated_at.isoformat(),
    }


def get_current_user():
    """Return the currently authenticated User."""
    user_id = get_jwt_identity()
    return db.session.get(User, int(user_id))


def require_mover():
    """Return the authenticated user if they have the mover role."""
    user = get_current_user()

    if user is None:
        return None, (
            jsonify({"error": "User not found"}),
            404
        )

    if user.role != "mover":
        return None, (
            jsonify({"error": "Mover access required"}),
            403
        )

    return user, None


@movers_bp.post("/")
@jwt_required()
def create_mover():
    """
    Create a mover profile for the authenticated mover user.
    """

    user, error = require_mover()

    if error:
        return error

    existing_mover = Mover.query.filter_by(
        user_id=user.id
    ).first()

    if existing_mover:
        return jsonify({
            "error": "Mover profile already exists"
        }), 409

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    required_fields = [
        "company_name",
        "phone",
        "service_area",
        "vehicle_type",
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

    mover = Mover(
        user_id=user.id,
        company_name=data["company_name"].strip(),
        description=data.get("description"),
        phone=data["phone"].strip(),
        service_area=data["service_area"].strip(),
        vehicle_type=data["vehicle_type"].strip(),
        vehicle_capacity=data.get("vehicle_capacity"),
        price_per_km=data.get("price_per_km"),
        is_available=data.get("is_available", True),
    )

    db.session.add(mover)
    db.session.commit()

    return jsonify({
        "message": "Mover profile created successfully",
        "mover": mover_to_dict(mover)
    }), 201


@movers_bp.get("/")
@jwt_required()
def get_movers():
    """
    Return movers that are available.
    """

    movers = (
        Mover.query
        .filter_by(is_available=True)
        .order_by(Mover.company_name.asc())
        .all()
    )

    return jsonify([
        mover_to_dict(mover)
        for mover in movers
    ]), 200


@movers_bp.get("/<int:mover_id>")
@jwt_required()
def get_mover(mover_id):
    """
    Get a single mover profile.
    """

    mover = db.session.get(Mover, mover_id)

    if mover is None:
        return jsonify({
            "error": "Mover not found"
        }), 404

    return jsonify({
        "mover": mover_to_dict(mover)
    }), 200


@movers_bp.patch("/<int:mover_id>")
@jwt_required()
def update_mover(mover_id):
    """
    Update a mover's profile.
    Only the mover who owns the profile can update it.
    """

    user, error = require_mover()

    if error:
        return error

    mover = db.session.get(Mover, mover_id)

    if mover is None:
        return jsonify({
            "error": "Mover not found"
        }), 404

    if mover.user_id != user.id:
        return jsonify({
            "error": "You can only update your own mover profile"
        }), 403

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    allowed_fields = {
        "company_name",
        "description",
        "phone",
        "service_area",
        "vehicle_type",
        "vehicle_capacity",
        "price_per_km",
        "is_available",
    }

    for field in allowed_fields:
        if field in data:
            setattr(mover, field, data[field])

    db.session.commit()

    return jsonify({
        "message": "Mover profile updated successfully",
        "mover": mover_to_dict(mover)
    }), 200


@movers_bp.patch("/<int:mover_id>/availability")
@jwt_required()
def update_availability(mover_id):
    """
    Update the availability of a mover.
    """

    user, error = require_mover()

    if error:
        return error

    mover = db.session.get(Mover, mover_id)

    if mover is None:
        return jsonify({
            "error": "Mover not found"
        }), 404

    if mover.user_id != user.id:
        return jsonify({
            "error": "You can only update your own availability"
        }), 403

    data = request.get_json()

    if not data or "is_available" not in data:
        return jsonify({
            "error": "is_available is required"
        }), 400

    if not isinstance(data["is_available"], bool):
        return jsonify({
            "error": "is_available must be a boolean"
        }), 400

    mover.is_available = data["is_available"]

    db.session.commit()

    return jsonify({
        "message": "Mover availability updated successfully",
        "mover": mover_to_dict(mover)
    }), 200