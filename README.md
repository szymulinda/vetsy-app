# Vetsy

Booking platform that connects pet owners with veterinary clinics and groomers. Owners can find a clinic, check its services and reviews and book a visit. Clinics get a dashboard to manage their calendar, patients, services and profile.

## Features

- Search for clinics and groomers with filters and a map
- Clinic profile pages with description, services, reviews and a booking drawer
- Owner account with pets and bookings
- Clinic dashboard: calendar, patients, services and settings
- Authentication with protected routes for the dashboard and account pages
- Responsive layout for mobile and desktop

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, Radix UI components, Lucide icons
- Supabase (PostgreSQL, authentication via `@supabase/ssr`)
- date-fns, Sonner

## Getting started

Requirements: Node.js 18 or newer and a Supabase project.

```bash
npm install
npm run dev
```

The development server runs on http://localhost:3000.

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The database schema is located in `supabase/migrations`.

## Project structure

```
app/                   routes (App Router): search, clinic profile, account, dashboard, auth
components/
  auth/                sign-in and registration form
  dashboard/           clinic dashboard views
  gabinet/             clinic profile sections and booking drawer
  home/                landing page
  konto/               owner account sections
  map/                 clinic map
  szukaj/              search filters and results
  ui/                  shared UI primitives
hooks/                 shared hooks
lib/
  supabase/            Supabase clients, middleware helper and database types
  gabinet/ konto/ szukaj/   data mapping and queries per feature
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
