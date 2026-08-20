from app.extensions import db
from inventory.model import RoomTemplate, CatalogItem

TEMPLATES = {
    "Bedsitter": [
        ("Bed (single)", "furniture", 30, 1.5),
        ("Wardrobe (small)", "furniture", 40, 1.2),
        ("Fridge (small)", "appliance", 35, 0.6),
        ("Cooker (2-burner)", "appliance", 15, 0.3),
    ],
    "Studio": [
        ("Bed (double)", "furniture", 45, 2.0),
        ("Wardrobe (medium)", "furniture", 55, 1.8),
        ("Sofa (2-seater)", "furniture", 40, 2.2),
        ("Fridge (medium)", "appliance", 50, 0.9),
        ("Cooker (4-burner)", "appliance", 25, 0.5),
    ],
    "1BR": [
        ("Bed (double)", "furniture", 45, 2.0),
        ("Wardrobe (large)", "furniture", 70, 2.5),
        ("Sofa (3-seater)", "furniture", 55, 3.0),
        ("Dining table + 4 chairs", "furniture", 60, 3.5),
        ("Fridge (large)", "appliance", 65, 1.2),
        ("TV + stand", "electronics", 20, 0.4),
    ],
    "2BR": [
        ("Bed (double) x2", "furniture", 90, 4.0),
        ("Wardrobe (large) x2", "furniture", 140, 5.0),
        ("Sofa set (5-seater)", "furniture", 80, 4.5),
        ("Dining table + 6 chairs", "furniture", 75, 4.0),
        ("Fridge (large)", "appliance", 65, 1.2),
        ("Washing machine", "appliance", 60, 0.8),
        ("TV + stand", "electronics", 20, 0.4),
    ],
}

def run():
    for template_name, items in TEMPLATES.items():
        template = RoomTemplate.query.filter_by(name=template_name).first()
        if not template:
            template = RoomTemplate(name=template_name)
            db.session.add(template)
            db.session.flush()

        for name, category, weight, volume in items:
            exists = CatalogItem.query.filter_by(template_id=template.id, name=name).first()
            if not exists:
                db.session.add(CatalogItem(
                    template_id=template.id, name=name, category=category,
                    default_weight_kg=weight, default_volume_m3=volume
                ))
    db.session.commit()
    print("Seeded room templates.")