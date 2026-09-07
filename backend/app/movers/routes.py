from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import or_

from app.extensions import db
from app.users.model import User


movers_bp = Blueprint("movers", __name__, url_prefix="/movers")


def profile_to_dict(mover):
    complete = bool(
        mover.company_name and mover.service_area and mover.pricing_type and
        ((mover.pricing_type == "hourly" and mover.price_per_hour is not None) or
         (mover.pricing_type == "distance" and mover.price_per_distance is not None))
    )
    return {
        "id": mover.id,
        "name": mover.name,
        "role": mover.role,
        "company_name": mover.company_name,
        "phone": mover.phone,
        "bio": mover.bio,
        "service_area": mover.service_area,
        "pricing_type": mover.pricing_type,
        "price_per_hour": float(mover.price_per_hour) if mover.price_per_hour is not None else None,
        "price_per_distance": float(mover.price_per_distance) if mover.price_per_distance is not None else None,
        "profile_complete": complete,
    }


@movers_bp.get("/")
@jwt_required()
def list_movers():
    """Return real mover accounts available to clients for booking."""
    search = request.args.get("search", "").strip().lower()
    query = User.query.filter(
        User.role == "mover",
        User.company_name.isnot(None),
        User.service_area.isnot(None),
        User.pricing_type.isnot(None),
    ).order_by(User.name.asc())
    if search:
        query = query.filter(or_(
            User.name.ilike(f"%{search}%"),
            User.company_name.ilike(f"%{search}%"),
            User.service_area.ilike(f"%{search}%"),
        ))

    return jsonify([profile_to_dict(mover) for mover in query.all()]), 200


@movers_bp.get("/me")
@jwt_required()
def get_my_profile():
    mover = db.session.get(User, int(get_jwt_identity()))
    if mover is None or mover.role != "mover":
        return jsonify({"error": "Mover profile not found"}), 404
    return jsonify({"profile": profile_to_dict(mover)}), 200


@movers_bp.put("/me")
@jwt_required()
def update_my_profile():
    mover = db.session.get(User, int(get_jwt_identity()))
    if mover is None or mover.role != "mover":
        return jsonify({"error": "Only mover accounts can manage this profile"}), 403

    data = request.get_json() or {}
    required = ["company_name", "service_area", "pricing_type"]
    missing = [field for field in required if not str(data.get(field, "")).strip()]
    if missing:
        return jsonify({"error": "Missing required profile fields", "fields": missing}), 400

    pricing_type = data["pricing_type"]
    if pricing_type not in {"hourly", "distance"}:
        return jsonify({"error": "pricing_type must be hourly or distance"}), 400
    price_field = "price_per_hour" if pricing_type == "hourly" else "price_per_distance"
    try:
        price = float(data.get(price_field))
        if price <= 0:
            raise ValueError
    except (TypeError, ValueError):
        return jsonify({"error": f"{price_field} must be a positive number"}), 400

    mover.company_name = str(data["company_name"]).strip()
    mover.phone = str(data.get("phone", "")).strip() or None
    mover.bio = str(data.get("bio", "")).strip() or None
    mover.service_area = str(data["service_area"]).strip()
    mover.pricing_type = pricing_type
    mover.price_per_hour = price if pricing_type == "hourly" else None
    mover.price_per_distance = price if pricing_type == "distance" else None
    db.session.commit()
    return jsonify({"message": "Mover profile saved", "profile": profile_to_dict(mover)}), 200
