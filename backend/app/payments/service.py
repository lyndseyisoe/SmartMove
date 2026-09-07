import base64
import json
import os
from datetime import datetime
from urllib.error import HTTPError
from urllib.request import Request, urlopen


def _request(url, payload=None, headers=None, method="POST"):
    body = json.dumps(payload).encode() if payload is not None else None
    request = Request(url, data=body, headers=headers or {}, method=method)
    with urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode())


def _base_url():
    return "https://api.safaricom.co.ke" if os.getenv("MPESA_ENV", "sandbox").lower() == "live" else "https://sandbox.safaricom.co.ke"


def normalize_phone(phone):
    digits = "".join(character for character in str(phone) if character.isdigit())
    if digits.startswith("0"):
        digits = "254" + digits[1:]
    elif digits.startswith("7") or digits.startswith("1"):
        digits = "254" + digits
    if len(digits) != 12 or not digits.startswith("254"):
        raise ValueError("Use a valid Kenyan phone number, for example 0712345678")
    return digits


def stk_push(phone, amount, booking_id):
    consumer_key = os.getenv("MPESA_CONSUMER_KEY")
    consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")
    shortcode = os.getenv("MPESA_SHORTCODE")
    passkey = os.getenv("MPESA_PASSKEY")
    callback_url = os.getenv("MPESA_CALLBACK_URL")
    if not all((consumer_key, consumer_secret, shortcode, passkey, callback_url)):
        raise RuntimeError("M-Pesa is not configured. Set the MPESA_* environment variables.")

    token = _request(f"{_base_url()}/oauth/v1/generate?grant_type=client_credentials", headers={"Authorization": "Basic " + base64.b64encode(f"{consumer_key}:{consumer_secret}".encode()).decode()}, method="GET")["access_token"]
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    password = base64.b64encode(f"{shortcode}{passkey}{timestamp}".encode()).decode()
    return _request(f"{_base_url()}/mpesa/stkpush/v1/processrequest", {
        "BusinessShortCode": shortcode, "Password": password, "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline", "Amount": int(round(float(amount))),
        "PartyA": phone, "PartyB": shortcode, "PhoneNumber": phone,
        "CallBackURL": callback_url, "AccountReference": f"SMARTMOVE-{booking_id}",
        "TransactionDesc": "SmartMove booking payment",
    }, {"Authorization": f"Bearer {token}", "Content-Type": "application/json"})


def mpesa_error_message(error):
    if isinstance(error, HTTPError):
        return f"M-Pesa request failed with status {error.code}"
    return str(error)
