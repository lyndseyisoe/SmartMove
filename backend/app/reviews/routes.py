from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import func, or_

from app.extensions import db
from app.models.booking import Booking
from app.models.review import Review
from app.notifications.service import notify
from app.users.model import User


reviews_bp = Blueprint("reviews", __name__, url_prefix="/reviews")


def review_to_dict(review):
    return {
        "id": review.id,
        "booking_id": review.booking_id,
        "client_id": review.client_id,
        "mover_id": review.mover_id,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at.isoformat(),
    }


@reviews_bp.post("/<int:booking_id>")
@jwt_required()
def create_review(booking_id):
    """A client leaves a review for one of their own, completed bookings."""
    client_id = int(get_jwt_identity())

    booking = Booking.query.filter_by(id=booking_id, client_id=client_id).first()

    if booking is None:
        return jsonify({"error": "Booking not found"}), 404

    if booking.status != "completed":
        return jsonify({"error": "You can only review a move once it is completed"}), 400

    if Review.query.filter_by(booking_id=booking.id).first() is not None:
        return jsonify({"error": "You have already reviewed this booking"}), 409

    data = request.get_json() or {}

    try:
        rating = int(data.get("rating"))
    except (TypeError, ValueError):
        return jsonify({"error": "rating must be an integer between 1 and 5"}), 400

    if rating < 1 or rating > 5:
        return jsonify({"error": "rating must be an integer between 1 and 5"}), 400

    comment = str(data.get("comment", "")).strip() or None

    if comment and len(comment) > 2000:
        return jsonify({"error": "comment must be 2000 characters or fewer"}), 400

    review = Review(
        booking_id=booking.id,
        client_id=client_id,
        mover_id=booking.mover_id,
        rating=rating,
        comment=comment,
    )
    db.session.add(review)

    client = db.session.get(User, client_id)
    notify(
        user_id=booking.mover_id,
        type_="new_review",
        title="You received a new review",
        body=f"{client.name if client else 'A client'} left you a {rating}-star review.",
        booking_id=booking.id,
    )

    db.session.commit()

    return jsonify({
        "message": "Review submitted",
        "review": review_to_dict(review)
    }), 201


@reviews_bp.get("/<int:booking_id>")
@jwt_required()
def get_review(booking_id):
    """Either party on a booking can look up its review, if one exists."""
    user_id = int(get_jwt_identity())

    booking = Booking.query.filter(
        Booking.id == booking_id,
        or_(Booking.client_id == user_id, Booking.mover_id == user_id),
    ).first()

    if booking is None:
        return jsonify({"error": "Booking not found"}), 404

    review = Review.query.filter_by(booking_id=booking.id).first()

    return jsonify({
        "review": review_to_dict(review) if review else None
    }), 200


@reviews_bp.get("/movers/<int:mover_id>")
@jwt_required()
def list_mover_reviews(mover_id):
    """A mover's public review history and average rating."""
    mover = db.session.get(User, mover_id)

    if mover is None or mover.role != "mover":
        return jsonify({"error": "Mover not found"}), 404

    reviews = (
        Review.query
        .filter_by(mover_id=mover_id)
        .order_by(Review.created_at.desc())
        .all()
    )

    average_rating, review_count = (
        db.session.query(func.avg(Review.rating), func.count(Review.id))
        .filter(Review.mover_id == mover_id)
        .one()
    )

    return jsonify({
        "mover_id": mover_id,
        "average_rating": round(float(average_rating), 2) if average_rating is not None else None,
        "review_count": review_count or 0,
        "reviews": [review_to_dict(review) for review in reviews],
    }), 200
