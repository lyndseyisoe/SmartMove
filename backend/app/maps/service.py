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
    """

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