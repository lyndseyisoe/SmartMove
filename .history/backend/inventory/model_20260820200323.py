from app.extensions import db
from datetime import datetime
import uuid


def gen_uuid():
    return str(uuid.uuid4())


class RoomTemplate(db.Model):
    __tablename__ = "room_templates"

    id = db.Column(db.String, primary_key=True, default=gen_uuid)
    name = db.Column(db.String(50), unique=True, nullable=False)  # Bedsitter, Studio, 1BR, 2BR

    catalog_items = db.relationship("CatalogItem", backref="template", lazy=True)


class CatalogItem(db.Model):
    __tablename__ = "catalog_items"

    id = db.Column(db.String, primary_key=True, default=gen_uuid)
    template_id = db.Column(db.String, db.ForeignKey("room_templates.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50))
    default_weight_kg = db.Column(db.Float, nullable=False, default=0)
    default_volume_m3 = db.Column(db.Float, nullable=False, default=0)


class UserInventoryItem(db.Model):
    __tablename__ = "user_inventory_items"

    id = db.Column(db.String, primary_key=True, default=gen_uuid)
    user_id = db.Column(db.String, nullable=False, index=True)  # FK to users table (Member 1's table)
    catalog_item_id = db.Column(db.String, db.ForeignKey("catalog_items.id"), nullable=True)
    custom_name = db.Column(db.String(100), nullable=True)
    is_custom = db.Column(db.Boolean, default=False)
    quantity = db.Column(db.Integer, default=1)
    weight_kg = db.Column(db.Float, nullable=False, default=0)
    volume_m3 = db.Column(db.Float, nullable=False, default=0)
    checked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    catalog_item = db.relationship("CatalogItem")