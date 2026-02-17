# Pull Request

## 1. Summary

Describe clearly what this PR implements.

Module:
- [ ] Infrastructure
- [ ] Layout
- [ ] Building
- [ ] Room
- [ ] Booking
- [ ] Documentation
- [ ] Refactor

Branch:
feature/

Related Phase:
- [ ] Phase 0 – Infrastructure
- [ ] Phase 1 – Layout
- [ ] Phase 2 – Building
- [ ] Phase 3 – Room
- [ ] Phase 4 – Booking
- [ ] Phase 5 – Release

---

## 2. Scope Definition

This PR includes:

-

This PR does NOT include:

-

No additional architectural changes are introduced.

---

## 3. API Contract Verification

If this PR integrates with backend:

- [ ] Verified endpoint in docs/v1.json
- [ ] Verified request body schema
- [ ] Verified response structure
- [ ] Handles 400 validation errors
- [ ] Handles 409 conflict (if applicable)

---

## 4. Architectural Compliance Checklist

- [ ] Folder structure respected
- [ ] No routing structure modified unintentionally
- [ ] No new global state introduced
- [ ] No new library introduced
- [ ] Axios instance used (no direct fetch)
- [ ] TanStack Query used for server state
- [ ] No business logic inside layout
- [ ] No console.log left in code

---

## 5. UI & UX Checklist

- [ ] Loading state implemented
- [ ] Error state implemented
- [ ] Empty state implemented (if list-based)
- [ ] Mutation disables submit button
- [ ] No layout shift issues
- [ ] No hydration mismatch warnings

---

## 6. Type Safety

- [ ] No TypeScript errors
- [ ] No unnecessary `any`
- [ ] Types centralized in `types/`
- [ ] API response properly typed

---

## 7. Testing & Validation

Manual test performed:

- [ ] Feature works as expected
- [ ] No console errors
- [ ] No network errors
- [ ] Edge cases tested

---

## 8. Commit Standard

- [ ] Uses Conventional Commit format
- [ ] Scope matches module
- [ ] No unrelated changes bundled

Example:

feat(building): implement building list with pagination
fix(booking): handle overlap conflict error

---

## 9. Final Confirmation

I confirm that:

- This PR does not modify unrelated modules.
- This PR respects FRONTEND_ARCHITECTURE.md.
- This PR follows CODING_GUIDELINES.md.
- This PR does not introduce architectural drift.