# Lumos Project Guide

## Project Overview

Lumos is a Bun workspace and Turborepo monorepo for Nossa Causa, a donation campaign platform. The product centralizes physical-item and virtual donation campaigns, campaign discovery, organizer management, public participation data, and transparency information.

The product requirements and feature priorities are documented in [docs/nossa-causa-summary-en.md](docs/nossa-causa-summary-en.md). Read that document before changing campaign behavior or adding product features.

## Issue Tracking

Use the Linear project `38c62f35-8da5-4606-af07-0554669c2481` (LUMOS) as the canonical issue tracker for Lumos. Its team is `Accio Systems Co.` (`ACC`).

## Repository Structure

### Applications

- `apps/web`: The TanStack Start web application, built with Vite, React, TanStack Router, TanStack Query, and Tailwind CSS.
- `apps/web/src/routes`: File-based application routes. The `(auth)`, `(app)`, and `(special)` directories represent route sections.
- `apps/web/src/components`: Reusable application components, including the sidebar, user settings, loading states, and shadcn UI components.
- `apps/web/src/routeTree.gen.ts`: Generated TanStack Router route tree. Do not hand-edit it; route tooling updates it from the route files.

### Shared Packages

- `packages/database`: Prisma client setup, PostgreSQL adapter, Prisma schemas, migrations, and the idempotent database seed.
- `packages/rpc`: oRPC router definitions, procedures, authentication middleware, and server-side services.
- `packages/validation`: Shared Valibot schemas and inferred input types used by the web and RPC layers.
- `packages/auth`: Better Auth configuration and authentication adapters.
- `packages/env`: Typed environment variable definitions grouped by concern, such as database, auth, web, email, RPC, and logging.
- `packages/email`: Email delivery integration.
- `packages/logging`: Shared logging configuration.

### Database

Prisma uses a multi-file schema under `packages/database/prisma/schemas`. The main domain models include authentication, organizers, campaigns, collection points, participants, updates, donations, and accountability records. Prisma configuration is in `packages/database/prisma.config.ts`.

The database seed is deterministic and idempotent. Infrastructure and database changes belong in the database package.

## Environment Variables

Any application or command that needs environment variables must be run through `doppler run -- ...`.

The database requires `DATABASE_URL`, and environment schemas live in `packages/env/src`. Keep secrets out of source files and commits.

Use the existing package scripts and workspace filters. Turbo tasks are declared in `turbo.json`; tasks that mutate or depend on external state must remain uncached.

## Application Conventions

- Keep campaign input validation shared in `packages/validation` and enforce authorization and business rules again in `packages/rpc`.
- Use the authenticated `authorized` procedure for user-scoped campaign operations.
- RPC failures should use `new ORPCError('CODE', { message: 'Meaningful message.' })` so clients receive actionable errors.
- Use TanStack Query for RPC data fetching and invalidate related query keys after mutations.
- Use TanStack Form for complex forms, following the existing sign-up form pattern.
- Prefer existing repository components and utilities over introducing parallel abstractions.
- Preserve responsive layouts and let content flow naturally. Equal-height grids should leave extra space at the bottom rather than inserting artificial spacing between titles, descriptions, and metadata.

## shadcn Components

Files under `apps/web/src/components/ui` are shadcn components and must never be modified directly. Treat their generated implementation as the base component.

Customize shadcn components by iterating on them at the call site: pass `className`, use supported props and variants, or wrap the component with application-specific layout. In other words, override classes where the component is used instead of changing the shared shadcn source.

When a missing shadcn component is needed, add it with the shadcn CLI and review the generated result. Do not replace an installed shadcn component with a native control.

## Generated and Sensitive Files

- Do not manually edit `apps/web/src/routeTree.gen.ts`; update route files and let the route generator regenerate it.
- Do not commit secrets, local environment files, generated build output, or database credentials.
- Do not reset or discard unrelated worktree changes. Keep changes scoped to the requested feature.
