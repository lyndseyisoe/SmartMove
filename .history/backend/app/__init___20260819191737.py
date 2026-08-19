from flask import Flask
from inventory import inventory_bp
from .config import Config
from .extensions import cors, db, migrate
from . import routes as routes


def create_app(config_class=Config):
    app = Flask(__name__)

    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    app.register_blueprint(inventory_bp)
    cors.init_app(app)

    @app.get("/")
    def health_check():
        return {
            "success": True,
            "message": "SmartMove API is running"
        }

    return app