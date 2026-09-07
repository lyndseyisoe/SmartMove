from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.inventory.services import (
    create_inventory_item,
    delete_inventory_item,
    get_inventory_item,
    get_inventory_items,
    get_inventory_summary,
    update_inventory_item,
)


inventory_bp = Blueprint(
    "inventory",
    __name__,
    url_prefix="/inventory"
)


def serialize_item(item):
    """Convert an InventoryItem model into a JSON-safe dictionary."""

    return {
        "id": item.id,
        "user_id": item.user_id,
        "name": item.name,
        "category": item.category,
        "room": item.room,
        "quantity": item.quantity,
        "weight_kg": item.weight_kg,
        "volume_m3": item.volume_m3,
        "notes": item.notes,
        "created_at": item.created_at.isoformat(),
        "updated_at": item.updated_at.isoformat(),
    }


@inventory_bp.post("/")
@jwt_required()
def create_item():
    """Create an inventory item for the authenticated user."""

    data = request.get_json()

    if data is None:
        return jsonify({
            "error": "Request body is required"
        }), 400

    try:
        user_id = int(get_jwt_identity())
        item = create_inventory_item(user_id, data)

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400

    return jsonify({
        "message": "Inventory item created successfully",
        "item": serialize_item(item),
    }), 201


@inventory_bp.get("/")
@jwt_required()
def list_items():
    """Return all inventory items belonging to the authenticated user."""

    user_id = int(get_jwt_identity())
    items = get_inventory_items(user_id)

    return jsonify({
        "items": [serialize_item(item) for item in items],
        "count": len(items),
    }), 200


@inventory_bp.get("/summary")
@jwt_required()
def inventory_summary():
    """Return an inventory summary for the authenticated user."""

    user_id = int(get_jwt_identity())
    summary = get_inventory_summary(user_id)

    return jsonify({
        "summary": summary
    }), 200


@inventory_bp.get("/<int:item_id>")
@jwt_required()
def get_item(item_id):
    """Return one inventory item belonging to the authenticated user."""

    user_id = int(get_jwt_identity())
    item = get_inventory_item(user_id, item_id)

    if item is None:
        return jsonify({
            "error": "Inventory item not found"
        }), 404

    return jsonify({
        "item": serialize_item(item)
    }), 200


@inventory_bp.patch("/<int:item_id>")
@jwt_required()
def update_item(item_id):
    """Update an inventory item belonging to the authenticated user."""

    data = request.get_json()

    if data is None:
        return jsonify({
            "error": "Request body is required"
        }), 400

    try:
        user_id = int(get_jwt_identity())
        item = update_inventory_item(user_id, item_id, data)

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400

    if item is None:
        return jsonify({
            "error": "Inventory item not found"
        }), 404

    return jsonify({
        "message": "Inventory item updated successfully",
        "item": serialize_item(item),
    }), 200


@inventory_bp.delete("/<int:item_id>")
@jwt_required()
def delete_item(item_id):
    """Delete an inventory item belonging to the authenticated user."""

    user_id = int(get_jwt_identity())
    item = delete_inventory_item(user_id, item_id)

    if item is None:
        return jsonify({
            "error": "Inventory item not found"
        }), 404

    return jsonify({
        "message": "Inventory item deleted successfully"
    }), 200
