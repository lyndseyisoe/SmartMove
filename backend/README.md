# SmartMove — Backend

Flask API for SmartMove, a moving-services marketplace connecting clients with movers.

## Tech stack

- **Flask** + **Flask-SQLAlchemy** (ORM)
- **PostgreSQL** (via `psycopg2-binary`)
- **Flask-Migrate** / Alembic (database migrations)
- **Flask-JWT-Extended** (authentication)
- **Flask-Bcrypt** (password hashing)
- **Flask-CORS**
- **pytest** (testing)
- Dependency management via **Pipenv**

## Setup

### 1. Install dependencies

```bash
pipenv install --dev
```

### 2. Configure environment variables

Create a `.env` file in `backend/` with at least:

```
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database>
SECRET_KEY=<a long random string>
JWT_SECRET_KEY=<a long random string>
```

Optional variables (defaults shown):

```
APP_ENV=development
JWT_ACCESS_TOKEN_EXPIRES=3600
RESET_TOKEN_EXPIRES_MINUTES=30
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
```

In production (`APP_ENV=production`), `DATABASE_URL`, `SECRET_KEY`, and `JWT_SECRET_KEY` are required, and `SECRET_KEY`/`JWT_SECRET_KEY` must each be at least 32 characters — the app will refuse to start otherwise.

### 3. Set up the database

```bash
pipenv run flask --app "app:create_app" db upgrade
```

This applies all migrations in `migrations/versions/`.

### 4. (Optional) Seed sample data

```bash
pipenv run python seed.py
```

This creates a sample client, an approved mover, a mover pending admin approval, an admin account, a few bookings in different states, a review, and a couple of notifications. See `seed.py` for exact credentials.

### 5. Run the development server

```bash
pipenv run flask --app "app:create_app" run --debug
```

The API will be available at `http://127.0.0.1:5000`.

## Running tests

```bash
pipenv run pytest -v
```

Tests use an in-memory SQLite database and don't touch your configured `DATABASE_URL`.

## API overview

All routes except health checks and `/auth/register` / `/auth/login` require a JWT in the `Authorization: Bearer <token>` header (obtained from `/auth/login`).

| Prefix | Purpose |
|---|---|
| `/auth` | Registration, login |
| `/movers` | Mover profiles, browsing approved movers |
| `/bookings` | Creating and managing bookings |
| `/tracking` | Per-booking item tracking (packed/loaded/etc.) |
| `/inventory` | Client inventory items for a move |
| `/quotes` | Quote/pricing calculation |
| `/messages` | Client–mover messaging |
| `/payments` | Payment handling |
| `/reviews` | Client reviews of movers |
| `/notifications` | In-app notifications |
| `/admin` | Admin-only actions (e.g. mover approval queue) |

## Mover approval workflow

Movers register with `status = "pending"` and are not visible to clients (`/movers/`) or bookable until an admin approves them. A rejected mover (`status = "rejected"`) is blocked from logging in and sees `rejection_reason` on their own profile. Clients and admins are approved immediately on registration.

## Database migrations

Migrations live in `migrations/versions/`. To create a new migration after changing a model:

```bash
pipenv run flask --app "app:create_app" db migrate -m "describe the change"
```

Always review the generated migration file before committing — autogenerate can miss things or get the direction of a change wrong. Apply it locally with `db upgrade` and confirm `db current` matches the expected head before pushing.
