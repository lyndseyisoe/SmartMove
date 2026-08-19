from flask import Blueprint, Flask

inventory_bp = Blueprint("inventory", __name__, url_prefix="/api/inventory")

from . import routes  
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