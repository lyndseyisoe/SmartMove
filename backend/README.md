# SmartMove Backend

A Flask REST API for **SmartMove**, a moving-assistant web app. It handles
auth, quotes, mover profiles, bookings, messaging, M-Pesa payments,
belongings tracking, and password resets for the React frontend.

## Requirements

- Python 3.14 (per `Pipfile`; 3.11+ should also work)
- PostgreSQL (local instance or a hosted one)
- `pipenv` (recommended, matches the included `Pipfile`/`Pipfile.lock`) or
  plain `pip` with `requirements.txt`

## Getting started

```bash
# 1. Install dependencies
pipenv install
# — or, without pipenv —
pip install -r requirements.txt

# 2. Configure environment variables
cp .env.example .env
# then fill in DATABASE_URL, SECRET_KEY, JWT_SECRET_KEY, CORS_ORIGINS, etc.

# 3. Create the database (if it doesn't exist yet), then run migrations
pipenv run flask db upgrade

# 4. (Optional) seed some sample data
pipenv run python seed.py

# 5. Run the dev server
pipenv run python run.py
```

The API runs at `http://localhost:5000` by default (`FLASK_HOST`/`PORT`
env vars). The frontend expects it there out of the box.

## Environment variables

| Variable | Purpose |
|---|---|
| `FLASK_APP` | Entry point (`run.py`) |
| `APP_ENV` | `development` or `production` — `production` enables stricter startup validation |
| `FLASK_DEBUG` | `1` for the Flask debugger/auto-reload in dev, `0` in prod |
| `FLASK_HOST` | Bind address (default `127.0.0.1`) |
| `PORT` | Port to listen on (default `5000`) |
| `SECRET_KEY` | Flask secret key — must be a random 32+ char string in production |
| `JWT_SECRET_KEY` | Signing key for JWTs — must be a random 32+ char string in production |
| `JWT_ACCESS_TOKEN_EXPIRES` | Access token lifetime in seconds (default `3600`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `CORS_ORIGINS` | Comma-separated list of frontend origin(s) allowed to call the API, e.g. `https://your-frontend.vercel.app` |
| `FRONTEND_URL` | Base URL of the frontend, used to build links in password-reset emails |
| `RESET_TOKEN_EXPIRES_MINUTES` | Password reset link validity window (default `30`) |
| `RESEND_API_KEY` | API key for Resend, used to send password-reset emails |
| `RESEND_FROM_EMAIL` | Verified "from" address for those emails |
| `MPESA_ENV` | `sandbox` or `live` |
| `MPESA_CONSUMER_KEY` / `MPESA_CONSUMER_SECRET` | Safaricom Daraja app credentials |
| `MPESA_SHORTCODE` | Till/paybill shortcode (sandbox default `174379`) |
| `MPESA_PASSKEY` | Daraja passkey for STK push |
| `MPESA_CALLBACK_URL` | Public HTTPS URL Safaricom calls back with payment results |
| `GOOGLE_MAPS_API_KEY` | Used server-side for any map/geocoding features |

In production (`APP_ENV=production`), the app refuses to start if
`DATABASE_URL`, `SECRET_KEY`, or `JWT_SECRET_KEY` are missing, or if the
two secret keys are shorter than 32 characters.

## Dependencies

| Package | What it's for |
|---|---|
| `Flask` | Web framework |
| `Flask-SQLAlchemy`, `SQLAlchemy`, `psycopg2-binary` | ORM and PostgreSQL driver |
| `Flask-Migrate`, `alembic` | Database migrations |
| `Flask-Bcrypt`, `bcrypt` | Password hashing |
| `Flask-JWT-Extended`, `PyJWT` | JWT-based auth |
| `flask-cors` | Cross-origin requests from the frontend |
| `python-dotenv` | Loads `.env` in development |
| `gunicorn` | Production WSGI server |
| `pytest` (dev only) | Test runner |

## Scripts / common commands

```bash
python run.py                 # start the dev server
flask db migrate -m "message" # generate a new migration after model changes
flask db upgrade               # apply migrations
python seed.py                  # populate sample data
pytest                            # run the test suite
```

## Project structure

```
app/
├── __init__.py        # app factory: extensions, blueprints, health checks, error handlers
├── config.py           # env-driven configuration + production validation
├── extensions.py        # db, migrate, cors, bcrypt, jwt singletons
├── auth_email.py          # password-reset email sending (Resend)
├── users/                  # auth: register, login, me, forgot/reset password
├── movers/                  # mover model + profile routes
├── quotes/                   # quote estimation service + routes
├── bookings/                   # booking routes
├── messages/                     # per-booking messaging
├── payments/                      # M-Pesa STK push + callback handling
├── inventory/                      # belongings/tracking items model + routes
├── tracking/                        # tracking status routes
├── reviews/                           # mover reviews
├── admin/                              # admin-only routes
├── maps/                                # geocoding/distance helper service
└── models/                               # shared SQLAlchemy models
migrations/             # Alembic migration scripts
seed.py                 # sample data seeding script
run.py                  # app entry point
tests/                  # pytest suite
```

## Health checks

- `GET /` — basic liveness check, always returns `200`
- `GET /health` — readiness check that also queries the database; returns
  `200` when the DB is reachable, `503` otherwise

## Deploying (e.g. Render)

1. Set `APP_ENV=production`, a real Postgres `DATABASE_URL`, and unique
   random 32+ character `SECRET_KEY`/`JWT_SECRET_KEY` values.
2. Set `CORS_ORIGINS` to the deployed frontend's exact origin(s),
   comma-separated, no trailing slashes (e.g.
   `https://your-frontend.vercel.app`).
3. Install dependencies and apply migrations:
   ```bash
   pipenv install --deploy
   pipenv run pip install gunicorn
   pipenv run flask db upgrade
   ```
4. Serve with a production WSGI server:
   ```bash
   pipenv run gunicorn --bind 0.0.0.0:${PORT:-5000} run:app
   ```
5. Set the M-Pesa and Resend variables above for payments/email to work,
   and point `MPESA_CALLBACK_URL` at a public HTTPS URL on this deployment.

If you add a new frontend origin later (e.g. a new Vercel preview
domain), remember to update `CORS_ORIGINS` and restart the service —
otherwise the browser will block requests with a CORS error even though
the API itself is working fine.