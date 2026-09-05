from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.users.model import User


def get_current_user():
    """Return the User for the current JWT identity, or None."""
    user_id = get_jwt_identity()
    if user_id is None:
        return None
    return db.session.get(User, int(user_id))


def role_required(*roles):
    """
    Restrict a route to authenticated users whose role is in `roles`.
    The matching User is injected as the first positional argument of
    the decorated view function.
    """
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            user = get_current_user()

            if user is None:
                return jsonify({"error": "User not found"}), 404

            if user.role not in roles:
                return jsonify({
                    "error": "You do not have permission to perform this action"
                }), 403

            return fn(user, *args, **kwargs)

        return wrapper

    return decorator
