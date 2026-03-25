# StaffPortal KE — Agent & Developer Reference

> Living document. Update after every major feature, bug fix, or architectural decision.
> Last updated: March 23, 2026 — Phase 6 in progress

---

## Project Overview

StaffPortal KE is a role-based employee management system built for Nairobi SMEs. It is a portfolio project being built by victorgogodev under senior dev mentorship.

- **Repo:** https://github.com/victorgogodev/staffportal-ke
- **Stack:** React 18 + Vite + Tailwind CSS v3 (frontend) | Node.js + Express + PostgreSQL + Prisma 5 + JWT (backend)
- **Local ports:** Frontend `5173` | Backend `5000` | PostgreSQL `5432`
- **DB name:** `staffportal_dev`

---

## Monorepo Structure

```
staffportal-ke/
├── frontend/                  # Vite + React
│   ├── src/
│   │   ├── components/        # Shared UI — Sidebar, Topbar, StatCard, RoleBadge
│   │   ├── layouts/           # AuthLayout, DashboardLayout
│   │   ├── pages/             # One file per route
│   │   ├── routes/            # ProtectedRoute, RoleRoute
│   │   ├── services/          # API calls — authService, userService, leaveService, payslipService
│   │   ├── store/             # Zustand — authStore.js
│   │   └── utils/             # roleConfig.js, formatDate.js
│   ├── tailwind.config.js     # Tailwind v3 — DO NOT upgrade to v4
│   └── postcss.config.js
├── backend/                   # Node.js + Express
│   ├── src/
│   │   ├── controllers/       # auth, user, leave, payslip, announcement, audit
│   │   ├── middleware/        # auth.middleware.js — protect + restrictTo
│   │   ├── routes/            # One file per resource
│   │   └── utils/             # prisma.js (singleton), token.js
│   ├── prisma/
│   │   ├── schema.prisma      # Source of truth for DB schema
│   │   ├── migrations/        # Never edit manually
│   │   └── seed.js            # 4 seed users, one per role
│   ├── uploads/               # Multer file storage — gitignored
│   ├── nodemon.json           # Ignores uploads/ to prevent restart loop
│   └── server.js              # Express entry point
└── AGENT.md                   # This file
```

---

## Branch Strategy

```
main        → portfolio-ready only, never commit mid-project
develop     → stable integration branch
feature/*   → active work, merge to develop when complete
```

**Rule:** Never suggest committing or merging directly to `main` mid-project.

---

## Roles & Permissions

| Action | EMPLOYEE | MANAGER | HR | ADMIN |
|---|---|---|---|---|
| View own profile | ✓ | ✓ | ✓ | ✓ |
| Submit leave | ✓ | ✓ | ✓ | ✓ |
| Approve/reject leave | ✗ | ✓ | ✓ | ✓ |
| View all employees | ✗ | ✗ | ✓ | ✓ |
| Upload payslips | ✗ | ✗ | ✓ | ✓ |
| Create announcements | ✗ | ✗ | ✓ | ✓ |
| View audit log | ✗ | ✗ | ✓ | ✓ |

---

## Database Models

### User
```
id, firstName, lastName, email, passwordHash, role, department,
jobTitle, phone, address, employeeId, joinedAt, createdAt, updatedAt
```
Relations: `leaves[]`, `payslips[]`, `announcements[]`, `auditLogs[]`

### Leave
```
id, userId, type (ANNUAL|SICK|COMPASSIONATE), startDate, endDate,
days, reason, status (PENDING|APPROVED|REJECTED), reviewedBy, reviewNote,
createdAt, updatedAt
```

### Payslip
```
id, userId, month (Int), year (Int), fileUrl, uploadedBy, createdAt
```
Files stored in `backend/uploads/` as `payslip-{timestamp}-{random}.pdf`

### Announcement
```
id, title, body, createdBy, createdAt
```

### AuditLog
```
id, userId (nullable), action, detail, createdAt
```

---

## API Endpoints

### Auth — `/api/auth`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/login` | Public | Returns `{ token, user }` |
| GET | `/me` | Protected | Returns current user from token |

