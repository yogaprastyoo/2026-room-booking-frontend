# Release Guidelines – 2026 Room Booking Frontend

## 1. Release Philosophy

Releases must be:

- Stable
- Deterministic
- Fully integrated
- Free from console errors
- Architecturally consistent

No release should introduce structural instability.

---

## 2. Branch Strategy

Active development:
feature/* → develop

Stable release:
develop → main

Rules:
- Never commit directly to main.
- Only merge develop to main when release criteria are met.
- Use Squash & Merge for feature branches.

---

## 3. Semantic Versioning

Version format:

MAJOR.MINOR.PATCH

Example:
v1.0.0

Meaning:
- MAJOR: breaking changes
- MINOR: new features (backward compatible)
- PATCH: bug fixes

---

## 4. Initial Release (v1.0.0) Criteria

v1.0.0 may only be created when:

Phase 0 – Infrastructure complete
Phase 1 – Layout complete
Phase 2 – Building module complete
Phase 3 – Room module complete
Phase 4 – Booking module complete

All modules must:

- Integrate with backend
- Handle errors properly
- Handle loading states
- Have no TypeScript errors
- Have no console errors
- Respect architecture documentation

---

## 5. Pre-Release Checklist

Before merging develop → main:

- [ ] All feature branches merged into develop
- [ ] All PR checklists satisfied
- [ ] Manual end-to-end test performed
- [ ] No hydration mismatch warnings
- [ ] No API contract mismatches
- [ ] All documentation updated
- [ ] CHANGELOG.md updated

---

## 6. Release Process

Step 1:
Ensure develop branch is stable.

Step 2:
Merge develop → main.

Step 3:
Create Git tag:

git tag v1.0.0
git push origin v1.0.0

Step 4:
Create GitHub Release using tag.

---

## 7. Post-Release Rules

After release:

- New features must increment MINOR.
- Bug fixes increment PATCH.
- Breaking API changes require MAJOR increment.

Do not:
- Re-tag existing version.
- Modify main without version increment.
- Release unstable develop branch.

---

## 8. Breaking Change Policy

If backend contract changes:

- Update docs/v1.json
- Update types
- Update API wrappers
- Update affected modules
- Increment MAJOR version

Breaking changes must never be hidden.

---

## 9. Stability Requirement

A release is considered valid only if:

- Architecture remains consistent
- No new global state introduced
- No rendering strategy changes
- No folder structure changes
- All modules functional

Stability takes priority over speed of release.