# Lumos agent rules

- Bun/Turborepo monorepo for Nossa Causa donation campaigns. Before product/campaign changes read `docs/nossa-causa-summary-en.md`.
- Canonical tracker: Linear project `38c62f35-8da5-4606-af07-0554669c2481` (LUMOS), team `Accio Systems Co.` (`ACC`). When starting an issue, move it to **In Progress**. When committing or drafting a commit message, include Linear's magic word + issue ID (e.g. `Resolves ACC-123`) when an issue exists.
- Layout: `apps/web` = TanStack Start/Vite/React/Router/Query/Tailwind; routes in `apps/web/src/routes`; reusable components in `apps/web/src/components`. Packages: `database` (Prisma/Postgres/schema/migrations/idempotent seed), `rpc` (oRPC/auth/services), `validation` (shared Valibot schemas/types), `auth` (Better Auth), `env`, `email`, `logging`. Prisma schemas: `packages/database/prisma/schemas`; config: `packages/database/prisma.config.ts`. Put DB/infra work in `packages/database`.
- Commands needing env: `doppler run -- ...`; DB needs `DATABASE_URL`. Env schemas: `packages/env/src`. Use existing scripts/workspace filters. Turbo external-state/mutating tasks must be uncached.
- Campaign inputs: shared validation in `packages/validation`; re-enforce auth/business rules in `packages/rpc`. User-scoped campaign operations use `authorized`. RPC errors: `new ORPCError('CODE', { message: 'Meaningful message.' })`.
- RPC fetching: TanStack Query; invalidate affected keys after mutations. Complex forms: TanStack Form, following signup. Reuse existing components/utilities.
- Keep responsive natural-flow layouts; equal-height grids put surplus space at bottom, never artificially between title/description/metadata.
- Never edit `apps/web/src/components/ui/*`; customize shadcn at call sites/wrappers. Add missing shadcn components via CLI and review output; never substitute an installed one with a native control.
- Never hand-edit `apps/web/src/routeTree.gen.ts`; edit routes and regenerate.
- Never commit secrets, local env files, build output, or DB credentials. Never reset/discard unrelated changes; scope edits to the task.
