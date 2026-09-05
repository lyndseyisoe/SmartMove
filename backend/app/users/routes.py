import hashlib
import logging
import secrets
from datetime import datetime, timedelta

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
)

from app.extensions import db
from app.users.model import User
from app.auth_email import send_password_reset_email
from app.models.password_reset import PasswordResetToken


auth_bp = Blueprint("auth", __name__, url_prefix="/auth")
logger = logging.getLogger(__name__)


@auth_bp.post("/forgot-password")
def forgot_password():
    data = request.get_json() or {}
    email = str(data.get("email", "")).strip().lower()
    # Always return the same response so the endpoint cannot enumerate accounts.
    response = {"message": "If an account exists for that email, a reset link has been sent."}
    if not email:
        return jsonify(response), 200
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify(response), 200

    PasswordResetToken.query.filter_by(user_id=user.id, used_at=None).update({"used_at": datetime.utcnow()})
    raw_token = secrets.token_urlsafe(32)
    token = PasswordResetToken(user_id=user.id, token_hash=hashlib.sha256(raw_token.encode()).hexdigest(), expires_at=datetime.utcnow() + timedelta(minutes=current_app.config["RESET_TOKEN_EXPIRES_MINUTES"]))
    db.session.add(token)
    db.session.commit()
    reset_url = f"{current_app.config['FRONTEND_URL']}/reset-password?token={raw_token}"
    try:
        send_password_reset_email(user.email, user.name, reset_url)
    except Exception:
        logger.exception("Password reset email delivery failed for user %s", user.id)
    return jsonify(response), 200


@auth_bp.post("/reset-password")
def reset_password():
    data = request.get_json() or {}
    raw_token = str(data.get("token", ""))
    password = data.get("password", "")
    if not raw_token or not isinstance(password, str) or len(password) < 8:
        return jsonify({"error": "A valid token and password of at least 8 characters are required"}), 400
    token = PasswordResetToken.query.filter_by(token_hash=hashlib.sha256(raw_token.encode()).hexdigest()).first()
    if token is None or token.used_at is not None or token.expires_at <= datetime.utcnow():
        return jsonify({"error": "This reset link is invalid or has expired"}), 400
    user = db.session.get(User, token.user_id)
    if user is None:
        return jsonify({"error": "This reset link is invalid or has expired"}), 400
    user.set_password(password)
    token.used_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"message": "Password reset successfully"}), 200


@auth_bp.post("/register")
def register():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    required_fields = ["name", "email", "password"]

    missing_fields = [
        field for field in required_fields
        if not data.get(field)
    ]

    if missing_fields:
        return jsonify({
            "error": "Missing required fields",
            "fields": missing_fields
        }), 400

    name = data["name"].strip()
    email = data["email"].strip().lower()
    password = data["password"]
    role = data.get("role", "client")

    if role not in {"client", "mover"}:
        return jsonify({"error": "role must be either client or mover"}), 400

    if len(password) < 8:
        return jsonify({
            "error": "Password must be at least 8 characters long"
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "error": "A user with this email already exists"
        }), 409

    # Movers need admin approval before they're visible/bookable;
    # clients (and any admin created directly, e.g. via seed) are
    # active immediately.
    status = "pending" if role == "mover" else "approved"

    user = User(
        name=name,
        email=email,
        role=role,
        status=status,
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    message = "User registered successfully"
    if role == "mover":
        message = "Registration received. Your mover account is pending admin approval."

    return jsonify({
        "message": message,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "status": user.status,
        }
    }), 201


@auth_bp.post("/login")
def login():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    email = email.strip().lower()

    user = User.query.filter_by(email=email).first()

    if user is None or not user.check_password(password):
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    if user.role == "mover" and user.status == "rejected":
        return jsonify({
            "error": "Your mover application was not approved. Contact support for details."
        }), 403

    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "status": user.status,
        }
    }), 200


@auth_bp.get("/me")
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()

    user = db.session.get(User, int(user_id))

    if user is None:
        return jsonify({
            "error": "User not found"
        }), 404

    return jsonify({
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "status": user.status,
            "rejection_reason": user.rejection_reason,
        }
    }), 200
