# Project Architecture Map: MAAS (Medical Appointment Assistant Solution)

This document serves as the single source of truth for the system design, boundaries, and architectural patterns of the MAAS project.

---

## 1. High-Level System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer (SPA)                     │
│       Vite 8 + React 19 + TypeScript + Tailwind CSS v4      │
│  [Pages: Login, Register, Forgot/Reset Password, Dashboard] │
└──────────────────────────────┬──────────────────────────────┘
                               │
                      HTTPS / JSON REST API
                  (CORS: AllowReactApp Policy)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API (Web Service)                 │
│              ASP.NET Core 10 Web API (net10.0)              │
│       - Middleware (CORS, HttpsRedirection, OpenAPI)        │
│       - Auth & Role Separation (Private Patient / Practice) │
│       - Appointments, Medications & Prescriptions Services  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data & Persistence Layer                  │
│       - Relational Database / EF Core Context               │
│       - Project & Issue State: Beads (`bd` Dolt DB)         │
└─────────────────────────────────────────────────────────────┘
```

## 2. Core Tech Stack & Dependencies

- **Frontend (`Src/MAASFrontend`):**
  - **Framework & Runtime:** React 19 (`react` 19.2.7, `react-dom` 19.2.7) with Vite 8 (`vite` 8.1.1, `@vitejs/plugin-react` 6.0.3)
  - **Language:** TypeScript 6 (`~6.0.2`, strict typing, `tsconfig.app.json`, `tsconfig.node.json`)
  - **Styling:** Tailwind CSS v4 (`@tailwindcss/vite` 4.3.3, `tailwindcss` 4.3.3) with `@theme` design variables
  - **Design System & Tokens:** Unified Design Tokens (`@/tokens/design-tokens.ts`) matching Figma specifications (colors, spacing, typography, radii, shadows)
  - **Class Utilities:** `clsx`, `tailwind-merge` combined in `cn()` (`@/utils/cs`), `class-variance-authority`
  - **Icons:** `@lineiconshq/react-lineicons`, `@lineiconshq/free-icons`, and custom SVG icon components
  - **Code Quality & Linter:** Oxlint (`oxlint` 1.71.0)
- **Backend / APIs (`Src/MAASBackend`):**
  - **Framework & SDK:** ASP.NET Core 10 Web API (`Microsoft.NET.Sdk.Web`, `net10.0`)
  - **Language:** C# 13 / .NET 10
  - **API Documentation & Schema:** OpenAPI (`Microsoft.AspNetCore.OpenApi` 10.0.9, `MapOpenApi()`)
  - **Security & Pipeline:** HTTPS Redirection, Environment-based CORS policy (`AllowReactApp` for `http://localhost:5173`)
- **Database / State:**
  - **Backend State:** Entity Framework Core / SQL persistence for healthcare domain models
  - **Issue Tracking & Project Memory:** Beads (`bd`) utilizing Dolt database (`.beads/`) for durable cross-session memory
- **Infrastructure & Quality Gates:**
  - **Pipelines:** CI/CD workflows under `Piplines/`
  - **Testing:** Automated unit and integration test suites under `Tests/`

## 3. Strict Architectural Rules & Constraints

- **Frontend Standards:**
  - **Path Aliasing:** Always use `@/` for imports relative to `Src/MAASFrontend/src` (e.g. `@/components/...`, `@/tokens/...`, `@/utils/...`).
  - **Design Token Integrity:** Colors, typography, spacing, and border radiuses must align with `@/tokens/design-tokens.ts` and Tailwind `@theme` variables (`--color-primary-*`, `--color-semantic-*`).
  - **Class Composition:** Never concatenate dynamic class names with string interpolation; always use `cn()` from `@/utils/cs`.
  - **Accessibility & Form Controls:** Always use React 19 `useId()` for form element association, support keyboard navigation (e.g., Arrow navigation for SegmentedControl), and include semantic ARIA attributes.
  - **Stateless & Modular Components:** Keep reusable atomic UI elements under `src/components/common/` and layout shells under `src/components/layout/`.
- **Backend Standards:**
  - **Stateless API Design:** API endpoints must remain stateless, relying on tokens/JWTs for authenticated requests.
  - **Separation of Concerns:** Keep controllers/endpoints thin; business logic belongs in domain services.
  - **CORS Configuration:** Explicitly restrict allowed origins and headers; never allow permissive wildcards in production.
  - **Validation & Error Responses:** Use standardized Problem Details (RFC 7807) for error messaging across all endpoints.
- **Task Tracking & Session Memory:**
  - **Always use Beads (`bd`)** for issue tracking (`bd create`, `bd ready`, `bd update --claim`, `bd close`). Never use markdown TODO lists.
  - Record architectural decisions and persistent session knowledge with `bd remember`.

## 4. Key Component Boundaries & Directory Layout

### `Src/MAASFrontend/`
- `src/components/common/`: Primitive reusable UI components (`Button`, `Input`, `DatePicker`, `Paper`, `SegmentedControl`, `SocialLoginButton`, `icons/`).
- `src/components/layout/`: Layout shells and scaffolding.
- `src/pages/`: Feature pages and views (`LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage`).
- `src/tokens/`: Canonical design token definitions (`design-tokens.ts`).
- `src/services/`: API client services for communicating with the ASP.NET Core backend.
- `src/utils/`: Shared utilities (`cs.ts`).

### `Src/MAASBackend/`
- `Program.cs`: Dependency injection, middleware pipeline, OpenAPI, and CORS setup.
- `MAASBackend.csproj`: .NET 10 project definition and package dependencies.
- Domain modules for User Management (Roles: Private vs Practice), Appointments, and Medication/Prescription tracking.

### `Piplines/` & `Tests/`
- `Piplines/`: CI/CD automation pipelines.
- `Tests/`: Quality gates for frontend and backend code.
