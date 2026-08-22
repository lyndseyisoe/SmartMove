from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
)

from app.extensions import db
from app.users.model import User


auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


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

    if len(password) < 8:
        return jsonify({
            "error": "Password must be at least 8 characters long"
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "error": "A user with this email already exists"
        }), 409

    user = User(
        name=name,
        email=email,
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
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
        }
    }), 200