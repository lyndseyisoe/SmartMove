import pytest

from app import create_app
from app.config import Config
from app.extensions import db
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


@pytest.fixture()
def auth_headers(client):
    register_response = client.post(
        "/auth/register",
        json={
            "name": "Inventory Test User",
            "email": "inventory@test.com",
            "password": "password123",
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        json={
            "email": "inventory@test.com",
            "password": "password123",
        },
    )

    assert login_response.status_code == 200

    token = login_response.get_json()["access_token"]

    return {
        "Authorization": f"Bearer {token}"
    }


def create_item(client, auth_headers, **overrides):
    item = {
        "name": "Sofa",
        "category": "Furniture",
        "room": "Living Room",
        "quantity": 1,
        "weight_kg": 45,
        "volume_m3": 2.5,
        "notes": "Large 3-seater sofa",
    }

    item.update(overrides)

    return client.post(
        "/inventory/",
        json=item,
        headers=auth_headers,
    )


def test_inventory_requires_authentication(client):
    response = client.get("/inventory/")

    assert response.status_code == 401


def test_create_inventory_item(client, auth_headers):
    response = create_item(client, auth_headers)

    assert response.status_code == 201

    data = response.get_json()

    assert data["message"] == "Inventory item created successfully"
    assert data["item"]["name"] == "Sofa"
    assert data["item"]["category"] == "Furniture"
    assert data["item"]["room"] == "Living Room"
    assert data["item"]["quantity"] == 1
    assert data["item"]["weight_kg"] == 45.0
    assert data["item"]["volume_m3"] == 2.5


def test_list_inventory_items(client, auth_headers):
    create_item(client, auth_headers)

    create_item(
        client,
        auth_headers,
        name="Television",
        category="Electronics",
        room="Living Room",
        weight_kg=12,
        volume_m3=0.2,
    )

    response = client.get(
        "/inventory/",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["count"] == 2
    assert len(data["items"]) == 2


def test_get_inventory_item(client, auth_headers):
    create_response = create_item(client, auth_headers)

    item_id = create_response.get_json()["item"]["id"]

    response = client.get(
        f"/inventory/{item_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["item"]["id"] == item_id
    assert data["item"]["name"] == "Sofa"


def test_update_inventory_item(client, auth_headers):
    create_response = create_item(client, auth_headers)

    item_id = create_response.get_json()["item"]["id"]

    response = client.patch(
        f"/inventory/{item_id}",
        json={
            "quantity": 2,
            "notes": "Handle carefully",
        },
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "Inventory item updated successfully"
    assert data["item"]["quantity"] == 2
    assert data["item"]["notes"] == "Handle carefully"


def test_inventory_summary(client, auth_headers):
    create_item(
        client,
        auth_headers,
        name="Sofa",
        category="Furniture",
        quantity=1,
        weight_kg=45,
        volume_m3=2.5,
    )

    create_item(
        client,
        auth_headers,
        name="Dining Chairs",
        category="Furniture",
        room="Dining Room",
        quantity=4,
        weight_kg=8,
        volume_m3=0.5,
    )

    create_item(
        client,
        auth_headers,
        name="Television",
        category="Electronics",
        quantity=1,
        weight_kg=12,
        volume_m3=0.2,
    )

    response = client.get(
        "/inventory/summary",
        headers=auth_headers,
    )

    assert response.status_code == 200

    summary = response.get_json()["summary"]

    assert summary["total_items"] == 6
    assert summary["total_weight_kg"] == 89.0
    assert summary["total_volume_m3"] == 4.7

    assert summary["categories"]["Furniture"] == 5
    assert summary["categories"]["Electronics"] == 1


def test_delete_inventory_item(client, auth_headers):
    create_response = create_item(client, auth_headers)

    item_id = create_response.get_json()["item"]["id"]

    delete_response = client.delete(
        f"/inventory/{item_id}",
        headers=auth_headers,
    )

    assert delete_response.status_code == 200

    data = delete_response.get_json()

    assert data["message"] == "Inventory item deleted successfully"

    get_response = client.get(
        f"/inventory/{item_id}",
        headers=auth_headers,
    )

    assert get_response.status_code == 404


def test_inventory_item_not_found(client, auth_headers):
    response = client.get(
        "/inventory/9999",
        headers=auth_headers,
    )

    assert response.status_code == 404
    assert response.get_json()["error"] == "Inventory item not found"


def test_create_inventory_item_validation(client, auth_headers):
    response = client.post(
        "/inventory/",
        json={
            "name": "Sofa",
            "category": "Furniture",
        },
        headers=auth_headers,
    )

    assert response.status_code == 400

    data = response.get_json()

    assert "Missing required fields" in data["error"]


def test_invalid_quantity(client, auth_headers):
    response = create_item(
        client,
        auth_headers,
        quantity=0,
    )

    assert response.status_code == 400
    assert response.get_json()["error"] == "quantity must be at least 1"


def test_negative_weight(client, auth_headers):
    response = create_item(
        client,
        auth_headers,
        weight_kg=-5,
    )

    assert response.status_code == 400
    assert response.get_json()["error"] == "weight_kg cannot be negative"


def test_negative_volume(client, auth_headers):
    response = create_item(
        client,
        auth_headers,
        volume_m3=-1,
    )

    assert response.status_code == 400
    assert response.get_json()["error"] == "volume_m3 cannot be negative"