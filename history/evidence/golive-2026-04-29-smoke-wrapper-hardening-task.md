# Task

## Header
- ID: GOLIVE-2026-04-29-A
- Title: Harden local go-live smoke wrapper against existing infra and failed-migration diagnostics
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: `V1GUARD-A`
- Priority: P1

## Context
Canonical go-live packs are green when run directly, but the umbrella wrapper
`pnpm run test:go-live:smoke` is still too brittle for the local Soar
workspace. It currently fails before meaningful validation when Postgres or
Redis are already running on the standard ports, and it reports Prisma migrate
failures too opaquely when the target local DB contains a previously failed
migration.

## Goal
Make the local go-live smoke wrapper reliably reusable in the common
development setup without weakening the migration or smoke contracts.

## Deliverable For This Stage
A small tooling hardening slice that:
- reuses already-running local Postgres/Redis when they are reachable,
- avoids tearing down infra it did not start itself,
- and surfaces failed-migration diagnostics explicitly enough that the next
  operator action is obvious.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `scripts/goLiveSmoke.mjs`
- `docs/engineering/local-development.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Add a preflight that treats reachable local `5432` and `6379` as reusable
   infra when compose start fails because ports are already allocated.
2. Keep wrapper teardown scoped only to infra started by this run.
3. Improve Prisma migrate failure output for the known `P3009` class so the
   blocker is explicit rather than buried in mixed CLI noise.
4. Update local-development and learning context to match the hardened wrapper
   behavior.

## Acceptance Criteria
- [x] `pnpm run test:go-live:smoke` no longer fails immediately when local
      Postgres/Redis are already running and reachable on the standard ports.
- [x] The wrapper does not call `go-live:infra:down` when it reused external
      infra instead of starting its own compose stack.
- [x] Failed local migration state is surfaced with a clear diagnostic instead
      of an opaque smoke-wrapper failure.

## Definition of Done
- [x] Code, docs, and context are synchronized.
- [x] Smoke-related validation evidence is attached.
- [x] No production contract or migration guarantee was silently weakened.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm run test:go-live:api`
  - `pnpm run test:go-live:web`
  - `pnpm run quality:guardrails`
- Manual checks:
  - `pnpm run test:go-live:smoke`
- Screenshots/logs:
  - verified wrapper reuses reachable local `5432/6379` infra and surfaces the
    local Prisma `P3009` blocker explicitly
- High-risk checks:
  - smoke contract stays fail-closed on real migration errors

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: yes
- Rollback note: not applicable

## Review Checklist (mandatory)
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report

- Task summary: Hardened `scripts/goLiveSmoke.mjs` so the local umbrella smoke
  wrapper reuses already-running Postgres/Redis when `5432/6379` are occupied
  by healthy local infra, avoids tearing down infra it did not start, and
  prints an explicit diagnostic when the real blocker is the local Prisma
  failed migration `20260424094500_add_single_context_bot_refs`.
- Files changed:
  - `scripts/goLiveSmoke.mjs`
  - `docs/engineering/local-development.md`
  - `.codex/context/LEARNING_JOURNAL.md`
  - `docs/planning/mvp-next-commits.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- How tested:
  - `pnpm run test:go-live:api`
  - `pnpm run test:go-live:web`
  - `pnpm run test:go-live:smoke`
  - `pnpm run quality:guardrails`
- What is incomplete:
  - the local DB still contains a pre-existing failed migration state and must
    be resolved outside this repo change before the full wrapper can go green
- Next steps:
  - clear local Prisma migration debt, then rerun `pnpm run test:go-live:smoke`
- Decisions made:
  - keep smoke wrapper fail-closed on migration errors; improve resilience and
    diagnostics instead of silently bypassing migrate checks
