from flask import Flask
from flask import Blueprint

inventory_bp = Blueprint("inventory", __name__, url_prefix="/api/inventory")

from . import routes  # noqa: E402  (import after bp creation avoids circular import)
from .config import Config
from .extensions import cors, db, migrate


def create_app(config_class=Config):
    app = Flask(__name__)

    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)

    @app.get("/")
    def health_check():
        return {
            "success": True,
            "message": "SmartMove API is running"
        }

    return app