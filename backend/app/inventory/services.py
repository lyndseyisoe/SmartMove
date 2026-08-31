from app.extensions import db
from app.inventory.model import InventoryItem


def validate_inventory_data(data, partial=False):
    """Validate inventory item input."""

    if not isinstance(data, dict):
        raise ValueError("Request data must be a JSON object")

    required_fields = ["name", "category", "room"]

    if not partial:
        missing = [
            field for field in required_fields
            if field not in data
        ]

        if missing:
            raise ValueError(
                f"Missing required fields: {', '.join(missing)}"
            )

    if "name" in data:
        if not isinstance(data["name"], str) or not data["name"].strip():
            raise ValueError("name must be a non-empty string")

    if "category" in data:
        if not isinstance(data["category"], str) or not data["category"].strip():
            raise ValueError("category must be a non-empty string")

    if "room" in data:
        if not isinstance(data["room"], str) or not data["room"].strip():
            raise ValueError("room must be a non-empty string")

    if "quantity" in data:
        if not isinstance(data["quantity"], int) or isinstance(data["quantity"], bool):
            raise ValueError("quantity must be an integer")

        if data["quantity"] < 1:
            raise ValueError("quantity must be at least 1")

    if "weight_kg" in data and data["weight_kg"] is not None:
        if not isinstance(data["weight_kg"], (int, float)) or isinstance(data["weight_kg"], bool):
            raise ValueError("weight_kg must be a number")

        if data["weight_kg"] < 0:
            raise ValueError("weight_kg cannot be negative")

    if "volume_m3" in data and data["volume_m3"] is not None:
        if not isinstance(data["volume_m3"], (int, float)) or isinstance(data["volume_m3"], bool):
            raise ValueError("volume_m3 must be a number")

        if data["volume_m3"] < 0:
            raise ValueError("volume_m3 cannot be negative")

    if "notes" in data and data["notes"] is not None:
        if not isinstance(data["notes"], str):
            raise ValueError("notes must be a string")


def create_inventory_item(user_id, data):
    """Create and persist an inventory item."""

    validate_inventory_data(data)

    item = InventoryItem(
        user_id=user_id,
        name=data["name"].strip(),
        category=data["category"].strip(),
        room=data["room"].strip(),
        quantity=data.get("quantity", 1),
        weight_kg=data.get("weight_kg"),
        volume_m3=data.get("volume_m3"),
        notes=data.get("notes"),
    )

    db.session.add(item)
    db.session.commit()

    return item


def get_inventory_items(user_id):
    """Return all inventory items belonging to a user."""

    return (
        InventoryItem.query
        .filter_by(user_id=user_id)
        .order_by(InventoryItem.created_at.desc())
        .all()
    )


def get_inventory_item(user_id, item_id):
    """Return one inventory item belonging to a user."""

    return (
        InventoryItem.query
        .filter_by(
            id=item_id,
            user_id=user_id
        )
        .first()
    )


def update_inventory_item(user_id, item_id, data):
    """Update an inventory item belonging to a user."""

    validate_inventory_data(data, partial=True)

    item = get_inventory_item(user_id, item_id)

    if item is None:
        return None

    allowed_fields = {
        "name",
        "category",
        "room",
        "quantity",
        "weight_kg",
        "volume_m3",
        "notes",
    }

    for field, value in data.items():
        if field not in allowed_fields:
            continue

        if field in {"name", "category", "room"}:
            value = value.strip()

        setattr(item, field, value)

    db.session.commit()

    return item


def delete_inventory_item(user_id, item_id):
    """Delete an inventory item belonging to a user."""

    item = get_inventory_item(user_id, item_id)

    if item is None:
        return None

    db.session.delete(item)
    db.session.commit()

    return item


def get_inventory_summary(user_id):
    """Return a summary of a user's inventory."""

    items = get_inventory_items(user_id)

    total_items = sum(item.quantity for item in items)

    total_weight = sum(
        (item.weight_kg or 0) * item.quantity
        for item in items
    )

    total_volume = sum(
        (item.volume_m3 or 0) * item.quantity
        for item in items
    )

    categories = {}

    for item in items:
        categories[item.category] = (
            categories.get(item.category, 0) + item.quantity
        )

    return {
        "total_items": total_items,
        "total_weight_kg": round(total_weight, 2),
        "total_volume_m3": round(total_volume, 2),
        "categories": categories,
    }
