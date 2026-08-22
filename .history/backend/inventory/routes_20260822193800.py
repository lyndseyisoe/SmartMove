from flask import request, jsonify
from extensions import db
from . import inventory_bp
from .models import RoomTemplate, CatalogItem, UserInventoryItem
from .schemas import catalog_item_to_dict, inventory_item_to_dict
from . import services


@inventory_bp.route("/templates", methods=["GET"])
def get_templates():
    templates = RoomTemplate.query.all()
    return jsonify([{"id": t.id, "name": t.name} for t in templates]), 200


@inventory_bp.route("/templates/<template_id>/items", methods=["GET"])
def get_template_items(template_id):
    items = CatalogItem.query.filter_by(template_id=template_id).all()
    if not items:
        return jsonify({"error": "Template not found or has no items"}), 404
    return jsonify([catalog_item_to_dict(i) for i in items]), 200


@inventory_bp.route("/select-template", methods=["POST"])
def select_template():
    data = request.get_json() or {}
    user_id = data.get("user_id")          # will come from auth token later (Day 9)
    template_id = data.get("template_id")

    if not user_id or not template_id:
        return jsonify({"error": "user_id and template_id are required"}), 400

    created = services.populate_inventory_from_template(user_id, template_id)
    return jsonify([inventory_item_to_dict(i) for i in created]), 201


@inventory_bp.route("/summary", methods=["GET"])
def get_inventory():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    items = UserInventoryItem.query.filter_by(user_id=user_id).all()
    return jsonify([inventory_item_to_dict(i) for i in items]), 200


@inventory_bp.route("/items/check", methods=["POST"])
def check_item():
    data = request.get_json() or {}
    item = UserInventoryItem.query.get(data.get("item_id"))
    if not item:
        return jsonify({"error": "Item not found"}), 404
    item.checked = data.get("checked", not item.checked)
    db.session.commit()
    return jsonify(inventory_item_to_dict(item)), 200


@inventory_bp.route("/items/custom", methods=["POST"])
def add_custom_item():
    data = request.get_json() or {}
    item, error = services.add_custom_item(data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(inventory_item_to_dict(item)), 201


@inventory_bp.route("/items/<item_id>", methods=["DELETE"])
def delete_item(item_id):
    item = UserInventoryItem.query.get(item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200

@inventory_bp.route("/summary", methods=["GET"])
def inventory_summary():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    return jsonify(services.get_inventory_summary(user_id)), 200