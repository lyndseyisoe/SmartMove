# SmartMove

SmartMove is a full-stack moving-assistant web app. It lets a **client**
get an instant quote, find and book a vetted **mover**, message them about
the move, track their belongings, and pay via M-Pesa — all in one place.

The project is split into two independent apps that talk to each other
over a REST API:

```
SmartMove/
├── frontend/   React + Vite single-page app (what the user sees)
└── backend/    Flask REST API (auth, quotes, bookings, payments, etc.)
```

Each folder has its own README with setup instructions and its own
dependency list — see **[frontend/README.md](./frontend/README.md)** and
**[backend/README.md](./backend/README.md)**. This file only covers what
the project *is* and how the two pieces fit together.

## What the app does

- **Auth** — register/log in as a client or a mover, JWT-based sessions
- **Quotes** — pin pickup/destination on a map, enter move details (hours,
  item count, floor, elevator access) and get a real cost estimate
- **Movers** — browse mover profiles (service area, pricing); movers can
  set up and manage their own public profile
- **Bookings** — book a mover, view/manage booking status and date
- **Messaging** — client ↔ mover chat per booking, with read receipts
- **Payments** — pay a booking via M-Pesa (STK Push), with live status
  polling
- **Belongings tracking** — per-booking checklist of items marked
  `packed` → `in_transit` → `delivered`
- **Password reset** — forgot/reset flow over email

## How the two halves talk to each other

- The frontend is a pure client-side app (Vite/React) — it holds no
  secrets and does no server-side rendering.
- It talks to the Flask backend over plain HTTP(S) using its base URL,
  configured via the frontend's `VITE_API_URL` environment variable.
- Auth uses a JWT returned in the response body (not a cookie). The
  frontend attaches it as `Authorization: Bearer <token>` on every
  request afterward.
- Because the two apps live on different origins in production (e.g. a
  Vercel frontend and a Render backend), the backend must have the
  frontend's exact origin listed in its `CORS_ORIGINS` environment
  variable, or the browser will block every request.

## Running the whole thing locally

You need both halves running at the same time:

1. Start the backend first (see `backend/README.md`) — it defaults to
   `http://localhost:5000`.
2. Start the frontend (see `frontend/README.md`) — it defaults to
   `http://localhost:5173` and expects the backend at
   `http://localhost:5000` out of the box.

## Deploying

- **Backend**: any host that can run a Python/WSGI app (e.g. Render).
  Set `APP_ENV=production`, a real Postgres `DATABASE_URL`, random
  32+ character `SECRET_KEY`/`JWT_SECRET_KEY` values, run
  `flask db upgrade`, and serve with a WSGI server such as `gunicorn`.
- **Frontend**: any static host (e.g. Vercel). Set `VITE_API_URL` to the
  deployed backend's URL at build time, then `npm run build` and deploy
  the `dist/` folder.
- Whatever frontend origin you deploy to, add it to the backend's
  `CORS_ORIGINS` (comma-separated if there's more than one).

## Third-party services used

| Service | Used for |
|---|---|
| PostgreSQL | Primary database |
| Google Maps JS API | Pickup/destination map on the Quote page |
| Safaricom M-Pesa (Daraja) | STK Push payments |
| Resend | Transactional email for password resets |

See each app's README for the exact environment variables each of these
services needs.