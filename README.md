# Interactive Dashboard — Backend (Firebase Functions + Express + Firestore)

This backend exposes a small REST API for a “Traffic Dashboard” app:

- Auth via Firebase Authentication (the frontend sends a Firebase **ID token**)
- Data stored in **Firestore**
- Role-based access control (viewer/editor)
- Aggregation endpoint for the chart (daily/weekly/monthly)

The code is organized using a Clean Architecture-ish approach to keep business logic independent from frameworks.

---

## Tech Stack

- Node.js + TypeScript
- Firebase **Cloud Functions (2nd gen)** + Express
- Firestore (via `firebase-admin`)
- CORS support (configurable)
- Minimal, explicit routing + middlewares

---

## Features

### Auth

- `GET /auth/me`
  - Validates the Firebase ID token (`Authorization: Bearer <token>`)
  - Returns user info + role:
    - `viewer` by default
    - `editor` if user email is included in `EDITOR_EMAILS`

### Traffic stats

- `GET /traffic-stats`
  - Supports filters + sorting:
    - `from`, `to` (YYYY-MM-DD)
    - `sortBy = date | visits`
    - `order = asc | desc`

- `GET /traffic-stats/aggregate?granularity=daily|weekly|monthly`
  - Aggregates rows for the chart

- `POST /traffic-stats` _(editor only)_
- `PUT /traffic-stats/:date` _(editor only)_
- `DELETE /traffic-stats/:date` _(editor only)_

---

## Data Model (Firestore)

Collection: `trafficStats`

Each document:

- Document ID: `YYYY-MM-DD` (the date)
- Fields:
  - `date: string` (YYYY-MM-DD)
  - `visits: number`

So a row is basically `{ date, visits }`.

---

## Architecture (Clean-ish)

Top-level folders:

- `domain/`
  - Pure types + interfaces
  - Example: repository interfaces and domain models

- `application/`
  - Use-cases (business logic)
  - Example: “aggregate traffic stats by granularity”, “list traffic stats”, “create/update/delete”

- `infrastructure/`
  - Firestore implementation of repositories
  - Firebase Admin initialization

- `presentation/`
  - Express routes, controllers, middlewares
  - HTTP-specific stuff lives here only

This separation keeps the core logic testable and makes it easy to swap Firestore later if needed.

---

## Environment Variables

### `EDITOR_EMAILS`

Comma-separated list of emails that will be treated as `editor`.

Example: EDITOR_EMAILS=tomas@example.com
,admin@example.com



### `ALLOWED_ORIGINS`
Comma-separated list of allowed origins for CORS.

---

## Local Development (Emulators)

### Prerequisites
- Firebase CLI installed and logged in
- Firestore + Auth emulators enabled

Your `firebase.json` (example) usually exposes:
- Firestore emulator: `127.0.0.1:8085`
- Auth emulator: `127.0.0.1:9099`
- Functions emulator: `127.0.0.1:5001`

### Run emulators
From the folder that contains `firebase.json`:
```bash
firebase emulators:start
```
### Local API base URL

If your function is exported as api, emulator URLs look like:

http://127.0.0.1:5001/<project-id>/<region>/api

Example:

http://127.0.0.1:5001/interactive-dashboard-7add2/europe-west1/api


### Deployment
- Deploy Functions

- Run from the folder that contains firebase.json:
```bash
 firebase deploy --only functions
```
- If you’re using codebases (multi-functions setup), you may need:
```bash
firebase deploy --only functions:default
```

## Routing

### Routes
- `/login`
- `/register`
- `/dashboard`

### Router features
- `BrowserRouter` + `Routes`
- Lazy loading with `React.lazy` + `<Suspense />`
- Route guard:
  - If not authenticated → redirect to `/login`

---

## Auth Flow (Firebase)

### Email/Password
- Register + login using Firebase Auth Web SDK

### Google Login
- `signInWithPopup`

### If Google popup fails on Vercel
You must whitelist your deployed domain:

Firebase Console → **Authentication** → **Settings** → **Authorized domains**  
Add:
- `interactive-dashboard-fe.vercel.app`

Otherwise you’ll get:
- `FirebaseError: auth/unauthorized-domain`

---

## Dashboard (Table + Chart)

### Data fetching
TanStack Query handles:
- List query (table)
- Aggregate query (chart)

### Pagination (10 rows)
The table uses 10 rows per page with **placeholder / keep previous data** to avoid UI flashes when switching pages.

### Mutations
Create/update/delete traffic rows use `useMutation`.

UX pattern:
- **Optimistic update** for the **table**
- **Invalidate/refetch** for the **chart** (aggregation depends on global stats)

### Toasts
- `toast.success(...)` / `toast.error(...)`
- Messages come from API responses where possible

---

## Modal Routing (URL-driven modals)

I wanted modals to be:
- Deep-linkable
- Back/forward friendly
- Refresh-safe

So modals are controlled via `URLSearchParams`, for example:
- `?modal=create`
- `?modal=edit&date=2026-02-01`
- `?modal=delete&date=2026-02-01`

A `ModalShell` component reads search params and renders the correct dialog.  
Closing a modal = navigate back / remove params.

---

## Role-based UI

The backend returns `role: viewer | editor` on `GET /auth/me`.

Frontend uses that:
- If `viewer`: hide Create/Edit/Delete buttons
- If `editor`: show them and allow mutations

Backend still enforces permissions (frontend is just UX).

---

## Deployment

### Frontend (Vercel)
1. Deploy the Vite app
2. Add all `VITE_*` env vars in Vercel project settings
3. Redeploy (Vercel only injects env vars at build time)