from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.models.booking import Booking
from app.models.payment import Payment
from app.payments.service import mpesa_error_message, normalize_phone, stk_push

payments_bp = Blueprint("payments", __name__, url_prefix="/payments")


def payment_to_dict(payment):
    return {"id": payment.id, "booking_id": payment.booking_id, "amount": float(payment.amount), "phone_number": payment.phone_number, "status": payment.status, "receipt_number": payment.receipt_number, "result_description": payment.result_description, "created_at": payment.created_at.isoformat()}


@payments_bp.post("/stk-push")
@jwt_required()
def start_stk_push():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    booking = Booking.query.filter_by(id=data.get("booking_id"), client_id=user_id).first()
    if booking is None:
        return jsonify({"error": "Booking not found"}), 404
    if booking.quoted_amount is None or float(booking.quoted_amount) <= 0:
        return jsonify({"error": "This booking does not have a payable quote"}), 400
    if Payment.query.filter_by(booking_id=booking.id, status="pending").first():
        return jsonify({"error": "A payment is already pending for this booking"}), 409
    try:
        phone = normalize_phone(data.get("phone_number", ""))
        response = stk_push(phone, booking.quoted_amount, booking.id)
    except (ValueError, RuntimeError, OSError) as error:
        return jsonify({"error": mpesa_error_message(error)}), 400
    payment = Payment(booking_id=booking.id, user_id=user_id, phone_number=phone, amount=booking.quoted_amount, checkout_request_id=response.get("CheckoutRequestID"), merchant_request_id=response.get("MerchantRequestID"), status="pending", result_description=response.get("CustomerMessage") or response.get("ResponseDescription"))
    db.session.add(payment)
    db.session.commit()
    return jsonify({"payment": payment_to_dict(payment), "message": response.get("CustomerMessage", "Check your phone to complete payment")}), 201


@payments_bp.get("/<int:payment_id>")
@jwt_required()
def payment_status(payment_id):
    payment = Payment.query.filter_by(id=payment_id, user_id=int(get_jwt_identity())).first()
    if payment is None:
        return jsonify({"error": "Payment not found"}), 404
    return jsonify({"payment": payment_to_dict(payment)}), 200


@payments_bp.post("/callback")
def mpesa_callback():
    data = request.get_json(silent=True) or {}
    callback = data.get("Body", {}).get("stkCallback", {})
    payment = Payment.query.filter_by(checkout_request_id=callback.get("CheckoutRequestID")).first()
    if payment is None:
        return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200
    payment.result_code = callback.get("ResultCode")
    payment.result_description = callback.get("ResultDesc")
    payment.status = "paid" if callback.get("ResultCode") == 0 else "failed"
    if payment.status == "paid":
        for item in callback.get("CallbackMetadata", {}).get("Item", []):
            if item.get("Name") == "MpesaReceiptNumber":
                payment.receipt_number = item.get("Value")
                break
    payment.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200
