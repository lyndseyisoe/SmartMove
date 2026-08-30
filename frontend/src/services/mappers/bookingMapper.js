
export function fromApiBooking(raw) {
  if (!raw) return raw;
  return {
    id: raw.id,
    clientId: raw.client_id,
    moverId: raw.mover_id,
    moveDate: raw.moving_date,
    status: raw.status,
    estimatedCost: raw.quoted_amount,
    pickupAddress: raw.pickup_address,
    pickup:
      raw.pickup_latitude != null && raw.pickup_longitude != null
        ? { lat: raw.pickup_latitude, lng: raw.pickup_longitude }
        : null,
    destinationAddress: raw.destination_address,
    destination:
      raw.destination_latitude != null && raw.destination_longitude != null
        ? { lat: raw.destination_latitude, lng: raw.destination_longitude }
        : null,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    moverName: undefined,
    clientName: undefined,
    notes: undefined,
  };
}
export function toApiBookingPayload(input) {
  const payload = {};
  if (input.moverId !== undefined) payload.mover_id = input.moverId;
  if (input.moveDate !== undefined) payload.moving_date = input.moveDate; // expects "YYYY-MM-DD"
  if (input.pickupAddress !== undefined) payload.pickup_address = input.pickupAddress;
  if (input.pickup?.lat !== undefined) payload.pickup_latitude = input.pickup.lat;
  if (input.pickup?.lng !== undefined) payload.pickup_longitude = input.pickup.lng;
  if (input.destinationAddress !== undefined) payload.destination_address = input.destinationAddress;
  if (input.destination?.lat !== undefined) payload.destination_latitude = input.destination.lat;
  if (input.destination?.lng !== undefined) payload.destination_longitude = input.destination.lng;
  if (input.status !== undefined) payload.status = input.status;
  if (input.quotedAmount !== undefined) payload.quoted_amount = input.quotedAmount;
  if (input.quoteDistanceKm !== undefined) payload.quote_distance_km = input.quoteDistanceKm;
  if (input.estimatedHours !== undefined) payload.estimated_hours = input.estimatedHours;
  if (input.itemCount !== undefined) payload.item_count = input.itemCount;
  if (input.floorNumber !== undefined) payload.floor_number = input.floorNumber;
  if (input.hasElevator !== undefined) payload.has_elevator = input.hasElevator;

  return payload;
}
