# SmartMove

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61dafb?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Flask-3.1-000000?logo=flask" alt="Flask" />
  <img src="https://img.shields.io/badge/Tailwind-4.3-38bdf8?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169e1?logo=postgresql" alt="PostgreSQL" />
</p>

SmartMove is a moving assistant web app that helps clients book moves, track belongings, and pay securely with M-Pesa. It pairs a React/Vite frontend with a Flask REST API and PostgreSQL database.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

## Features

- **User authentication** — register, login, logout, forgot/reset password with email tokens
- **Role-based access** — client, mover, and admin roles with protected routes
- **Quote estimator** — interactive Google Maps route picker with Haversine distance calculation and cost breakdown
- **Booking management** — create, list, view, update status, and cancel bookings
- **Mover profiles** — company info, service area, pricing type, and rates
- **Mover marketplace** — browse approved movers and select them during booking
- **Belongings tracking** — checklist with packed/in-transit/delivered status per booking
- **M-Pesa payments** — Safaricom Daraja STK Push integration for booking payments
- **Admin tools** — user management, mover approvals, and reports
- **Password reset** — secure token-based forgot/reset flow via Resend
- **Animated landing page** — polished UI with CSS keyframe animations

## Tech Stack

### Backend
- Flask 3.1
- SQLAlchemy + Flask-Migrate
- Flask-JWT-Extended
- Flask-Bcrypt
- Flask-CORS
- PostgreSQL 17
- Resend (password reset emails)
- Safaricom Daraja (M-Pesa STK Push)

### Frontend
- React 19.2
- Vite 8.2
- Redux Toolkit 2.12
- React Router 7.18
- React Hook Form + Zod
- Tailwind CSS 4.3
- Google Maps JavaScript API
- Axios
- Lucide React icons
- Vitest + React Testing Library

## Project Structure

```
SmartMove/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Flask app factory
│   │   ├── config.py            # Environment configuration
│   │   ├── extensions.py        # Flask extensions init
│   │   ├── auth_email.py        # Resend email integration
│   │   ├── users/
│   │   │   ├── model.py         # User model
│   │   │   └── routes.py        # Auth routes
│   │   ├── bookings/
│   │   │   └── routes.py        # Booking CRUD
│   │   ├── quotes/
│   │   │   └── routes.py        # Quote estimation
│   │   ├── movers/
│   │   │   └── routes.py        # Mover listing
│   │   ├── messages/
│   │   │   └── routes.py        # Messaging
│   │   ├── payments/
│   │   │   ├── routes.py        # M-Pesa STK Push
│   │   │   └── service.py       # Daraja SDK calls
│   │   ├── tracking/
│   │   │   └── routes.py        # Belongings tracking
│   │   ├── inventory/
│   │   │   └── routes.py        # Inventory items
│   │   ├── models/
│   │   │   ├── booking.py       # Booking model
│   │   │   ├── payment.py       # Payment model
│   │   │   ├── message.py       # Message model
│   │   │   └── password_reset.py # PasswordResetToken model
│   │   └── maps/
│   │       └── service.py       # Distance calculation
│   ├── migrations/              # Alembic migrations
│   ├── tests/                   # Backend tests
│   ├── run.py                   # Development entrypoint
│   ├── seed.py                  # Database seeding script
│   └── Pipfile                  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── router.jsx       # React Router config
│   │   │   ├── store.js         # Redux store
│   │   │   └── RouteGuards.jsx  # Auth/role guards
│   │   ├── features/
│   │   │   ├── auth/            # Login, Register, Forgot/Reset Password
│   │   │   ├── client/pages/    # Dashboard, Quote, Book, Bookings, Tracking
│   │   │   ├── mover/pages/     # Mover dashboard, jobs, availability
│   │   │   ├── admin/pages/     # Users, movers, reports
│   │   │   ├── bookings/        # Booking Redux slice
│   │   │   ├── quotes/          # Quote Redux slice
│   │   │   └── misc/pages/      # Landing, Unauthorized, NotFound
│   │   ├── components/
│   │   │   ├── ui/              # Reusable design system
│   │   │   ├── layout/          # Sidebar, Navbar, DashboardLayout
│   │   │   └── maps/            # LocationPicker, RouteMapPicker
│   │   ├── services/            # API clients and mappers
│   │   ├── hooks/               # Google Maps loader hook
│   │   ├── utils/               # Formatting, distance, constants
│   │   └── styles/              # Tailwind theme + global CSS
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── README.md
└── LICENSE
```

