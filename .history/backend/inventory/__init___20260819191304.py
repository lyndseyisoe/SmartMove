from flask import Blueprint

inventory_bp = Blueprint("inventory", __name__, url_prefix="/api/inventory")

from . import routes  # noqa: E402  (import after bp creation avoids circular import)