# LUC-263 Account Access requireAuth App-Completion Proof Row

- Date: 2026-07-10
- Owner: 09 QVE (QA & Verification Engineer)
- Status: VERIFIED_LOCAL
- Scope: Account access `requireAuth` app-completion/project-truth proof.

## Result

The dispatched [LUC-263](/LUC/issues/LUC-263) gap
`apps/api/src/middleware/requireAuth.ts#requireAuth` is resolved in current
generated project truth.

## Evidence

- Existing direct doc relation:
  `docs/architecture/relations/documentation-links.csv` maps
  `apps/api/src/middleware/requireAuth.ts#requireAuth` to
  `docs/modules/api-auth.md`.
- Existing direct test relation:
  architecture-awareness links `apps/api/src/middleware/requireAuth.test.ts`
  to the middleware entity.
- Focused proof:
  `corepack pnpm --filter api exec vitest run src/middleware/requireAuth.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000`
  passed (`1` file / `9` tests).
- Type/build contract:
  `corepack pnpm --filter api run typecheck` passed.
- Diff hygiene:
  `git diff --check` passed with line-ending warnings only.
- Metadata repair:
  `docs/architecture/scanner-overrides.json` now promotes only
  `apps/api/src/middleware/requireAuth.ts#requireAuth` to `verified` with
  evidence links.
- Generated readback:
  architecture-awareness regenerated with `10643` entities / `34593`
  relations and `entityOverridesApplied=2`; app-completion regenerated with
  `implementedNeedsProof=113` after the previous `114`; project-truth
  regenerated with first gap advanced to
  `apps/api/src/modules/auth/auth.controller.ts#clearSession`.

## QA Acceptance

Pass:

- **Given** a protected dashboard request with a valid Bearer token and no
  cookie, **when** `requireAuth` handles the request, **then** it accepts the
  request and attaches the current user from the auth lookup.
  Evidence: focused middleware test pass.
- **Given** a protected dashboard request with a token signed by the previous
  JWT secret during the rotation window, **when** `requireAuth` handles the
  cookie, **then** it accepts the request and attaches the current user.
  Evidence: focused middleware test pass.
- **Given** invalid, expired, deleted-user, stale-session, missing-token, or
  duplicate-token candidates, **when** `requireAuth` handles the request,
  **then** it fails closed, clears invalid sessions where applicable, or
  prefers the newest valid cookie.
  Evidence: focused middleware test pass.
- **Given** auth user lookup is unavailable, **when** `requireAuth` handles the
  request, **then** it returns `503 Auth service temporarily unavailable`.
  Evidence: focused middleware test pass.

Fail:

- None after final verification.

Blocked:

- Local DB-backed happy-path proof initially failed because Docker Desktop's
  Linux engine pipe was unavailable and no PostgreSQL listener existed on
  `localhost:5432`. The final proof kept the route-level middleware exercise
  and used the existing Prisma spy pattern for user lookup. Prior [LUC-171](/LUC/issues/LUC-171)
  remains the current DB-backed auth route proof.

## Boundary

No runtime product code change, production protected auth/session readback,
secret readback, deploy, restart, rollback, env edit, migration, DB/Redis
mutation, exchange/payment/subscription mutation, order, position, or
live-trading action occurred. Public probe requests made by the project-truth
generator were read-only and returned HTTP `200` for web home, web build-info,
API health, and API ready.

## Residual

The broader Account access backlog remains open. The current first
project-truth gap is `apps/api/src/modules/auth/auth.controller.ts#clearSession`
as `missing_test_link`; it is a separate row for Test Automation Engineer +
QA Regression Lead.
