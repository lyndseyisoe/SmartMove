def calculate_quote(
    distance_km,
    estimated_hours,
    item_count=0,
    floor_number=0,
    has_elevator=True,
):
    """
    Calculate an estimated moving quote.

    Pricing:
    - Base fee: KSh 2,000
    - Distance: KSh 100 per km
    - Labour: KSh 1,000 per estimated hour
    - Items: KSh 50 per item
    - Floor surcharge: KSh 500 per floor when there is no elevator.
    """

    try:
        distance_km = float(distance_km)
        estimated_hours = float(estimated_hours)
        item_count = int(item_count)
        floor_number = int(floor_number)
    except (TypeError, ValueError):
        raise ValueError(
            "distance_km and estimated_hours must be numbers, "
            "while item_count and floor_number must be integers"
        )

    if distance_km < 0:
        raise ValueError("distance_km cannot be negative")

    if estimated_hours < 0:
        raise ValueError("estimated_hours cannot be negative")

    if item_count < 0:
        raise ValueError("item_count cannot be negative")

    if floor_number < 0:
        raise ValueError("floor_number cannot be negative")

    base_fee = 2000

    distance_charge = distance_km * 100
    labour_charge = estimated_hours * 1000
    item_charge = item_count * 50

    floor_charge = 0

    if not has_elevator:
        floor_charge = floor_number * 500

    total = (
        base_fee
        + distance_charge
        + labour_charge
        + item_charge
        + floor_charge
    )

    return {
        "base_fee": base_fee,
        "distance_charge": round(distance_charge, 2),
        "labour_charge": round(labour_charge, 2),
        "item_charge": round(item_charge, 2),
        "floor_charge": round(floor_charge, 2),
        "total_estimate": round(total, 2),
    }