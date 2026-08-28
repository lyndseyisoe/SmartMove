import { describe, it, expect } from 'vitest';
import { fromApiBooking, toApiBookingPayload } from '../bookingMapper';

const RAW_BOOKING = {
  id: 5,
  client_id: 12,
  mover_id: 3,
  moving_date: '2026-09-01',
  status: 'pending',
  pickup_address: 'Kilimani, Nairobi',
  pickup_latitude: -1.29,
  pickup_longitude: 36.78,
  destination_address: 'Westlands, Nairobi',
  destination_latitude: -1.27,
  destination_longitude: 36.81,
  created_at: '2026-08-01T10:00:00',
  updated_at: '2026-08-01T10:00:00',
};

describe('fromApiBooking', () => {
  it('converts the backend snake_case shape into the camelCase shape components use', () => {
    const result = fromApiBooking(RAW_BOOKING);
    expect(result).toMatchObject({
      id: 5,
      clientId: 12,
      moverId: 3,
      moveDate: '2026-09-01',
      status: 'pending',
      pickupAddress: 'Kilimani, Nairobi',
      pickup: { lat: -1.29, lng: 36.78 },
      destinationAddress: 'Westlands, Nairobi',
      destination: { lat: -1.27, lng: 36.81 },
    });
  });

  it('returns null pickup/destination coordinates when lat/lng are missing', () => {
    const result = fromApiBooking({ ...RAW_BOOKING, pickup_latitude: null, pickup_longitude: null });
    expect(result.pickup).toBeNull();
  });

  it('passes through falsy input unchanged', () => {
    expect(fromApiBooking(null)).toBeNull();
  });
});

describe('toApiBookingPayload', () => {
  it('converts camelCase input into the snake_case payload the backend expects', () => {
    const payload = toApiBookingPayload({
      moverId: 3,
      moveDate: '2026-09-01',
      pickupAddress: 'Kilimani, Nairobi',
      pickup: { lat: -1.29, lng: 36.78 },
      destinationAddress: 'Westlands, Nairobi',
      destination: { lat: -1.27, lng: 36.81 },
      notes: 'Fragile items', // no column on the backend yet
    });

    expect(payload).toEqual({
      mover_id: 3,
      moving_date: '2026-09-01',
      pickup_address: 'Kilimani, Nairobi',
      pickup_latitude: -1.29,
      pickup_longitude: 36.78,
      destination_address: 'Westlands, Nairobi',
      destination_latitude: -1.27,
      destination_longitude: 36.81,
    });
    expect(payload.notes).toBeUndefined();
  });

  it('omits fields that are not provided rather than sending them as undefined', () => {
    const payload = toApiBookingPayload({ status: 'confirmed' });
    expect(payload).toEqual({ status: 'confirmed' });
  });
});
