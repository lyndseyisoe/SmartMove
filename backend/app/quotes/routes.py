from flask import Blueprint, jsonify, request

from app.quotes.service import calculate_quote


quotes_bp = Blueprint(
    "quotes",
    __name__,
    url_prefix="/quotes"
)


@quotes_bp.post("/")
def create_quote():
    """
    Calculate an estimated moving cost.
    """

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    required_fields = [
        "distance_km",
        "estimated_hours",
    ]

    missing_fields = [
        field
        for field in required_fields
        if field not in data
    ]

    if missing_fields:
        return jsonify({
            "error": "Missing required fields",
            "fields": missing_fields
        }), 400

    try:
        quote = calculate_quote(
            distance_km=data["distance_km"],
            estimated_hours=data["estimated_hours"],
            item_count=data.get("item_count", 0),
            floor_number=data.get("floor_number", 0),
            has_elevator=data.get("has_elevator", True),
        )

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400

    return jsonify({
        "message": "Quote calculated successfully",
        "quote": quote
    }), 200
