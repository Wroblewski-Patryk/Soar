# V1 Closeout Evidence Refresh (2026-05-02)

## Status

`NO-GO`

This refresh supersedes older activation-pack claims for the current
`2026-05-02` candidate. Historical `APPROVED` artifacts remain useful context,
but they must not be treated as current V1 approval while the blockers below
remain open.

## What Was Refreshed

- API closeout gates were restored:
  - `pnpm --filter api run typecheck` => PASS
  - focused API closeout pack => PASS (`8` files / `91` tests)
  - `pnpm --filter api run test -- --run` => PASS
- Documentation parity was restored:
  - `pnpm run docs:parity:check` => PASS
  - `pnpm run quality:guardrails` => PASS
- RC gate truth was synchronized:
  - `pnpm run ops:rc:gates:status` => regenerated
  - `pnpm run ops:rc:checklist:sync` => regenerated
  - `pnpm run ops:rc:gates:summary` => `G1=PASS`, `G2=PASS`,
    `G3=PASS`, `G4=OPEN`
- Restore drills were rerun:
  - local: PASS
  - stage: FAIL, missing `STAGE_DB_CHECK_CONTAINER`
  - prod: FAIL, missing `PROD_DB_CHECK_CONTAINER` or
    `PRODUCTION_DB_CHECK_CONTAINER`
- Release gates were refreshed in dry-run mode:
  - stage dry-run: `not_ready`
  - prod dry-run: `not_ready`

## Current Evidence Artifacts

- Local restore drill PASS:
  - `history/evidence/v1-restore-drill-local-2026-05-02T16-25-05-592Z.md`
  - `history/artifacts/_artifacts-restore-drill-local-2026-05-02T16-25-05-592Z.json`
- Stage restore drill FAIL:
  - `history/evidence/v1-restore-drill-stage-2026-05-02T16-25-14-900Z.md`
  - `history/artifacts/_artifacts-restore-drill-stage-2026-05-02T16-25-14-900Z.json`
- Prod restore drill FAIL:
  - `history/evidence/v1-restore-drill-prod-2026-05-02T16-25-14-914Z.md`
  - `history/artifacts/_artifacts-restore-drill-prod-2026-05-02T16-25-14-914Z.json`
- Stage release rehearsal dry-run `not_ready`:
  - `history/releases/v1-stage-rehearsal-2026-05-02T16-26-15-367Z.md`
  - `history/releases/v1-release-gate-stage-2026-05-02T16-26-15-367Z.md`
- Prod release gate dry-run `not_ready`:
  - `history/releases/v1-release-gate-prod-2026-05-02T16-26-10-063Z.md`
- Current RC status:
  - `docs/operations/v1-rc-external-gates-status.md`
  - `docs/operations/v1-release-candidate-checklist.md`
  - `docs/operations/v1-rc-signoff-record.md`

## Open Blockers

1. Gate 4 is `OPEN` because `docs/operations/v1-rc-signoff-record.md` is still
   `BLOCKED` and lacks named Engineering, Product, Operations, and rollback
   owner sign-offs.
2. Stage restore drill cannot run without `STAGE_DB_CHECK_CONTAINER`.
3. Prod restore drill cannot run without `PROD_DB_CHECK_CONTAINER` or
   `PRODUCTION_DB_CHECK_CONTAINER`.
4. Prod rollback proof is stale relative to the 2026-05-02 candidate.
5. Activation audit and activation plan filenames are still dated
   `2026-04-22`, so the release gate classifies them as stale for a
   2026-05-02 production gate.
6. Stage/prod release gates were only dry-runs in this execution because
   authenticated target credentials and DB container configuration were not
   available in the local context.

## Required Commands To Clear Blockers

```bash
pnpm run ops:db:restore-drill:stage
pnpm run ops:db:restore-drill:prod
pnpm run ops:deploy:rollback-proof:prod -- --base-url https://api.soar.luckysparrow.ch --auth-token <ADMIN_JWT>
pnpm run ops:release:v1:stage-rehearsal -- --base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch --auth-token <ADMIN_JWT>
pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --auth-token <ADMIN_JWT>
pnpm run ops:rc:signoff:build -- --engineering-name "<name>" --product-name "<name>" --operations-name "<name>" --owner-name "<name>" --owner-contact "<contact>"
pnpm run ops:rc:gates:status
pnpm run ops:rc:checklist:sync
pnpm run ops:rc:gates:evidence:check -- --strict --require-production-gate2
```

Required environment values:

- `STAGE_DB_CHECK_CONTAINER`
- `PROD_DB_CHECK_CONTAINER` or `PRODUCTION_DB_CHECK_CONTAINER`
- stage/prod DB user and database values if they differ from defaults
- authenticated admin token or credentials for protected stage/prod gates

## Decision

The code and repository-local quality gates are materially healthier after the
closeout remediation. V1 still cannot be declared fully closed from this local
execution because the current production/stage evidence and named sign-offs
are not available.
