import pytest
from datetime import date

from app import create_app
from app.config import Config
from app.extensions import db
from app.models.booking import Booking
from app.models.tracking import TrackingItem
from app.users.model import User


class TestConfig(Config):
    TESTING = True
    SECRET_KEY = "test-secret-key"
    JWT_SECRET_KEY = "test-jwt-secret-key"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_TRACK_MODIFICATIONS = False


@pytest.fixture()
def app():
    app = create_app(TestConfig)

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


def register_and_login(client, email, role="client"):
    register_response = client.post(
        "/auth/register",
        json={
            "name": email.split("@")[0],
            "email": email,
            "password": "password123",
            "role": role,
        },
    )

    assert register_response.status_code == 201

    user_id = register_response.get_json()["user"]["id"]

    login_response = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": "password123",
        },
    )

    assert login_response.status_code == 200

    token = login_response.get_json()["access_token"]

    return user_id, {"Authorization": f"Bearer {token}"}


def make_booking(app, client_id, mover_id):
    with app.app_context():
        booking = Booking(
            client_id=client_id,
            mover_id=mover_id,
            moving_date=date(2026, 9, 15),
            pickup_address="Kilimani, Nairobi",
            destination_address="Karen, Nairobi",
        )
        db.session.add(booking)
        db.session.commit()
        return booking.id


def make_tracking_item(app, booking_id, item_name="Sofa"):
    with app.app_context():
        item = TrackingItem(booking_id=booking_id, item_name=item_name)
        db.session.add(item)
        db.session.commit()
        return item.id


def test_get_tracking_items_requires_authentication(client):
    response = client.get("/tracking/booking/1")

    assert response.status_code == 401


def test_client_can_view_own_booking_tracking(app, client):
    client_id, client_headers = register_and_login(client, "client@test.com")
    booking_id = make_booking(app, client_id, mover_id=999)
    make_tracking_item(app, booking_id)

    response = client.get(
        f"/tracking/booking/{booking_id}",
        headers=client_headers,
    )

    assert response.status_code == 200
    assert len(response.get_json()) == 1


def test_mover_can_view_assigned_booking_tracking(app, client):
    mover_id, mover_headers = register_and_login(client, "mover@test.com", role="mover")
    booking_id = make_booking(app, client_id=999, mover_id=mover_id)
    make_tracking_item(app, booking_id)

    response = client.get(
        f"/tracking/booking/{booking_id}",
        headers=mover_headers,
    )

    assert response.status_code == 200
    assert len(response.get_json()) == 1


def test_unrelated_user_cannot_view_booking_tracking(app, client):
    _, owner_headers = register_and_login(client, "owner@test.com")
    outsider_id, outsider_headers = register_and_login(client, "outsider@test.com")

    booking_id = make_booking(app, client_id=999, mover_id=998)
    make_tracking_item(app, booking_id)

    response = client.get(
        f"/tracking/booking/{booking_id}",
        headers=outsider_headers,
    )

    assert response.status_code == 404


def test_unrelated_user_cannot_create_tracking_item(app, client):
    outsider_id, outsider_headers = register_and_login(client, "outsider2@test.com")
    booking_id = make_booking(app, client_id=999, mover_id=998)

    response = client.post(
        f"/tracking/booking/{booking_id}",
        json={"item_name": "TV"},
        headers=outsider_headers,
    )

    assert response.status_code == 404


def test_unrelated_user_cannot_update_tracking_item(app, client):
    outsider_id, outsider_headers = register_and_login(client, "outsider3@test.com")
    booking_id = make_booking(app, client_id=999, mover_id=998)
    item_id = make_tracking_item(app, booking_id)

    response = client.patch(
        f"/tracking/{item_id}",
        json={"status": "loaded"},
        headers=outsider_headers,
    )

    assert response.status_code == 404


def test_unrelated_user_cannot_delete_tracking_item(app, client):
    outsider_id, outsider_headers = register_and_login(client, "outsider4@test.com")
    booking_id = make_booking(app, client_id=999, mover_id=998)
    item_id = make_tracking_item(app, booking_id)

    response = client.delete(
        f"/tracking/{item_id}",
        headers=outsider_headers,
    )

    assert response.status_code == 404

    with app.app_context():
        assert db.session.get(TrackingItem, item_id) is not None


def test_owner_can_update_and_delete_tracking_item(app, client):
    client_id, client_headers = register_and_login(client, "owner2@test.com")
    booking_id = make_booking(app, client_id, mover_id=999)
    item_id = make_tracking_item(app, booking_id)

    update_response = client.patch(
        f"/tracking/{item_id}",
        json={"status": "loaded"},
        headers=client_headers,
    )

    assert update_response.status_code == 200
    assert update_response.get_json()["status"] == "loaded"

    delete_response = client.delete(
        f"/tracking/{item_id}",
        headers=client_headers,
    )

    assert delete_response.status_code == 200

    with app.app_context():
        assert db.session.get(TrackingItem, item_id) is None
