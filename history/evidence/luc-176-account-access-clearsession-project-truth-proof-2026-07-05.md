# LUC-176 Account Access ClearSession Project-Truth Proof

- Date: 2026-07-05
- Owner: 09 QVE (QA & Verification Engineer)
- Status: VERIFIED_LOCAL
- Scope: Account access `clearSession` app-completion/project-truth proof.

## Result

The dispatched [LUC-176](/LUC/issues/LUC-176) gap
`apps/api/src/middleware/requireAuth.ts#clearSession` is resolved in current
generated project truth.

## Evidence

- Existing direct test relation:
  `docs/architecture/relations/priority-test-links.csv` maps
  `apps/api/src/middleware/requireAuth.ts#clearSession` to
  `apps/api/src/middleware/requireAuth.test.ts`.
- Existing direct doc relation:
  `docs/architecture/relations/documentation-links.csv` maps
  `apps/api/src/middleware/requireAuth.ts#clearSession` to
  `docs/modules/api-auth.md`.
- Existing behavior proof:
  `history/tasks/luc-93-account-access-clear-session-proof-2026-07-04-task.md`
  records focused stale/invalid/expired/deleted-user/missing-token cookie
  clearing proof.
- Fresh focused proof in this heartbeat:
  `corepack pnpm --filter api exec vitest run src/middleware/requireAuth.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000`
  passed (`1` file / `9` tests).
- Metadata repair:
  `docs/architecture/scanner-overrides.json` now promotes only
  `apps/api/src/middleware/requireAuth.ts#clearSession` to `verified` with
  evidence links.
- Generated readback:
  architecture-awareness regenerated with `10623` entities / `34477`
  relations and `entityOverridesApplied=1`; app-completion regenerated with
  `implementedNeedsProof=114` after dropping the target row; project-truth
  regenerated with first gap advanced to
  `apps/api/src/middleware/requireAuth.ts#requireAuth`.

## Boundary

No runtime code, production access, protected account/session readback, secret
readback, deploy, restart, rollback, env edit, migration, DB/Redis mutation,
exchange/payment/subscription mutation, order, position, or live-trading action
occurred. Public probe requests made by the project-truth generator were
read-only and returned HTTP `200` for web home, web build-info, API health, and
API ready.

## Residual

The broader Account access backlog remains open. The current first project-truth
gap is `apps/api/src/middleware/requireAuth.ts#requireAuth` as
`implemented_needs_proof`; it is a separate row and should be handled by the
next QA/Project Manager proof slice.
