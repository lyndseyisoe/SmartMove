def catalog_item_to_dict(item):
    return {
        "id": item.id,
        "name": item.name,
        "category": item.category,
        "default_weight_kg": item.default_weight_kg,
        "default_volume_m3": item.default_volume_m3,
    }


def inventory_item_to_dict(item):
    return {
        "id": item.id,
        "name": item.custom_name if item.is_custom else item.catalog_item.name,
        "is_custom": item.is_custom,
        "quantity": item.quantity,
        "weight_kg": item.weight_kg,
        "volume_m3": item.volume_m3,
        "checked": item.checked,
    }