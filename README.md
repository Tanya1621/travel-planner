# Travel Planner

A Next.js UI for planning trips and sketching a daily itinerary. This is the first slice: client-only, with data in React context and `localStorage`. A database will replace that later.

## What it does

- Create trips (name, destination, dates)
- Open a trip at `/trips/[tripId]`
- Add unscheduled activities (title, notes, optional link)
- Place activities on a day and time block (morning / afternoon / evening) by drag-and-drop or Schedule

Data stays in the browser:

- `travel-planner-trips`
- `travel-planner-activities`

Clearing site data removes trips and activities.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

Requires Node from `.nvmrc` if you use nvm.

## Stack

- Next.js 16 (App Router) and React 19
- Tailwind CSS 4
- `@dnd-kit/react` for drag and drop
- TypeScript

## Layout

```
src/
  app/                  routes (`/` and `/trips/[tripId]`)
  components/trips/     dashboard, cards, create form, trip page
  components/planner/   activity list, day board, drag-and-drop
  context/              trips and activities (localStorage)
  types/                Trip and Activity
  lib/dates.ts          day lists and date formatting
```

`Trip` and `Activity` (`tripId`, nullable `date` / `timeBlock`, `position`) are shaped so they can move to tables later. UI currently reads and writes through context hooks.