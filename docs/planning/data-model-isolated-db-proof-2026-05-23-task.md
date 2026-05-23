# Data Model Isolated DB Proof Task - 2026-05-23

## Context

`SOAR-DATA-001` was still marked `PARTIALLY VERIFIED` because the migration and
DB-backed contract proof depended on isolated/sequential execution. On this
workstation, local Postgres and Redis were initially unavailable even though
Laragon was running; Docker Desktop was installed but stopped.

## Goal

Refresh the local data-model proof without using production credentials or
mutating production data.

## Constraints

- Do not run production DB commands or capture production secrets.
- Do not perform LIVE order, position, exchange, or bot activation mutations.
- Keep production migration/restore proof as a separate protected operations
  gate.
- Use repository-owned validation commands.

## Definition of Done

- Local Postgres/Redis are reachable.
- Prisma schema and migration chain validate.
- Representative DB-backed packs pass sequentially with reset isolation.
- Local backup/restore drill passes and cleanup is verified by the script.
- Source-of-truth files record local evidence and residual production gate.

## Forbidden

- Do not promote local data proof to full production proof.
- Do not use Coolify credentials as Soar application credentials.
- Do not accept shared-DB parallel e2e failures as migration failures when the
  isolated audit command passes.

## Result Report

- Status: verified locally.
- Environment recovery:
  - Laragon process was present at `C:\laragon\laragon.exe`.
  - Laragon included Redis but no PostgreSQL executable was found.
  - Docker Desktop service was stopped; starting Docker Desktop exposed Docker
    `28.3.2`.
  - `pnpm run go-live:infra:up` started `soar-postgres-1` and `soar-redis-1`.
  - TCP checks passed for `localhost:5432` and `localhost:6379`.
- Validation:
  - `pnpm run audit:data:db-isolated` - PASS.
    - Prisma schema validation PASS.
    - Prisma migration status PASS with `55` migrations.
    - Full migration reset/replay PASS.
    - Wallets isolated DB pack PASS (`24/24`).
    - Backtests isolated DB pack PASS (`15/15`).
    - Runtime repository isolated DB pack PASS (`2/2`).
  - `pnpm run ops:db:backup-restore:check-local` - PASS.
    - Report: `docs/operations/v1-db-restore-check-2026-05-23T13-05-22-623Z.md`.
    - Artifact: `docs/operations/_artifacts-db-restore-check-2026-05-23T13-05-22-623Z.txt`.
- Residual risk:
  - Production migration status and production backup/restore freshness remain
    protected operations proof, not satisfied by this local run.
