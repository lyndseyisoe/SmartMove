# SmartMove

SmartMove is a moving assistant with a React/Vite frontend and Flask API.

## Features

- **Booking & quotes** — clients can get a quote and book a move
- **Mover profiles** — movers have company info, service area, and pricing
- **M-Pesa payments** — STK Push integration via Safaricom Daraja SDK
- **Belongings tracking** — checklist with packed/in-transit/delivered status
- **Route mapping** — interactive Google Maps pickup/destination picker
- **Password reset** — forgot/reset flow with email tokens

## Production checklist

1. Set `APP_ENV=production`, a PostgreSQL `DATABASE_URL`, and unique random
   values of at least 32 characters for `SECRET_KEY` and `JWT_SECRET_KEY`.
2. Set `CORS_ORIGINS` to the deployed frontend origin(s), comma-separated.
3. Apply database migrations:

   ```bash
   cd backend
   pipenv install --deploy
   pipenv run pip install gunicorn
   pipenv run flask db upgrade
   ```

4. Serve the Flask app with a production WSGI server, for example:

   ```bash
   pipenv run gunicorn --bind 0.0.0.0:${PORT:-5000} run:app
   ```

5. Build the frontend with the production API URL:

   ```bash
   cd frontend
   npm ci
   npm run build
   ```

   Deploy `frontend/dist` behind HTTPS and set `VITE_API_URL` before building.

The backend exposes `/health` as a database readiness check. It returns `200`
when the API can reach its database and `503` otherwise.

## M-Pesa setup

Create a Daraja app and set these environment variables:

- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `MPESA_CALLBACK_URL` — must be a public HTTPS URL
- `MPESA_ENV` — `sandbox` for testing, `live` for production

Test with `MPESA_ENV=sandbox` before switching to `live`.

## Belongings tracking

The tracking feature lets clients add items to a booking and mark them as:
- `packed` — items are packed and ready
- `in_transit` — items are on the way
- `delivered` — items have arrived

Access tracking from the booking detail page via `/client/bookings/:id/tracking`.
