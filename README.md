# Room Booking System - Frontend

**Next.js web application for managing campus room reservations**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.90.21-FF4154)](https://tanstack.com/query)

---

## About

A modern, type-safe web interface for the Room Booking System. This application provides an intuitive user experience for managing buildings, rooms, and bookings with real-time data synchronization and comprehensive filtering capabilities.

### Key Features

- Full CRUD operations for Buildings, Rooms, and Bookings
- Advanced filtering by building, room, status, borrower name, and date range
- Booking status workflow management (Pending, Approved, Rejected)
- Conflict detection for overlapping bookings
- Asia/Jakarta timezone support for all datetime operations
- Responsive design with modern UI components
- Client-side pagination and real-time data updates

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/2026-room-booking-frontend.git
cd 2026-room-booking-frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your backend API URL

# 4. Run development server
npm run dev

# 5. Open in browser
# Navigate to http://localhost:3000
```

---

## Tech Stack

| Component            | Technology      | Version | Purpose                         |
| -------------------- | --------------- | ------- | ------------------------------- |
| **Framework**        | Next.js         | 16.1.6  | React framework with App Router |
| **UI Library**       | React           | 19.2.3  | Component library               |
| **Language**         | TypeScript      | 5.0     | Type-safe JavaScript            |
| **State Management** | TanStack Query  | 5.90.21 | Server state management         |
| **Forms**            | React Hook Form | 7.71.1  | Form handling and validation    |
| **HTTP Client**      | Axios           | 1.13.5  | API communication               |
| **Styling**          | Tailwind CSS    | 4.0     | Utility-first CSS               |
| **UI Components**    | shadcn/ui       | Latest  | Accessible component library    |
| **Icons**            | Lucide React    | 0.574.0 | Icon system                     |

---

## Architecture

The application follows a feature-based modular architecture with clear separation of concerns:

```
src/
├── app/                    # Next.js App Router pages
│   └── dashboard/          # Protected dashboard routes
├── components/             # Shared components
│   ├── shared/            # Reusable components
│   └── ui/                # shadcn/ui components
├── features/              # Feature modules
│   ├── building/          # Building module
│   ├── room/              # Room module
│   └── booking/           # Booking module
├── lib/                   # Utilities and configurations
│   ├── api/              # API client and wrappers
│   └── hooks/            # Custom React hooks
└── types/                # TypeScript type definitions
```

### Design Patterns

- **Feature Module Pattern**: Each feature (building, room, booking) is self-contained
- **Server State Management**: TanStack Query for caching and synchronization
- **Component Composition**: Reusable components with shadcn/ui primitives
- **Type Safety**: Strict TypeScript configuration with no implicit any
- **API Response Unwrapping**: Centralized Axios interceptor for envelope handling

---

## Getting Started

### Prerequisites

| Tool        | Version | Download                        |
| ----------- | ------- | ------------------------------- |
| **Node.js** | 20+     | [Download](https://nodejs.org/) |
| **npm**     | 10+     | Included with Node.js           |

Verify installations:

```bash
node --version  # Should show v20.x or higher
npm --version   # Should show 10.x or higher
```

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/2026-room-booking-frontend.git
cd 2026-room-booking-frontend

# Install dependencies
npm install
```

### Environment Configuration

Create `.env.local` file in the project root:

```env
# Backend API URL (without /api prefix)
API_BASE_URL=http://localhost:5255/api

# Public API URL for client-side requests
NEXT_PUBLIC_API_BASE_URL=/api
```

The application uses Next.js rewrites to proxy API requests and avoid CORS issues in development.

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start

# Lint code
npm run lint
```

Access the application at `http://localhost:3000`

---

## Project Structure

```
2026-room-booking-frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── buildings/      # Buildings management page
│   │   │   ├── rooms/          # Rooms management page
│   │   │   └── bookings/       # Bookings management page
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── shared/             # TableWrapper, etc.
│   │   └── ui/                 # shadcn/ui components
│   ├── features/
│   │   ├── building/
│   │   │   ├── components/     # BuildingForm, DeleteDialog
│   │   │   └── hooks/          # useBuildingMutations
│   │   ├── room/
│   │   │   ├── components/     # RoomForm, DeleteDialog
│   │   │   └── hooks/          # useRoomMutations
│   │   └── booking/
│   │       ├── components/     # BookingForm, StatusBadge, etc.
│   │       └── hooks/          # useBookingMutations
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts       # Axios instance with interceptors
│   │   │   ├── building.api.ts # Building API wrapper
│   │   │   ├── room.api.ts     # Room API wrapper
│   │   │   └── booking.api.ts  # Booking API wrapper
│   │   └── utils.ts            # Utility functions
│   └── types/
│       ├── building.ts         # Building types
│       ├── room.ts             # Room types
│       └── booking.ts          # Booking types
├── docs/                       # Architecture documentation
├── .env.local                  # Environment variables (gitignored)
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

---

## Key Features Implementation

### Timezone Handling

All datetime operations use **Asia/Jakarta (WIB)** timezone:

- Display: Timestamps shown in id-ID locale with Jakarta timezone
- Input: datetime-local inputs treated as Jakarta time
- Filters: Date range filters converted to UTC for API calls
- Storage: Backend stores in UTC, frontend converts for display

### Client-Side Room Filtering

Backend GET /rooms endpoint does not support buildingId parameter. The application implements client-side filtering by:

1. Fetching all rooms from backend
2. Filtering by buildingId in the client
3. Displaying filtered results

### State Management

TanStack Query provides:

- Automatic request deduplication
- Background refetching
- Cache invalidation on mutations
- Optimistic updates disabled (strict server state sync)
- Query keys pattern: `['resource', { filters }]`

---

## Development Guidelines

### Code Conventions

- **TypeScript**: Strict mode enabled, no any types
- **Component Naming**: PascalCase for components, kebab-case for files
- **API Fields**: snake_case to match backend contract
- **Form Handling**: React Hook Form with manual backend error mapping
- **No Cross-Module Imports**: Features are isolated and self-contained

### Architecture Principles

- Server components by default, add "use client" only when needed
- Business logic in feature modules, not in pages
- API wrappers export functions only (no React hooks)
- Query invalidation instead of manual cache mutation
- Centralized error handling through Axios interceptors

---

## Documentation

For detailed specifications:

- [AI Context](docs/AI_CONTEXT.md) - AI assistant guidelines
- [Frontend Architecture](docs/FRONTEND_ARCHITECTURE.md) - System design
- [Backend Contract](docs/BACKEND_CONTRACT_REFERENCE.md) - API specifications
- [Coding Guidelines](docs/CODING_GUIDELINES.md) - Code standards
- [Feature Template](docs/FEATURE_IMPLEMENTATION_TEMPLATE.md) - Implementation guide

---

## Troubleshooting

### Common Issues

**CORS errors when calling API:**

- Ensure backend is running on http://localhost:5255
- Check Next.js rewrites in next.config.ts
- Verify NEXT_PUBLIC_API_BASE_URL=/api in .env.local

**Room filter not working:**

- This is expected behavior (backend limitation)
- Client-side filtering is implemented
- See room.api.ts for implementation details

**Date filter returns empty results:**

- Ensure dates are in YYYY-MM-DD format
- Check timezone conversion logic in bookings page
- Verify backend is using UTC timestamps

---

## License

This project is licensed under the MIT License.

---

**Version**: 1.0.0  
**Last Updated**: February 2026
