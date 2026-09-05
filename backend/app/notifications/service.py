from app.extensions import db
from app.models.notification import Notification


def notify(user_id, type_, title, body=None, booking_id=None):
    """
    Queue a notification for `user_id`. Does not commit - the caller
    commits alongside whatever action triggered the notification, so
    the two are saved together.
    """
    if not user_id:
        return None

    notification = Notification(
        user_id=user_id,
        type=type_,
        title=title,
        body=body,
        booking_id=booking_id,
    )
    db.session.add(notification)

    return notification
