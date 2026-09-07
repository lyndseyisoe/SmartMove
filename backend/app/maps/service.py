import math


def calculate_distance(
    pickup_latitude,
    pickup_longitude,
    destination_latitude,
    destination_longitude,
):
    """
    Calculate the straight-line distance between two coordinates
    using the Haversine formula.

    Returns:
        float: Distance in kilometers.

    Raises:
        ValueError: If any coordinate is missing or invalid.
    """

    coordinates = [
        pickup_latitude,
        pickup_longitude,
        destination_latitude,
        destination_longitude,
    ]

    if any(value is None for value in coordinates):
        raise ValueError("All coordinates are required")

    try:
        pickup_latitude = float(pickup_latitude)
        pickup_longitude = float(pickup_longitude)
        destination_latitude = float(destination_latitude)
        destination_longitude = float(destination_longitude)
    except (TypeError, ValueError):
        raise ValueError("Coordinates must be valid numbers")

    if not -90 <= pickup_latitude <= 90:
        raise ValueError("Pickup latitude must be between -90 and 90")

    if not -90 <= destination_latitude <= 90:
        raise ValueError("Destination latitude must be between -90 and 90")

    if not -180 <= pickup_longitude <= 180:
        raise ValueError("Pickup longitude must be between -180 and 180")

    if not -180 <= destination_longitude <= 180:
        raise ValueError(
            "Destination longitude must be between -180 and 180"
        )

    earth_radius_km = 6371.0

    pickup_lat = math.radians(pickup_latitude)
    destination_lat = math.radians(destination_latitude)

    delta_lat = math.radians(
        destination_latitude - pickup_latitude
    )

    delta_longitude = math.radians(
        destination_longitude - pickup_longitude
    )

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(pickup_lat)
        * math.cos(destination_lat)
        * math.sin(delta_longitude / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return round(earth_radius_km * c, 2)