# 2026 Room Booking Frontend – AI Agent Context

## Project Overview

This repository contains the frontend application for the Room Booking System.

The backend is implemented using ASP.NET Core and exposes a RESTful API.

This frontend:
- Uses Next.js 16
- Uses App Router (not Pages Router)
- Uses TypeScript (strict mode)
- Uses shadcn/ui as component system
- Uses TanStack Query for server state
- Uses Axios for API communication
- Implements hybrid rendering strategy
- Does not implement authentication
- Directly loads dashboard on root access

This is an admin dashboard application.

---

## Rendering Strategy

The application uses Hybrid Rendering:

- Server Components:
  - Used for initial data fetch
  - Used for layout structure
- Client Components:
  - Used for interactive logic
  - Used for forms
  - Used for filtering and mutations

Rules:
- Do not convert everything into client components.
- Only use `"use client"` when interaction is required.
- Avoid double data fetching.
- Prefer passing `initialData` to client components when needed.

---

## Routing Strategy

Use App Router only.

Never use `pages/` directory.

Route structure:

app/
  layout.tsx
  page.tsx (redirect to /dashboard)
  dashboard/
    layout.tsx
    page.tsx
    buildings/page.tsx
    rooms/page.tsx
    bookings/page.tsx

Routing rules:
- Root path `/` must redirect to `/dashboard`.
- Dashboard layout must persist across nested routes.

---

## Folder Architecture

Use feature-based architecture.

src/
  app/
  components/
    ui/ (shadcn components)
    shared/
  features/
    building/
    room/
    booking/
  lib/
    api/
    hooks/
  types/

Rules:
- Business logic must live inside `features/`.
- API utilities must live inside `lib/api`.
- Shared types must live inside `types/`.
- UI-only components must not contain business logic.

---

## API Integration Rules

Backend returns standardized envelope:

{
  success: boolean,
  message: string,
  data: any,
  errors: object | null
}

Rules:
- Always unwrap `data` from envelope.
- Always handle `success === false`.
- Handle HTTP 409 conflict properly.
- Do not hardcode API URLs.
- Use environment variable:
  NEXT_PUBLIC_API_BASE_URL

Axios instance must:
- Be centralized in lib/api/client.ts
- Include baseURL from environment
- Handle error normalization

---

## State Management

Use TanStack Query for:

- Fetching lists
- Fetching details
- Creating records
- Updating records
- Deleting records
- Invalidating queries

Rules:
- Do not manually mutate lists.
- Always invalidate relevant queries after mutation.
- Avoid useEffect-based data fetching.

---

## Form Handling

Use:
- React Hook Form
- Zod (optional but recommended)

Rules:
- Validate frontend constraints consistent with backend rules.
- Display backend validation errors.
- Do not duplicate business validation logic unnecessarily.

---

## Module Responsibilities

### Building Module
- List buildings
- Create building
- Update building
- Delete building
- Pagination

### Room Module
- List rooms
- Filter by building
- Create room
- Update room
- Delete room
- Pagination

### Booking Module
- List bookings
- Advanced filtering:
  - building_id
  - room_id
  - status
  - borrower_name
  - date range
- Create booking
- Update booking (room_id cannot change)
- Delete booking (soft delete)
- Update booking status (PATCH endpoint)

---

## Constraints

- No authentication
- No role-based access
- No global state library (no Redux, no Zustand)
- No business logic inside layout components
- No direct fetch calls inside random components
- All API calls must go through Axios instance
- All server state must go through TanStack Query

---

## Branching Model

main
develop
feature/*

Rules:
- Work on feature branches only.
- Open PR to develop.
- Do not commit directly to main.
- Use Conventional Commit format.

---

## Definition of Done

A feature is considered complete when:

- UI implemented
- API integrated
- Error handling implemented
- Loading state implemented
- No console errors
- No hydration mismatch
- Code follows folder architecture
- PR merged into develop

---

## Non Goals (Out of Scope)

- Authentication
- Role management
- Real-time updates
- WebSockets
- Global notification system
- Server Actions
- Monorepo configuration
- Microfrontend architecture

---

## AI Agent Instructions

When modifying code:

- Respect folder architecture.
- Do not introduce new architectural patterns without justification.
- Do not switch rendering strategy.
- Do not introduce new libraries without explicit request.
- Keep code deterministic and predictable.
- Prefer explicit over implicit logic.
- Avoid unnecessary abstraction.

If unsure:
- Ask for clarification before refactoring architecture.