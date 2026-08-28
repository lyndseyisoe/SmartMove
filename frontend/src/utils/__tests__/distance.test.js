import { describe, it, expect } from 'vitest';
import { haversineKm } from '../distance';

describe('haversineKm', () => {
  it('returns 0 for identical points', () => {
    const point = { lat: -1.2921, lng: 36.8219 };
    expect(haversineKm(point, point)).toBe(0);
  });

  it('matches a known distance (Nairobi CBD to JKIA, ~15-16km)', () => {
    const nairobiCbd = { lat: -1.2864, lng: 36.8172 };
    const jkia = { lat: -1.3192, lng: 36.9278 };
    const result = haversineKm(nairobiCbd, jkia);
    expect(result).toBeGreaterThan(10);
    expect(result).toBeLessThan(20);
  });

  it('returns null when either point is missing', () => {
    expect(haversineKm(null, { lat: 0, lng: 0 })).toBeNull();
    expect(haversineKm({ lat: 0, lng: 0 }, undefined)).toBeNull();
  });
});
