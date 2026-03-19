## Prometheus 2026 – Single Next.js App

This repo now holds **one Next.js (App Router) project** for both the frontend and backend API routes.

### Setup

1. Install deps

```bash
npm install
```

2. Copy envs

```bash
cp .env.example .env.local
# fill MONGODB_URI and JWT_SECRET
```

3. Run dev server

```bash
npm run dev
```

App runs at http://localhost:3000; API routes live under `/api` (e.g., `/api/auth/login`).

### API surface (app/api)

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET/PUT /api/auth/profile`
- `POST /api/payment/submit-utr`, `GET /api/payment/status`
- `GET /api/events/available`, `POST /api/events/register`, `GET /api/events/registered`, `DELETE /api/events/unregister/:eventName`
- `GET /api/health`

All protected routes expect `Authorization: Bearer <token>` headers.