### Users — `/api/users`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Protected | Get current user full profile |
| PATCH | `/` | Protected | Update current user profile |
| GET | `/all` | HR/Admin | Get all users for dropdowns |

### Leaves — `/api/leaves`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/` | Protected | Submit leave request |
| GET | `/me` | Protected | Get own leave history |
| GET | `/` | Manager/HR/Admin | Get all leaves |
| PATCH | `/:id/approve` | Manager/HR/Admin | Approve leave |
| PATCH | `/:id/reject` | Manager/HR/Admin | Reject leave (reviewNote required) |

### Payslips — `/api/payslips`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/upload` | HR/Admin | Upload PDF (multipart/form-data) |
| GET | `/me` | Protected | Get own payslips |
| GET | `/` | HR/Admin | Get all payslips |
| GET | `/:id/download` | Owner/HR/Admin | Secure file download |

### Announcements — `/api/announcements`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Protected | Get all announcements |
| POST | `/` | HR/Admin | Create announcement |
| DELETE | `/:id` | HR/Admin | Delete announcement |

### Audit — `/api/audit`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | HR/Admin | Paginated audit log |

---

## Frontend Routes

| Path | Component | Access |
|---|---|---|
| `/login` | LoginPage | Public |
| `/dashboard` | EmployeeDashboard | EMPLOYEE |
| `/manager` | ManagerDashboard | MANAGER |
| `/hr` | HRDashboard | HR |
| `/admin` | AdminDashboard | ADMIN |
| `/profile` | ProfilePage | All |
| `/leave` | LeaveRequestForm | All |
| `/leave/history` | LeaveHistory | All |
| `/leave/approvals` | LeaveApprovals | Manager/HR/Admin |
| `/payslips` | MyPayslips | All |
| `/payslips/upload` | PayslipUpload | HR/Admin |
| `/announcements` | Announcements | All (HR/Admin can create) |
| `/audit` | AuditLog | HR/Admin |

---

## Auth & Security

- JWT signed with `JWT_SECRET`, expires in 7 days, payload: `{ id, email, role }`
- `protect` middleware verifies token on every protected route
- `restrictTo(...roles)` middleware checks role for privileged actions
- Passwords hashed with bcrypt (10 rounds)
- Token stored in `localStorage` — user object also persisted via `safeParse` wrapper
- Axios request interceptor auto-attaches Bearer token on every request
- Axios response interceptor catches 401 globally — clears localStorage and redirects to `/login`
- **Security rule:** frontend RBAC is UX only. Backend always re-validates role.

---

## Key Files

### `frontend/src/store/authStore.js`
Zustand store. Persists `token` and `user` to localStorage. Uses `safeParse` to handle corrupted JSON gracefully. Actions: `login()`, `logout()`, `setUser()`.

### `frontend/src/services/api.js`
Axios instance with base URL `http://localhost:5000/api`. Request interceptor attaches token. Response interceptor handles 401.

### `frontend/src/utils/roleConfig.js`
Single source of truth for nav items. Each item has `label`, `path`, `icon` (Lucide), `allowedRoles`. `getNavItemsForRole(role)` filters for the sidebar.

### `backend/src/utils/prisma.js`
Prisma singleton — prevents connection pool exhaustion in development.

### `backend/src/middleware/auth.middleware.js`
`protect` — extracts and verifies JWT, attaches decoded payload to `req.user`.
`restrictTo(...roles)` — checks `req.user.role` against allowed roles array.

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| React components | PascalCase | `LeaveRequestForm.jsx` |
| Services | camelCase | `leaveService.js` |
| Backend controllers | camelCase | `leave.controller.js` |
| Backend routes | camelCase | `leave.routes.js` |
| DB models | PascalCase | `Leave`, `AuditLog` |
| DB fields | camelCase | `reviewNote`, `createdBy` |
| API routes | kebab-case | `/api/leave-requests` |
| Git branches | kebab-case | `feature/leave-management` |
| Commit messages | Conventional Commits | `feat(frontend): build leave form` |

---

## Seed Users

