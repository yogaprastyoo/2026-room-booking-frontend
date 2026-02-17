# Frontend Architecture – 2026 Room Booking System

## 1. Technology Stack

Framework:
- Next.js 16
- App Router
- TypeScript (strict mode enabled)

UI:
- shadcn/ui
- Tailwind CSS (default from Next.js setup)
- Lucide icons

Data Layer:
- Axios (HTTP client)
- TanStack Query (server state management)

Forms:
- React Hook Form
- Zod (optional, recommended for schema validation)

---

## 2. Architectural Principles

The frontend follows these principles:

1. Feature-based modular architecture
2. Hybrid rendering strategy
3. Separation of concerns
4. Deterministic data flow
5. No hidden global state
6. No business logic inside layout components
7. Centralized API communication

The frontend mirrors backend domain structure:
Building → Room → Booking

---

## 3. Rendering Strategy

Hybrid Rendering:

- Server Components:
  - Used for layout
  - Used for initial data fetch
- Client Components:
  - Used for interactivity
  - Used for forms
  - Used for filtering
  - Used for mutations

Rules:
- Do not convert all pages into client components.
- Use `"use client"` only when required.
- Avoid double-fetching data.
- Prefer passing `initialData` to client components when applicable.
- Do not mix server fetch and client fetch without clear purpose.

---

## 4. Routing Structure (App Router Only)

Never use `pages/` directory.

Structure:

app/
  layout.tsx
  page.tsx (redirect to /dashboard)
  dashboard/
    layout.tsx
    page.tsx
    buildings/page.tsx
    rooms/page.tsx
    bookings/page.tsx

Rules:
- Root path `/` must redirect to `/dashboard`.
- Dashboard layout must persist across nested routes.
- Do not place business logic inside routing files.
- Route files should orchestrate components, not implement domain logic.

---

## 5. Folder Structure

src/
  app/
  components/
    ui/
    shared/
  features/
    building/
    room/
    booking/
  lib/
    api/
    hooks/
  types/

Explanation:

app/
- Routing layer only.
- Layout and page orchestration.
- No business logic.

components/ui/
- shadcn components only.
- No domain logic.

components/shared/
- Reusable UI wrappers.
- No domain logic.

features/
- Domain modules.
- Contains business-related UI logic.
- May contain:
  - components
  - hooks
  - services
  - validation schemas

lib/api/
- Axios instance
- API wrappers
- No UI logic

lib/hooks/
- Generic reusable hooks
- No domain-specific mutation logic

types/
- Shared TypeScript interfaces
- DTO representations
- API response types

---

## 6. Data Flow Architecture

Standard data flow:

UI Component
  → TanStack Query
    → Axios
      → Backend API

Rules:
- Do not call Axios directly from UI components.
- Wrap API calls inside reusable functions.
- Always invalidate queries after mutation.
- Never manually update query cache without strong reason.
- Avoid useEffect-based manual data fetching.

---

## 7. API Layer Structure

lib/api/
  client.ts
  building.api.ts
  room.api.ts
  booking.api.ts

client.ts:
- Axios instance
- baseURL from environment variable
- Response normalization
- Error normalization

Feature API files:
- Export functions only.
- No React code.
- No UI logic.

Example pattern:

getBuildings(params)
createBuilding(data)
updateBuilding(id, data)
deleteBuilding(id)

---

## 8. State Management Rules

TanStack Query is the only server-state manager.

Allowed:
- useQuery
- useMutation
- query invalidation

Not allowed:
- Global state libraries
- Manual state syncing across modules
- Storing server data inside React local state unnecessarily

Local state allowed only for:
- Form state
- UI state (modal open, filters before submission, etc.)

---

## 9. Error Handling Strategy

Backend response envelope:

{
  success: boolean,
  message: string,
  data: any,
  errors: object | null
}

Frontend rules:

- Always check success flag.
- Handle HTTP 409 separately (conflict).
- Display validation errors clearly.
- Do not swallow API errors.
- Provide user feedback for failed mutations.

---

## 10. Form Strategy

Use:
- React Hook Form
- Zod (recommended)

Rules:
- Match backend validation constraints.
- Display backend validation errors.
- Do not duplicate complex business validation logic.
- Do not allow mutation if form is invalid.

---

## 11. Module Responsibilities

Building:
- List
- Create
- Update
- Delete
- Pagination

Room:
- List
- Filter by building
- Create
- Update
- Delete
- Pagination

Booking:
- List
- Advanced filtering
- Create
- Update
- Delete (soft delete)
- Status update (PATCH)

---

## 12. Performance Guidelines

- Avoid unnecessary re-renders.
- Avoid nested client components without reason.
- Use Suspense only when needed.
- Keep table rendering predictable.
- Avoid heavy abstraction layers.

---

## 13. Code Quality Rules

- Strict TypeScript.
- No `any` unless absolutely required.
- No unused imports.
- No console logs in production code.
- Use explicit return types for exported functions.
- Keep components under reasonable size.

---

## 14. Scalability Guidelines

Future-ready decisions:

- Architecture supports adding authentication later.
- Layout supports adding role-based navigation later.
- API layer supports adding interceptors later.
- No coupling between modules.

---

## 15. Prohibited Patterns

- Mixing UI and API logic in the same file.
- Placing fetch logic inside layout.
- Introducing Redux/Zustand.
- Creating custom global event bus.
- Hardcoding API endpoints.
- Adding new libraries without documented reason.

---

## 16. Architecture Change Policy

If architectural changes are required:

- Document the reason.
- Evaluate impact on folder structure.
- Avoid spontaneous refactors.
- Maintain backward compatibility inside current phase.

Architecture must remain stable across phases.