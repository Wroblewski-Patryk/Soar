# V1 Production Restore And LIVEIMPORT Truth - 00169d7f - 2026-05-13

## Context

- Stage: verification
- Operation mode: BUILDER
- Deployed production build-info matches
  `00169d7fdc3aff8317759137b05594b20e773c8e`.
- Production application auth, production UI auth, rollback auth, and
  production DB restore context are available in the local execution session.
- No secret values may be written to repository artifacts.

## Goal

Refresh production backup/restore evidence for 2026-05-13 and normalize
LIVEIMPORT evidence naming so final preflight reports the real remaining
blocker.

## Scope

- Run the production PostgreSQL restore drill through the Coolify database
  terminal using the existing isolated restore-proof contract.
- Generate current restore-drill JSON and Markdown artifacts.
- Re-run LIVEIMPORT readback with the canonical final-gate artifact filename.
- Re-run final preflight and update source-of-truth state.

## Implementation Plan

1. Execute the restore drill in the production PostgreSQL container:
   create `/tmp` dump, restore to `postgres_restore_check_*`, validate aggregate
   counts, drop temporary database, remove dump.
2. Capture no-secret PASS artifacts with cleanup evidence.
3. Re-run LIVEIMPORT collector to the filename expected by release-gate
   discovery.
4. Re-run final preflight and record the single remaining blocker.

## Acceptance Criteria

- Restore drill evidence is fresh for 2026-05-13 and PASS.
- Final preflight classifies backup/restore drill evidence as fresh.
- Final preflight classifies LIVEIMPORT truth as failed when no running session
  exists, not as a missing artifact.
- V1 remains `NO-GO` until LIVEIMPORT runtime readback passes.

## Definition of Done

- No secrets are committed.
- Restore cleanup returns zero leftover `postgres_restore_check_%` databases
  and zero `/tmp/postgres_backup_*.dump` files.
- `pnpm run quality:guardrails` passes.
- `git diff --check` passes.

## Forbidden

- Do not restart/stop production resources.
- Do not use the restore drill to inspect user, bot, order, position, or log
  payloads.
- Do not start or mutate a LIVE trading session without explicit live-risk
  approval.
- Do not mark V1 complete from a failed LIVEIMPORT artifact.

## Result Report

- Production restore drill: PASS. It created an isolated restore database,
  restored the dump, validated aggregate counts, dropped the restore database,
  removed the dump, and verified zero leftovers.
  Evidence:
  `docs/operations/v1-restore-drill-prod-2026-05-13T17-41-29Z.md`.
- LIVEIMPORT canonical artifact: generated and failed closed because the one
  LIVE Binance futures bot has no running session (`NO_RUNNING_SESSION`).
  Evidence:
  `docs/operations/liveimport-03-prod-readback-2026-05-13.json`.
- Final preflight: still `blocked`, now only on
  `evidence:liveImportReadback:failed`.
  Evidence:
  `docs/operations/v1-final-preflight-00169d7f-2026-05-13.md`.
