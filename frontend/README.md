# SmartMove Frontend

A React frontend for **SmartMove**, a moving-assistant web app: get an
instant quote, book a vetted mover, message them about the move, and pay
via M-Pesa — all in one place.

This app is built to match its Flask backend **exactly, feature by
feature**. Every page here calls a real, working backend endpoint — there
is no mocked data and no page that quietly does nothing. As the backend
adds features, the matching frontend piece gets added in its own pass; see
[What's not here yet](#whats-not-here-yet-and-why) for the current
boundary.

## What you can actually do in this app

- **Register and log in** as a client or a mover
- **Get a quote** — pin pickup/destination on a map, enter move details
  (hours, item count, floor, elevator access), and get a real cost
  breakdown back
- **Browse movers** and see their profile, service area, and pricing
- **Book a move** with a chosen mover
- **View and manage your bookings** — see status, quoted price, update
  status/date
- **Message the other party** on a booking (client ↔ mover), with real
  read receipts
- **Pay for a booking via M-Pesa** (STK push, with live status polling)
- **As a mover**: set up your public profile (company info, service area,
  pricing) so clients can find and book you
- **Reset your password** by email if you forget it

## Getting started

```bash
npm install
cp .env.example .env   # then fill in VITE_API_URL and VITE_GOOGLE_MAPS_API_KEY
npm run dev
```

The app runs at `http://localhost:5173`. You'll need the Flask backend
running too — see `backend/README` or ask whoever maintains it; the short
version is `pipenv install`, set up `backend/.env`, `flask db upgrade`,
then `python run.py` (defaults to `http://localhost:5000`, which is what
this frontend expects out of the box).

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the Flask API, e.g. `http://localhost:5000` (no `/api` prefix — the backend mounts routes at root) |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JS API key, used for the pickup/destination map on the Quote page. Falls back to a placeholder if unset — the rest of the app still works. |

## Scripts

```bash
npm run dev          # start the dev server
npm run build        # production build to dist/
npm run preview      # preview the production build locally
npm run test         # run the Vitest suite once
npm run test:watch   # run tests in watch mode
npm run lint          # oxlint (fast); npx eslint src for the full config
```

## Dependencies

**Runtime**
| Package | What it's for |
|---|---|
| `react`, `react-dom` | UI framework |
| `react-router-dom` | Routing, route guards |
| `@reduxjs/toolkit`, `react-redux` | Auth/booking/quote state |
| `axios` | HTTP client, with a Bearer-token interceptor (see below) |
| `react-hook-form`, `zod`, `@hookform/resolvers` | Form handling and validation |
| `@react-google-maps/api` | Pickup/destination map on the Quote page |
| `tailwindcss`, `@tailwindcss/vite` | Styling |
| `lucide-react` | Icons |
| `sonner` | Toast notifications |
| `date-fns` | Date formatting |
| `clsx` | Conditional class names |

**Dev**
| Package | What it's for |
|---|---|
| `vite`, `@vitejs/plugin-react` | Build tooling |
| `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom` | Testing |
| `eslint` + plugins, `oxlint` | Linting |

## How auth actually works here

The backend (`flask-jwt-extended`, default config) returns a JWT in the
**response body** on login/register — it does not set a cookie. So:

- `services/api.js` holds the token in memory and attaches it to every
  request as `Authorization: Bearer <token>`
- `authSlice.js` also persists it to `sessionStorage`, so a page reload
  doesn't drop your session. There's no refresh-token endpoint on the
  backend yet, so treat this as a stopgap, not a permanent design.
- Registration doesn't issue a token by itself, so `authSlice.js` logs in
  immediately afterward with the same credentials — you never see a
  separate "now log in" step.
- The backend accepts `role: "client"` or `role: "mover"` at registration.
  `admin` accounts can't be created through the UI at all (they're seeded
  directly in the database).

## Project structure

```
src/
├── app/                 # store, router, route guards
├── features/
│   ├── auth/               # Login, Register, Forgot/Reset Password, authSlice.js
│   ├── client/pages/          # Dashboard, Quote, Book, Bookings, BookingDetail,
│   │                           # Messages, Movers, MoverProfile, PaymentCheckout
│   ├── bookings/                # bookingSlice.js
│   ├── quotes/                     # quoteSlice.js
│   └── misc/pages/                    # Landing, Unauthorized, NotFound
├── components/
│   ├── ui/               # reusable design-system components
│   ├── layout/              # Sidebar, Navbar, DashboardLayout
│   └── maps/                   # LocationPicker, RouteMapPicker, MapUnavailable
├── services/
│   ├── api.js               # axios instance, Bearer-token handling, error normalization
│   ├── authApi.js              # register / login / me / forgot-password / reset-password
│   ├── bookingApi.js              # list / get / create / update
│   ├── quoteApi.js                   # estimate
│   ├── moversApi.js                     # browse movers
│   ├── moverProfileApi.js                  # a mover's own profile
│   ├── messagesApi.js                         # conversations, per-booking messages
│   ├── paymentApi.js                             # M-Pesa STK push + status
│   └── mappers/                                     # bookingMapper.js (snake_case <-> camelCase)
├── hooks/
├── utils/                # cn, format, constants, distance (Haversine)
└── styles/               # Tailwind theme + global CSS
```

## Design system

Tailwind theme tokens matching the SmartMove palette (teal/navy/slate),
Inter typography, and status badge colors consistent across the app. The
reusable UI kit lives in `src/components/ui`: `Button`, `Input`, `Select`,
`Card`, `Badge`, `Modal`, `ConfirmDialog`, `ProgressBar`/`Steps`,
`EmptyState`/`ErrorState`, `Spinner`/`Skeleton`, and `SaveToggle`.

## Field mapping

The backend serializes bookings in snake_case with flat lat/lng columns
(`moving_date`, `pickup_latitude`, `quoted_amount`, ...).
`services/mappers/bookingMapper.js` is the one place that translates
between that and the camelCase shape components use — nothing else in the
UI touches backend field names directly. If the backend's booking shape
changes, that's the only file that should need updating.

