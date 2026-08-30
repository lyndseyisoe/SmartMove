# SmartMove Frontend

React frontend for SmartMove — a moving assistant web app. Built with Vite,
Redux Toolkit, React Router, React Hook Form + Zod, Tailwind CSS, and
Google Maps.

This build includes all implemented frontend features. Some pages are
connected to live backend routes, while others are UI-ready and will work
fully once the matching backend endpoints are deployed.

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
  so treat this as a stopgap). Registration accepts an optional `role` field
  (`client`, `mover`, `admin`), defaulting to `client`. Mover accounts are
  created with `pending_approval: true` until an admin approves them. The
  `register` thunk still auto-logs in after signup. Password reset is
  available via `/auth/forgot-password` and `/auth/reset-password`.
- **Get a Quote** (`/client/quote`) — pins pickup/destination on the map,
  collects an address, estimated hours, item count, floor number, and
  elevator access, and calls `POST /quotes/`. Distance is computed
  client-side (`utils/distance.js`, a Haversine calculation mirroring the
  backend's own `maps/service.py`) since the quote endpoint takes a
  distance value rather than coordinates. The response is a full cost
  breakdown (base fee, distance/labour/item/floor charges, total), not a
  single number.
- **Book a Move** (`/client/book`) — creates a booking via `POST /bookings/`.
  The "choose a mover" step now uses a real picker that fetches approved
  movers from `GET /movers` instead of a bare ID field. Bookings can also
  be cancelled with `DELETE /bookings/<id>`.
- **Bookings** (`/client/bookings`) — list and detail pages against
  `GET /bookings/` and `GET /bookings/<id>`. The detail page's "Manage
  booking" panel does a real `PATCH /bookings/<id>` to update status and
  move date, and a cancel button hits `DELETE /bookings/<id>`.
- **Profile / settings** (`/profile`) — view and edit your name and email
  via `GET /profile` and `PATCH /profile`.
- **Movers** (`/movers`) — browse approved movers by name and rating via
  `GET /movers`, selectable when booking a move.
- **Mover portal** (`/mover/*`) — dashboard with stats (`GET
  /mover/dashboard`), job list (`GET /mover/jobs`), and availability toggle
  (`PATCH /mover/availability`).
- **Admin** (`/admin/*`) — user list (`GET /admin/users`), mover approvals
  (`GET /admin/movers`, `PATCH /admin/movers/<id>/approve`), and reports
  (`GET /admin/reports`).
- **Inventory** (`/inventory`) — add and view moving items via
  `GET /inventory` and `POST /inventory`.
- **Reviews** (`/reviews`) — view and submit mover reviews via
  `GET /reviews` and `POST /reviews`.
- **Notifications** (`/notifications`) — list notifications and mark them
  as read via `GET /notifications` and `PATCH /notifications/<id>/read`.
- **Messages** (`/messages`) — send and receive messages via
  `POST /messages` and `GET /messages`, with Socket.IO support for live
  updates.
- **Password reset** — forgot (`POST /auth/forgot-password`) and reset
  (`POST /auth/reset-password`) flows with dedicated pages.
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
| Live tracking | Socket.IO is available, but real-time location sharing has not been implemented yet |
| M-Pesa payments | Intentionally out of scope per the project spec |

When the backend adds one of these, re-add the matching frontend piece
against the real contract rather than restoring the old stubbed version —
route/field names may end up different once they're actually implemented.

## Project structure

```
src/
├── app/              # store, router, route guards
├── features/
│   ├── auth/          # Login, Register, ForgotPassword, ResetPassword, authSlice.js
│   ├── admin/pages/     # Dashboard, Users, Movers, Reports
│   ├── client/pages/    # Dashboard, Quote, Book, Bookings, BookingDetail
│   ├── mover/pages/     # Dashboard, Jobs, Availability
│   ├── profile/pages/   # Settings
│   ├── notifications/pages/ # Notifications
│   ├── reviews/pages/   # Reviews
│   ├── inventory/pages/ # Inventory
│   ├── messages/pages/  # Messages
│   ├── bookings/        # bookingSlice.js
│   ├── quotes/          # quoteSlice.js
│   └── misc/pages/      # Landing, Unauthorized, NotFound
├── components/
│   ├── ui/           # reusable design-system components
│   ├── layout/       # Sidebar, Navbar, DashboardLayout
│   └── maps/         # LocationPicker, MapUnavailable
├── services/
│   ├── api.js          # axios instance, Bearer-token handling, error normalization
│   ├── authApi.js      # register / login / me / forgot-password / reset-password
│   ├── profileApi.js   # get / update profile
│   ├── moversApi.js    # list movers
│   ├── bookingApi.js   # list / get / create / update / delete
│   ├── quoteApi.js     # estimate
│   ├── notificationsApi.js
│   ├── reviewsApi.js
│   ├── inventoryApi.js
│   ├── messagesApi.js
│   ├── adminApi.js
│   └── mappers/        # bookingMapper.js (snake_case <-> camelCase)
├── hooks/
├── utils/            # cn, format, constants, distance (Haversine)
└── styles/           # Tailwind theme + global CSS
```
