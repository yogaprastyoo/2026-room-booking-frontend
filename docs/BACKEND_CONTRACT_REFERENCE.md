# Backend Contract Reference – 2026 Room Booking System

## 1. Source of Truth

The backend API contract is defined in:

docs/v1.json

This file contains the OpenAPI specification generated from the ASP.NET backend.

This file is the single source of truth for:

- Endpoint paths
- HTTP methods
- Request body schemas
- Query parameters
- Response schemas
- Status codes

No endpoint structure should be guessed or assumed.

---

## 2. General API Structure

All endpoints follow RESTful conventions.

Base URL is defined via:

NEXT_PUBLIC_API_BASE_URL

Frontend must not hardcode base URL.

All API responses follow standardized envelope:

{
  success: boolean,
  message: string,
  data: any,
  errors: object | null
}

Frontend must:
- Always unwrap `data`
- Check `success`
- Handle `errors` properly

---

## 3. Module Endpoints Overview

Refer to docs/v1.json for exact details.

### 3.1 Building

Expected endpoints (verify in OpenAPI):

- GET /buildings
- GET /buildings/{id}
- POST /buildings
- PUT /buildings/{id}
- DELETE /buildings/{id}

Constraints:
- name: required, max length 100
- code: required, max length 20
- name must be unique
- code must be unique

Deletion rule:
- Cannot delete building if rooms exist (expect conflict response)

---

### 3.2 Room

Expected endpoints (verify in OpenAPI):

- GET /rooms
- GET /rooms/{id}
- POST /rooms
- PUT /rooms/{id}
- DELETE /rooms/{id}

Constraints:
- building_id: required
- name: required, max length 100
- capacity: optional, must be positive if provided
- Unique constraint: (building_id, name)

Deletion rule:
- Cannot delete room if active bookings exist

---

### 3.3 Booking

Expected endpoints (verify in OpenAPI):

- GET /bookings
- GET /bookings/{id}
- POST /bookings
- PUT /bookings/{id}
- DELETE /bookings/{id}
- PATCH /bookings/{id}/status (verify exact path in OpenAPI)

Constraints:
- room_id: required
- borrower_name: required, max length 100
- booking_start: required
- booking_end: required
- booking_end must be greater than booking_start
- notes: optional, max length 500
- status: enum (Pending, Approved, Rejected)

Conflict rule:
- Overlapping Approved bookings must return HTTP 409

Soft delete:
- DELETE should not permanently remove data
- Soft deleted records must not appear in GET results

---

## 4. Filtering & Pagination

Refer to docs/v1.json for exact query parameters.

Expected filtering behavior for Booking:

- building_id
- room_id
- status
- borrower_name (partial search)
- start_date
- end_date

Rules:

- Filtering must be backend-driven.
- Frontend must not simulate filtering.
- Pagination must use backend pagination fields.
- Frontend must not guess page size limits.

---

## 5. Status Codes Handling

Frontend must handle:

200 OK
201 Created
204 No Content
400 Validation Error
404 Not Found
409 Conflict
500 Internal Server Error

Specific handling:

409:
- Must display meaningful conflict message
- Must not crash UI

400:
- Display validation errors clearly

---

## 6. Validation Alignment Rule

Frontend validation must align with backend validation but must not:

- Duplicate complex business logic
- Assume undocumented constraints
- Hardcode enum values unless confirmed in OpenAPI

If enum exists in OpenAPI:
- Extract allowed values explicitly

---

## 7. API Wrapper Pattern

Each module must have API wrapper file:

lib/api/building.api.ts
lib/api/room.api.ts
lib/api/booking.api.ts

Each file must:

- Export functions only
- Not contain React logic
- Not contain UI logic
- Use centralized Axios instance

Example:

getBuildings(params)
createBuilding(data)
updateBuilding(id, data)
deleteBuilding(id)

---

## 8. OpenAPI Usage Rules

When implementing a feature:

1. Open docs/v1.json
2. Verify:
   - Endpoint path
   - Method
   - Required parameters
   - Request schema
   - Response schema
3. Generate types accordingly
4. Do not assume fields
5. Do not ignore nullable properties

If discrepancy exists between documentation and behavior:
- Treat OpenAPI as source of truth
- Do not modify frontend logic based on assumption

---

## 9. Type Generation Strategy

Types must reflect:

- Request DTO
- Response DTO
- Pagination structure (if defined)

If OpenAPI types are complex:
- Extract only necessary fields
- Keep type definitions centralized in `types/`

Do not duplicate type definitions inside feature components.

---

## 10. Versioning Awareness

This document refers to:

OpenAPI version defined in docs/v1.json

If backend version changes:

- Update v1.json
- Review breaking changes
- Update types
- Update API wrappers
- Update frontend modules accordingly

Do not silently adapt to breaking backend changes.

---

## 11. AI Agent Contract Enforcement

When implementing API integration:

- Always verify against docs/v1.json
- Do not guess request body shape
- Do not invent optional fields
- Do not rename fields from backend
- Maintain exact casing defined in API

If uncertain:
- Stop and request clarification