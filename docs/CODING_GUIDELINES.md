# Coding Guidelines – 2026 Room Booking Frontend

## 1. General Principles

- Code must be deterministic.
- Prefer explicit logic over implicit behavior.
- Avoid hidden side effects.
- Keep components predictable.
- Do not introduce architectural changes without documentation.
- Avoid premature abstraction.

---

## 2. TypeScript Rules

- Strict mode must remain enabled.
- Do not use `any` unless absolutely required.
- Prefer explicit return types for exported functions.
- Use proper interface or type definitions in `types/`.
- Avoid type duplication across modules.
- Do not define large inline types inside components.

Example:

Bad:
function fetchData(): any {}

Good:
function fetchData(): Promise<Building[]> {}

---

## 3. Component Structure

Each component must:

- Have a single responsibility.
- Be under reasonable size (prefer < 200 lines).
- Avoid nested complex logic inside JSX.
- Extract logic into hooks when necessary.

Structure recommendation:

- Imports
- Types
- Constants
- Component
- Helper functions (if needed)

Do not mix unrelated concerns in one file.

---

## 4. Server vs Client Components

Rules:

- Default to Server Component.
- Add `"use client"` only when interaction is required.
- Do not convert entire route to client unnecessarily.
- Do not fetch server data inside client if already fetched on server.

Avoid:

- Fetch in both server and client.
- Using useEffect for initial fetch.

---

## 5. Data Fetching Rules

All API calls must go through:

lib/api/client.ts

Do not:

- Call fetch directly inside UI.
- Call axios directly from page components.
- Store server data in local React state without TanStack Query.

Correct pattern:

- API wrapper in `lib/api/*.api.ts`
- Use TanStack Query inside feature component
- Invalidate queries after mutation

---

## 6. TanStack Query Rules

Allowed:

- useQuery
- useMutation
- query invalidation

Not allowed:

- Manual list mutation without invalidation
- Direct cache manipulation unless justified
- Storing query result in additional state

Example:

After create mutation:
queryClient.invalidateQueries(['buildings'])

---

## 7. Form Handling Rules

Use:

- React Hook Form
- Zod (recommended)

Rules:

- Form state must not control server state.
- Do not submit invalid form.
- Display backend validation errors.
- Keep form logic inside feature module.

Do not:

- Mix form logic inside layout.
- Hardcode validation rules without aligning backend constraints.

---

## 8. File Naming Conventions

Components:
PascalCase

Example:
BuildingTable.tsx
BookingForm.tsx

Hooks:
useCamelCase

Example:
useBuildingQuery.ts

API Files:
lowercase.module.api.ts

Example:
building.api.ts
booking.api.ts

Route files:
page.tsx
layout.tsx

---

## 9. Naming Conventions

Variables:
camelCase

Types:
PascalCase

Enums:
PascalCase

Constants:
UPPER_SNAKE_CASE

Example:

const PAGE_SIZE = 10

---

## 10. Folder Responsibility Enforcement

app/
- Routing only.
- No business logic.

features/
- Domain logic.
- Hooks.
- Feature components.

lib/api/
- Axios client.
- API wrappers.
- No React code.

types/
- Shared DTO definitions.
- API response types.

components/ui/
- shadcn only.
- No business logic.

---

## 11. Error Handling

- Always handle API errors.
- Handle 409 conflict separately.
- Do not swallow errors silently.
- Provide visible UI feedback.
- Do not log errors to console in production.

---

## 12. Loading States

- Show loading state for all queries.
- Disable submit button during mutation.
- Avoid layout shift during loading.
- Do not render empty UI without explanation.

---

## 13. Pagination Rules

- Use backend pagination.
- Do not simulate pagination on frontend.
- Respect backend max limits.
- Reset page when filter changes.

---

## 14. Filtering Rules

- Filtering must reflect backend parameters.
- Do not apply frontend-only filtering for server data.
- Combine filters deterministically.
- Do not mutate filter state inside unrelated components.

---

## 15. Refactoring Rules

- Do not refactor architecture mid-phase.
- Avoid renaming folders without updating documentation.
- Maintain compatibility with previous modules.
- Extract reusable components only when duplication is clear.

---

## 16. Performance Rules

- Avoid unnecessary re-renders.
- Avoid deeply nested inline functions.
- Memoize only when measurable benefit exists.
- Keep table rendering predictable.

---

## 17. Commit Rules

Use Conventional Commit format.

Examples:

feat(building): implement building list page
feat(room): add room creation dialog
fix(booking): handle conflict error 409
refactor(layout): simplify sidebar structure
docs: update frontend architecture documentation

Do not:

- Commit multiple unrelated features in one commit.
- Use vague messages like "update" or "fix bug".

---

## 18. Code Review Self-Checklist

Before pushing:

- No TypeScript errors.
- No console errors.
- No hydration mismatch.
- No unused imports.
- No `any` unless justified.
- Folder structure respected.
- API calls centralized.
- UI consistent with shadcn.

---

## 19. Non-Allowed Libraries

Do not introduce:

- Redux
- Zustand
- MobX
- Global event bus
- Custom fetch wrapper replacing Axios
- Unapproved UI frameworks

---

## 20. Stability Requirement

Architecture must remain stable across phases.

Do not:

- Switch rendering strategy.
- Change routing approach.
- Introduce server actions without approval.
- Introduce new global state system.

All changes must align with:

- FRONTEND_ARCHITECTURE.md
- AI_CONTEXT.md