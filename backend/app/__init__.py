from flask import Flask

from .config import Config
from .extensions import cors, db, migrate
from .models.booking import Booking
from .bookings.routes import bookings_bp


def create_app(config_class=Config):
    app = Flask(__name__)

    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)

    app.register_blueprint(bookings_bp)

    @app.get("/")
    def health_check():
        return {
            "success": True,
            "message": "SmartMove API is running"
        }

    return app