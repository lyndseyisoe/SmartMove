from .model import CatalogItem, UserInventoryItem

from app.extensions import db


def populate_inventory_from_template(user_id, template_id):
    catalog_items = CatalogItem.query.filter_by(template_id=template_id).all()
    if not catalog_items:
        return None

    created = []
    for ci in catalog_items:
        entry = UserInventoryItem(
            user_id=user_id,
            catalog_item_id=ci.id,
            is_custom=False,
            quantity=1,
            weight_kg=ci.default_weight_kg,
            volume_m3=ci.default_volume_m3,
            checked=True,
        )
        db.session.add(entry)
        created.append(entry)
    db.session.commit()
    return created


def add_custom_item(data):
    user_id = data.get("user_id")
    name = str(data.get("name", "")).strip()
    if not user_id or not name:
        return None, "user_id and name are required"

    quantity = data.get("quantity", 1)
    weight_kg = data.get("weight_kg", 0)
    volume_m3 = data.get("volume_m3", 0)
    try:
        quantity = int(quantity)
        weight_kg = float(weight_kg)
        volume_m3 = float(volume_m3)
    except (TypeError, ValueError):
        return None, "quantity, weight_kg, and volume_m3 must be numbers"
    if quantity < 1 or weight_kg < 0 or volume_m3 < 0:
        return None, "quantity must be at least 1 and weight/volume cannot be negative"

    item = UserInventoryItem(
        user_id=user_id,
        custom_name=name,
        is_custom=True,
        quantity=quantity,
        weight_kg=weight_kg,
        volume_m3=volume_m3,
    )
    db.session.add(item)
    db.session.commit()
    return item, None

def get_inventory_summary(user_id):
    items = UserInventoryItem.query.filter_by(user_id=user_id, checked=True).all()
    total_weight = sum(i.weight_kg * i.quantity for i in items)
    total_volume = sum(i.volume_m3 * i.quantity for i in items)
    return {
        "total_weight_kg": round(total_weight, 2),
        "total_volume_m3": round(total_volume, 2),
        "item_count": len(items),
    }