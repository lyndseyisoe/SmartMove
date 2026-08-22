from extensions import db
from .models import CatalogItem, UserInventoryItem


def populate_inventory_from_template(user_id, template_id):
    catalog_items = CatalogItem.query.filter_by(template_id=template_id).all()
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