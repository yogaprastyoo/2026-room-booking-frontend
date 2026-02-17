# Claude Agent Workflow – 2026 Room Booking Frontend

## 1. Purpose

This document defines how AI agents (e.g., Claude Sonnet 4.5) must interact with this repository.

The goal is to:
- Preserve architectural stability
- Avoid uncontrolled refactoring
- Ensure deterministic code generation
- Maintain consistency across modules

---

## 2. Mandatory Context Files

Before generating or modifying code, the AI agent must consider:

- AI_CONTEXT.md
- FRONTEND_ARCHITECTURE.md
- CODING_GUIDELINES.md

The agent must not ignore architectural constraints defined in those files.

---

## 3. Interaction Model

All feature work must follow this pattern:

1. Define scope clearly.
2. Confirm affected module.
3. Identify required API endpoints.
4. Identify required folder location.
5. Implement minimal required changes.
6. Do not refactor unrelated code.

The agent must not perform opportunistic refactoring.

---

## 4. Prompting Rules for New Features

When requesting new code from the AI agent, the prompt must include:

- Target module (building, room, booking)
- Target folder
- API endpoint to integrate
- Rendering type (server or client)
- Whether mutation is required
- Whether pagination or filtering is required

Example prompt format:

"Implement booking list page inside features/booking.
Use TanStack Query.
Use centralized Axios.
Follow hybrid rendering.
Do not change folder structure.
Do not introduce new libraries."

---

## 5. Architectural Guardrails

The AI agent must not:

- Change routing structure
- Convert Server Components to Client without reason
- Introduce global state libraries
- Introduce Server Actions
- Replace Axios with fetch
- Move business logic into layout
- Modify folder structure without explicit instruction

If architectural change seems required:
- The agent must stop and ask for clarification.

---

## 6. File Modification Rules

When modifying a file:

- Modify only the requested file.
- Do not rewrite entire modules unless requested.
- Preserve existing logic.
- Do not reformat entire repository unless instructed.

Avoid:
- Large-scale renaming.
- Silent structural reorganization.
- Adding unnecessary abstraction layers.

---

## 7. Feature Implementation Pattern

Every feature implementation must follow:

UI Component
  → TanStack Query
    → API Wrapper
      → Axios Instance
        → Backend

The agent must respect this chain.

No shortcuts allowed.

---

## 8. Refactoring Policy

Refactoring is allowed only when:

- Bug exists.
- Code violates documented architecture.
- Duplication is clear and measurable.

Refactoring is not allowed:

- For aesthetic reasons only.
- To introduce new patterns.
- To “improve” without explicit request.

---

## 9. Error Handling Expectations

AI-generated code must:

- Handle loading states.
- Handle error states.
- Handle HTTP 409 conflict properly.
- Avoid silent failures.
- Avoid swallowing exceptions.

Mutation must:
- Disable submit button while pending.
- Invalidate queries after success.

---

## 10. Query Management Rules

The AI agent must:

- Use stable query keys.
- Avoid dynamic unstable keys.
- Invalidate queries after mutation.
- Avoid manual cache editing.

Example:

queryClient.invalidateQueries(['buildings'])

Not allowed:

queryClient.setQueryData unless explicitly required.

---

## 11. Minimalism Rule

The AI agent must prefer:

- Minimal code.
- Predictable structure.
- Explicit logic.
- Direct solution.

The agent must avoid:

- Over-abstracting.
- Creating generic factories.
- Creating premature reusable patterns.
- Adding extra layers without justification.

---

## 12. Stability Across Phases

Phase progression:

- Phase 0: Infra
- Phase 1: Layout
- Phase 2: Building
- Phase 3: Room
- Phase 4: Booking

The agent must not:
- Jump ahead to future phases.
- Modify earlier phases without instruction.
- Redesign modules mid-phase.

---

## 13. Commit Message Generation

When asked to generate commit message:

- Use Conventional Commit format.
- Scope must match module.
- Keep message concise.
- Avoid narrative text.

Example:

feat(building): implement building list with pagination
feat(room): add building filter dropdown
fix(booking): handle overlap conflict error
docs: update architecture documentation

---

## 14. Debugging Workflow with AI

When debugging:

1. Provide error message.
2. Provide file path.
3. Provide relevant snippet only.
4. Ask targeted question.

Avoid:
- Pasting entire project.
- Asking vague questions.
- Mixing unrelated errors.

---

## 15. When the Agent Must Ask for Clarification

The AI agent must stop and ask if:

- Architecture change is required.
- Folder structure unclear.
- Multiple valid approaches exist.
- API contract unclear.
- Rendering strategy uncertain.

The agent must not guess.

---

## 16. Output Expectations

Generated code must:

- Compile without TypeScript errors.
- Follow folder architecture.
- Use centralized API layer.
- Use TanStack Query for server state.
- Avoid console.log.
- Avoid any unless justified.

---

## 17. Stability Priority

The highest priority is:

Architectural stability over speed of implementation.

The AI agent must prioritize consistency over novelty.