from flask import Flask, jsonify
from sqlalchemy import text

from .config import Config
from .extensions import bcrypt, cors, db, jwt, migrate
from .models.booking import Booking
from .users.model import User
from .users.routes import auth_bp
from .bookings.routes import bookings_bp
from .quotes.routes import quotes_bp
from .messages.routes import messages_bp
from .movers.routes import movers_bp
from .payments.routes import payments_bp
from .tracking.routes import tracking_bp
from .models.password_reset import PasswordResetToken


def create_app(config_class=Config):
    app = Flask(__name__)

    app.config.from_object(config_class)
    config_class.validate()

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/*": {"origins": app.config["CORS_ORIGINS"]}})
    bcrypt.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(quotes_bp)
    app.register_blueprint(messages_bp)
    app.register_blueprint(movers_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(tracking_bp)

    @app.get("/")
    def health_check():
        return {
            "success": True,
            "message": "SmartMove API is running"
        }

    @app.get("/health")
    def health_check_detailed():
        """Readiness endpoint for load balancers and deployment checks."""
        try:
            db.session.execute(text("SELECT 1"))
            return jsonify({"status": "ok", "database": "ok"}), 200
        except Exception:
            db.session.rollback()
            return jsonify({"status": "degraded", "database": "unavailable"}), 503

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(_error):
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

    @app.after_request
    def add_security_headers(response):
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        return response

    return app
