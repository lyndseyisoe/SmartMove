import { describe, it, expect } from 'vitest';
import { normalizeError } from '../api';

describe('normalizeError', () => {
  it('maps a 401 response to a friendly login message', () => {
    const result = normalizeError({ response: { status: 401, data: {} } });
    expect(result).toEqual({ status: 401, message: 'Please log in to continue.', errors: null });
  });

  it('maps a 422 response and preserves field-level errors', () => {
    const result = normalizeError({
      response: { status: 422, data: { errors: { email: 'Already taken' } } },
    });
    expect(result.status).toBe(422);
    expect(result.errors).toEqual({ email: 'Already taken' });
  });

  it('prefers a server-supplied message when present', () => {
    const result = normalizeError({ response: { status: 500, data: { message: 'Database is down' } } });
    expect(result.message).toBe('Database is down');
  });

  it('reports a network error when there is no response', () => {
    const result = normalizeError({ request: {} });
    expect(result.status).toBe(0);
    expect(result.message).toMatch(/network error/i);
  });
});
