# SmartMove

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61dafb?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Flask-3.1-000000?logo=flask" alt="Flask" />
  <img src="https://img.shields.io/badge/Tailwind-4.3-38bdf8?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169e1?logo=postgresql" alt="PostgreSQL" />
</p>

## Features

- **Booking & quotes** — clients can get a quote and book a move
- **Mover profiles** — movers have company info, service area, and pricing
- **M-Pesa payments** — STK Push integration via Safaricom Daraja SDK
- **Belongings tracking** — checklist with packed/in-transit/delivered status
- **Route mapping** — interactive Google Maps pickup/destination picker
- **Password reset** — forgot/reset flow with email tokens

## Production checklist

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
