# SmartMove Frontend

React frontend for SmartMove — a moving assistant web app. Built with Vite,
Redux Toolkit, React Router, React Hook Form + Zod, Tailwind CSS, and
Google Maps.

**This build is scoped to match the backend exactly, feature by feature.**
Only what the Flask API actually implements today (`/auth/*`, `/bookings/*`,
`/quotes/*`) has a page in this app. Sections with no backend yet — admin,
inventory, notifications, reviews, profile — were removed
rather than left as dead UI. As the backend adds each feature, the matching
frontend piece gets added back in its own pass. See "What's NOT here" below
for the full list and why.

## Getting started

```bash
npm install
cp .env.example .env   # fill in VITE_API_URL and VITE_GOOGLE_MAPS_API_KEY
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the Flask REST API, e.g. `http://localhost:5000` (no `/api` prefix — the backend mounts routes at root) |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JS API key. The location picker on the Quote page falls back to a placeholder if unset. |

## Scripts

```bash
npm run dev          # start the dev server
npm run build        # production build to dist/
npm run preview      # preview the production build locally
npm run test         # run the Vitest suite once
npm run test:watch   # run tests in watch mode
npm run lint          # oxlint (fast); npx eslint src also available
```

## What's here

- **Auth** — register, login, logout. The backend (`flask-jwt-extended`
  defaults) returns a JWT in the response body rather than setting a
  cookie, so `services/api.js` holds the token in memory and attaches it as
  a Bearer header; `authSlice.js` persists it to `sessionStorage` so a page
  reload doesn't drop the session (there's no refresh-token endpoint yet,
  so treat this as a stopgap). Registration doesn't issue a token, so
  `authSlice.js`'s `register` thunk logs in immediately afterward with the
  same credentials to avoid a separate login step. There's also no `role`
  field on register — the backend always creates a "client" account — so
  there's only one account type right now.
- **Get a Quote** (`/client/quote`) — pins pickup/destination on the map,
  collects an address, estimated hours, item count, floor number, and
  elevator access, and calls `POST /quotes/`. Distance is computed
  client-side (`utils/distance.js`, a Haversine calculation mirroring the
  backend's own `maps/service.py`) since the quote endpoint takes a
  distance value rather than coordinates. The response is a full cost
  breakdown (base fee, distance/labour/item/floor charges, total), not a
  single number.
- **Mover marketplace** (`/client/movers`) — loads registered mover accounts
  from `GET /movers/` and lets a client pass a real mover into the booking
  flow. Ratings and reviews are intentionally not shown until those fields
  exist in the backend.
- **Book a Move** (`/client/book`) — creates a booking via `POST /bookings/`
  after selecting a registered mover.
- **Messages** (`/client/messages`) — clients and movers can exchange
  booking-specific messages through the authenticated `/messages/*` API.
- **M-Pesa checkout** (`/client/bookings/:id/pay`) — starts a server-side
  Daraja STK Push for the booking's stored quote amount and shows the payment
  result after the callback is received.
- **Bookings** (`/client/bookings`) — list and detail pages against
  `GET /bookings/` and `GET /bookings/<id>`. The detail page's "Manage
  booking" panel does a real `PATCH /bookings/<id>` to update status and
  move date.
- **Field mapping** — the backend serializes bookings in snake_case with
  flat lat/lng columns (`moving_date`, `pickup_latitude`, ...) and doesn't
  return mover/client names, cost, or notes. `services/mappers/bookingMapper.js`
  is the one place that translates between that and the camelCase shape
  components use — nothing else in the UI touches backend field names
  directly.
- **Design system** — Tailwind theme tokens matching the SmartMove palette
  (teal/navy/slate), Inter typography, status badge color semantics, and a
  reusable UI kit (`src/components/ui`): Button, Input, Select, Card, Badge,
  Modal, ConfirmDialog, ProgressBar/Steps, EmptyState/ErrorState,
  Spinner/Skeleton, and the `SaveToggle` micro-interaction.
- **Tests** — Vitest + React Testing Library: the login and register flows
  (including the register→auto-login chain and malformed-response
  handling), route-guard redirects, the booking field mapper, the distance
  calculation, and API error normalization.

## What's NOT here (and why)

The backend is being built feature-by-feature, so the frontend only grows
one feature at a time to match. Removed rather than stubbed:

| Feature | Why it's not here |
|---|---|
| Inventory checklist | No `/inventory` routes on the backend |
| Mover portal (dashboard, jobs, availability) | No `/mover/*` routes, and no way to even create a mover account (register has no `role` field) |
| Admin (users, movers, approvals, reports) | No `/admin/*` routes |
| Browsing movers by rating | Ratings/reviews are not implemented yet |
| Real-time messaging notifications | Messages are persisted and available on refresh; Socket.IO is not implemented yet |
| Live tracking | Same — needs Socket.IO, which doesn't exist yet |
| Notifications | No `/notifications` routes |
| Profile / settings | No `/profile` routes |
| Reviews | No review routes |
| Forgot / reset password | No `/auth/forgot-password` or `/auth/reset-password` routes |
| Mover pending-approval status | No such field on the `User` model |
| Cancel a booking | No `DELETE /bookings/<id>` route |
| M-Pesa payments | Intentionally out of scope per the project spec |

When the backend adds one of these, re-add the matching frontend piece
against the real contract rather than restoring the old stubbed version —
route/field names may end up different once they're actually implemented.

## Project structure

```
src/
├── app/              # store, router, route guards
├── features/
│   ├── auth/          # Login, Register, authSlice.js
│   ├── client/pages/    # Dashboard, Quote, Book, Bookings, BookingDetail
│   ├── bookings/          # bookingSlice.js
│   ├── quotes/             # quoteSlice.js
│   └── misc/pages/          # Landing, Unauthorized, NotFound
├── components/
│   ├── ui/           # reusable design-system components
│   ├── layout/         # Sidebar, Navbar, DashboardLayout
│   └── maps/             # LocationPicker, MapUnavailable
├── services/
│   ├── api.js          # axios instance, Bearer-token handling, error normalization
│   ├── authApi.js        # register / login / me
│   ├── bookingApi.js       # list / get / create / update
│   ├── quoteApi.js           # estimate
│   └── mappers/                # bookingMapper.js (snake_case <-> camelCase)
├── hooks/
├── utils/            # cn, format, constants, distance (Haversine)
└── styles/           # Tailwind theme + global CSS
```
