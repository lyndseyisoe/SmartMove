import html
import json
from urllib.error import HTTPError
import os
from urllib.request import Request, urlopen


def send_password_reset_email(recipient, name, reset_url):
    api_key = os.getenv("RESEND_API_KEY")
    sender = os.getenv("RESEND_FROM_EMAIL")
    if not api_key or not sender:
        raise RuntimeError("Resend is not configured")
    safe_name = html.escape(name or "there")
    safe_url = html.escape(reset_url, quote=True)
    payload = {
        "from": sender,
        "to": [recipient],
        "subject": "Reset your SmartMove password",
        "html": f"<p>Hi {safe_name},</p><p>Use the button below to set a new SmartMove password. This link expires in 30 minutes.</p><p><a href=\"{safe_url}\" style=\"display:inline-block;padding:12px 18px;background:#0f9d92;color:#fff;text-decoration:none;border-radius:8px\">Reset password</a></p><p>If you did not request this, you can safely ignore this email.</p>",
        "text": f"Reset your SmartMove password: {reset_url}\n\nThis link expires in 30 minutes.",
    }
    request = Request("https://api.resend.com/emails", data=json.dumps(payload).encode(), headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}, method="POST")
    try:
        with urlopen(request, timeout=15) as response:
            return json.loads(response.read().decode())
    except HTTPError as error:
        detail = error.read().decode(errors="replace")
        raise RuntimeError(f"Resend rejected the email ({error.code}): {detail[:300]}") from error
