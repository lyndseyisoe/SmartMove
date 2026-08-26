from flask import Blueprint

inventory_bp = Blueprint("inventory", __name__, url_prefix="/api/inventory")

from . import routes as routes