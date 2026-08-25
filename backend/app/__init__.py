from flask import Flask

from .config import Config
from .extensions import bcrypt, cors, db, jwt, migrate
from .models.booking import Booking
from .users.model import User
from .users.routes import auth_bp
from .bookings.routes import bookings_bp
from .quotes.routes import quotes_bp


def create_app(config_class=Config):
    app = Flask(__name__)

    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(quotes_bp)

    @app.get("/")
    def health_check():
        return {
            "success": True,
            "message": "SmartMove API is running"
        }

    return app
