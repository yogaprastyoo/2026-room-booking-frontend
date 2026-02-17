# Feature Implementation Template – 2026 Room Booking Frontend

This template must be used when requesting AI agent to implement a new feature.

The goal is to:
- Define scope clearly
- Avoid architectural drift
- Ensure consistent implementation pattern
- Prevent unintended refactoring

---

## 1. Feature Metadata

Feature Name:
Module:
Target Route:
Branch Name:
Rendering Type: (Server / Client / Hybrid)
Requires Mutation: (Yes / No)
Requires Pagination: (Yes / No)
Requires Filtering: (Yes / No)

---

## 2. Scope Definition

Clearly define what is included:

Included:
- 

Not Included:
- 
- 

No additional features beyond this scope are allowed.

---

## 3. API Contract

Endpoint(s):
- 

HTTP Method:
- 

Request Body:
- 

Response Structure:
{
  success: boolean,
  message: string,
  data: any,
  errors: object | null
}

Error Cases:
- 400 validation error
- 409 conflict (if applicable)
- 500 server error

---

## 4. Folder Placement

All new files must follow:

- Routing: `app/`
- Feature logic: `features/<module>/`
- API wrappers: `lib/api/`
- Shared types: `types/`

No deviation allowed.

---

## 5. Implementation Pattern

Follow this data flow strictly:

UI Component  
→ TanStack Query  
→ API Wrapper  
→ Axios Instance  
→ Backend

Do not:
- Call Axios directly from UI
- Use fetch instead of Axios
- Store server data in local state unnecessarily
- Bypass TanStack Query

---

## 6. Rendering Rules

If Hybrid:

- Server Component:
  - Fetch initial data
- Client Component:
  - Handle interaction
  - Handle mutations
  - Handle filtering

If Client-only:
- Add `"use client"`
- Use TanStack Query
- Handle loading and error states

Never convert entire module into client unless necessary.

---

## 7. UI Requirements

Must include:

- Loading state
- Error state
- Empty state (if list-based)
- Disabled state during mutation
- Clear validation messages

Must use:
- shadcn components
- Consistent layout structure

---

## 8. Validation Rules

Frontend validation must:

- Align with backend constraints
- Not duplicate complex business rules
- Display backend validation errors clearly

If using Zod:
- Schema must reflect backend DTO

---

## 9. Mutation Rules (If Applicable)

After successful mutation:

- Invalidate relevant query keys
- Do not manually update cache unless justified
- Close modal/dialog
- Reset form state

Conflict (409):
- Must display clear message
- Must not crash UI

---

## 10. Query Key Rules

Query keys must be:

- Stable
- Predictable
- Module-scoped

Example:
['buildings']
['rooms', { buildingId }]
['bookings', filters]

Avoid:
- Random dynamic strings
- Overly complex nested keys

---

## 11. Performance Constraints

Do not:

- Add unnecessary memoization
- Introduce global state
- Create abstraction layers not needed
- Create reusable components prematurely

Keep implementation minimal and explicit.

---

## 12. Completion Checklist

Before marking feature complete:

- No TypeScript errors
- No console errors
- No hydration mismatch
- No unused imports
- Folder structure respected
- API integration works
- Error handling implemented
- Loading state implemented
- PR ready for develop branch

---

## 13. AI Execution Instruction Block

When sending request to AI, use:

Implement the feature strictly following:
- FRONTEND_ARCHITECTURE.md
- CODING_GUIDELINES.md
- CLAUDE_AGENT_WORKFLOW.md

Do not refactor unrelated files.
Do not introduce new libraries.
Do not change folder structure.
Do not modify architecture.
Only implement defined scope.