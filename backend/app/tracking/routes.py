from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.models.tracking import TrackingItem


tracking_bp = Blueprint("tracking", __name__, url_prefix="/tracking")


@tracking_bp.get("/booking/<int:booking_id>")
@jwt_required()
def get_tracking_items(booking_id):
    user_id = int(get_jwt_identity())
    items = TrackingItem.query.filter_by(booking_id=booking_id).order_by(TrackingItem.created_at.asc()).all()
    return jsonify([item.to_dict() for item in items]), 200


@tracking_bp.post("/booking/<int:booking_id>")
@jwt_required()
def create_tracking_item(booking_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    item_name = str(data.get("item_name", "")).strip()
    if not item_name:
        return jsonify({"error": "item_name is required"}), 400

    item = TrackingItem(booking_id=booking_id, item_name=item_name, status=data.get("status", "packed"))
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201


@tracking_bp.patch("/<int:item_id>")
@jwt_required()
def update_tracking_item(item_id):
    user_id = int(get_jwt_identity())
    item = TrackingItem.query.filter_by(id=item_id).first()
    if item is None:
        return jsonify({"error": "Tracking item not found"}), 404

    data = request.get_json() or {}
    if "status" in data:
        item.status = data["status"]
    if "item_name" in data:
        item.item_name = str(data["item_name"]).strip()

    db.session.commit()
    return jsonify(item.to_dict()), 200


@tracking_bp.delete("/<int:item_id>")
@jwt_required()
def delete_tracking_item(item_id):
    user_id = int(get_jwt_identity())
    item = TrackingItem.query.filter_by(id=item_id).first()
    if item is None:
        return jsonify({"error": "Tracking item not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Tracking item deleted"}), 200