| Email | Password | Role | Name |
|---|---|---|---|
| employee@staffportal.com | password123 | EMPLOYEE | Alice Kamau |
| manager@staffportal.com | password123 | MANAGER | Brian Otieno |
| hr@staffportal.com | password123 | HR | Carol Wanjiku |
| admin@staffportal.com | password123 | ADMIN | David Mwangi |

---

## Known Gotchas

### Tailwind v4 vs v3
Project uses **Tailwind v3**. Do NOT upgrade to v4 — breaking changes in config and directive syntax. `index.css` must use `@tailwind base/components/utilities`, not `@import "tailwindcss"`. Vite config must NOT include `@tailwindcss/vite` plugin.

### Prisma client staleness
After schema changes, always run `npx prisma migrate dev` from inside `backend/`. If the client seems stale after migration, run `npx prisma generate` explicitly.

### Nodemon restart loop
`uploads/` directory triggers nodemon restarts when files are written. Fixed by `nodemon.json` with `"ignore": ["uploads/*"]`. Never remove this file.

### localStorage user persistence
Zustand resets on page refresh. `user` object must be saved to localStorage in `login()` and `setUser()`. Always use `safeParse()` wrapper when reading from localStorage to handle corrupted JSON.

### JWT role staleness
Role is baked into the JWT at login time. If a user's role changes in the DB, they must log out and back in to get the updated role. Token expires in 7 days.

### `useEffect` dependency arrays
Never nest `useEffect` inside `useState`. Always place hooks at the top level. Fetch effects that call `setUser` must have empty `[]` dependency array to prevent infinite re-render loops.

### NavLink active state with nested routes
`NavLink` marks parent paths active for all child routes by default. Add `end` prop to any nav item whose path is a prefix of another — e.g. `/leave` needs `end` to not stay active when on `/leave/history`.

### File download as blob
Axios must use `responseType: 'blob'` for file downloads. Always `return response.data` from the service function or the blob will be `undefined`.

### Prisma `orderBy` enum values
Prisma `SortOrder` only accepts exactly `'asc'` or `'desc'` — no trailing spaces, no other values.

### Backend path from `__dirname`
Controllers are in `src/controllers/`. To reach `uploads/` use `path.join(__dirname, '../../uploads')`. Verify with `node -e "console.log(path.join(__dirname, '../../uploads'))"` if in doubt.

---

## Phase Completion Status

| Phase | Feature | Status |
|---|---|---|
| 1 | Foundation — monorepo, Vite, Express, Prisma, PostgreSQL | ✅ |
| 2 | Authentication — JWT, bcrypt, RBAC middleware, Zustand, interceptors | ✅ |
| 3 | Dashboards — all 4 role dashboards, DashboardLayout, ProfilePage | ✅ |
| 4 | Leave Management — full request/approval/rejection cycle | ✅ |
| 5 | Payslips — Multer upload, secure download, HR upload form | ✅ |
| 6 | Announcements & Audit Log | 🔄 In progress |
| 7 | Polish & Deployment — Railway + Vercel | ⬜ |

---

## Phase 7 Polish Queue

- Add `.toUpperCase()` to avatar initials in `Topbar.jsx` and `ProfilePage.jsx`
- Add `maxLength={10}` and numeric validation to phone number input in `ProfilePage.jsx`
- Add past date validation to `LeaveRequestForm.jsx` — block start dates in the past
- Add leave spam guard — block new submissions if user has a PENDING request (frontend + backend)
- Add maximum leave days validation — ANNUAL max 21, SICK max 10, COMPASSIONATE max 3 (frontend + backend)

---

## Environment Variables

### backend/.env
```
DATABASE_URL="postgresql://staffportal_user:PASSWORD@localhost:5432/staffportal_dev"
JWT_SECRET="your-secret-here"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

### frontend/.env (if needed)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Git Commit Convention

```
feat(scope):     new feature
fix(scope):      bug fix
chore(scope):    dependencies, config, tooling
style(scope):    formatting, no logic change
refactor(scope): code restructure, no behaviour change
docs(scope):     documentation only
```

Scopes used: `frontend`, `backend`, `auth`, `db`