## Getting Started

### Prerequisites

- Python 3.14+
- Node.js 18+
- PostgreSQL 17
- Git

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt
# or
pipenv install --dev

# Copy environment file
cp .env.example .env
# Edit .env with your database URL and secrets
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your API URL and Google Maps key
```

### Database Setup

```bash
cd backend

# Run migrations
flask db upgrade

# Seed demo data
python seed.py
```

## Environment Variables

### Backend (`.env`)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/smartmove_db` |
| `SECRET_KEY` | Flask secret key (min 32 chars in production) | `dev-secret-key` |
| `JWT_SECRET_KEY` | JWT signing key (min 32 chars in production) | `dev-jwt-secret-key` |
| `FLASK_DEBUG` | Enable debug mode | `1` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173` |
| `FRONTEND_URL` | Frontend URL for reset links | `http://localhost:5173` |
| `RESET_TOKEN_EXPIRES_MINUTES` | Password reset token expiry | `30` |
| `RESEND_API_KEY` | Resend API key for emails | — |
| `RESEND_FROM_EMAIL` | Sender email for Resend | — |
| `MPESA_CONSUMER_KEY` | Safaricom Daraja consumer key | — |
| `MPESA_CONSUMER_SECRET` | Safaricom Daraja consumer secret | — |
| `MPESA_SHORTCODE` | M-Pesa shortcode | — |
| `MPESA_PASSKEY` | M-Pesa passkey | — |
| `MPESA_CALLBACK_URL` | Public HTTPS callback URL | — |
| `MPESA_ENV` | `sandbox` or `live` | `sandbox` |

### Frontend (`.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key |

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get JWT |
| GET | `/auth/me` | Get current user |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/bookings/` | Create booking |
| GET | `/bookings/` | List user's bookings |
| GET | `/bookings/<id>` | Get booking detail |
| PATCH | `/bookings/<id>` | Update booking |
| DELETE | `/bookings/<id>` | Cancel booking |
| GET | `/bookings/<id>/distance` | Calculate route distance |

### Quotes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/quotes/` | Calculate moving estimate |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/payments/stk-push` | Initiate M-Pesa STK Push |
| GET | `/payments/<id>` | Check payment status |
| POST | `/payments/callback` | M-Pesa callback (public) |

### Tracking
| Method | Endpoint | Description |
|---|---|---|
| GET | `/tracking/booking/<id>` | List tracking items |
| POST | `/tracking/booking/<id>` | Add tracking item |
| PATCH | `/tracking/<id>` | Update item status |
| DELETE | `/tracking/<id>` | Remove item |

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Database readiness check |

## Testing

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm run test        # Run once
npm run test:watch  # Watch mode
npm run lint        # Oxlint
```

## Deployment

1. Set `APP_ENV=production` in backend `.env`
2. Set a PostgreSQL `DATABASE_URL`
3. Set `SECRET_KEY` and `JWT_SECRET_KEY` to unique random values of at least 32 characters
4. Set `CORS_ORIGINS` to your deployed frontend origin(s)
5. Run `flask db upgrade` to apply migrations
6. Serve with Gunicorn: `gunicorn --bind 0.0.0.0:${PORT:-5000} run:app`
7. Build frontend: `npm run build`
8. Deploy `frontend/dist` behind HTTPS

The backend exposes `/health` for load balancer health checks.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
