# Task

## Header
- ID: LUC-4767
- Title: Restore/read Coolify VPS health evidence for production watch
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: [LUC-4806](/LUC/issues/LUC-4806)
- Priority: P0
- Mission ID: LUC-4767-COOLIFY-VPS-HEALTH-READBACK-2026-06-21
- Mission Status: VERIFIED

## Context
[LUC-4767](/LUC/issues/LUC-4767) was previously blocked because the DRE runner
did not expose read-only Coolify/VPS status binding names. The child unblocker
[LUC-4806](/LUC/issues/LUC-4806) completed, so this heartbeat resumed the
read-only production health projection.

## Goal
Verify, without exposing secret values or mutating production, whether the DRE
runner can read Coolify/VPS production health evidence and publish a
redaction-safe health projection for Soar.

## Scope
- Names-only binding scan for Coolify/VPS/protected status families.
- Read-only Coolify project/environment/resource/deployment projection.
- Existing production public smoke and protected worker-readiness smoke.
- Existing rollback guard runtime freshness and alert projection.
- Minimal source-of-truth state updates.

Out of scope: deploy, push, restart, rollback, environment edit, DB/Redis
mutation, account mutation, secret readback, raw log capture, screenshots,
exchange actions, payment/subscription mutation, and live-trading actions.

## Implementation Plan
1. Acknowledge child unblocker completion and keep the task issue-scoped.
2. Run names-only environment scan.
3. Run the existing Coolify stack env checker tests.
4. Query Coolify through read-only `GET` endpoints and store only sanitized
   counts/statuses.
5. Run public smoke and protected worker-readiness smoke.
6. Run rollback guard with auth mapped in-process from the existing smoke
   credential family.
7. Record evidence, update project state, and close the issue.

## Acceptance Criteria
- Names-only binding scan reports required Coolify/VPS binding names present or
  exact missing families.
- Read-only server-health projection is captured, or the issue is blocked with
  named owner/action.
- No deploy, restart, rollback, env edit, DB/Redis mutation, account mutation,
  secret readback, screenshot, raw log capture, or live-trading action occurs.

## Validation Evidence
- `pnpm run -s ops:coolify-stack:env-check:test` -> PASS (`11/11`).
- Names-only scan found `COOLIFY_*`, `VPS_HOST`, and `SMOKE_AUTH_*` names.
- Names-only scan did not find `SSH*`, dedicated `VPS_*` status credentials,
  `ROLLBACK_GUARD_*`, `SOAR_PROD*`, `PROD_DB_CHECK*`,
  `PRODUCTION_DB_CHECK*`, `RC_*`, or `GATE*` names.
- Coolify read-only `GET` projection -> PASS:
  - visible projects: `5`
  - configured project: pass
  - production environment: pass
  - global resources: `17`
  - deployment rows: `0`
  - production resources: six applications, PostgreSQL, Redis
  - PostgreSQL/Redis: `running:healthy`
  - application rows: `running:unknown`
- Public smoke without workers -> PASS.
- Protected smoke with pre-bound `SMOKE_AUTH_TOKEN` -> FAIL_CLOSED on
  `/workers/ready` `401`.
- Protected smoke after clearing stale token and using env-bound login -> PASS,
  including `/workers/ready` `200`.
- Rollback guard -> PASS:
  `shouldRollback=false`, no reasons, worker topology `healthy`, freshness
  `PASS`, running sessions `5`, alerts empty.
- Evidence:
  `history/evidence/luc-4767-coolify-vps-health-readback-2026-06-21.md`.

## Architecture Evidence
- Architecture source reviewed: Soar AGENTS and current operations state.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; no architecture or runtime behavior
  changed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: read-only verification only.
- Smoke steps updated: no.
- Rollback note: rollback guard returned `shouldRollback=false`; no rollback
  performed.
- Observability or alerting impact: no alert/config change; alerts readback
  returned empty.
- Staged rollout or feature flag: not applicable.

## Security / Privacy Evidence
- Data classification: operational metadata, redaction-safe.
- Trust boundaries: Coolify API and protected Soar ops endpoints.
- Permission or ownership checks: used injected DRE runner binding names only.
- Secret handling: names-only scans; no secret values printed or stored.
- Fail-closed behavior: stale `SMOKE_AUTH_TOKEN` returned protected
  `/workers/ready` `401`; fresh login path passed.
- Residual risk: host-level VPS pressure and sanitized log-window evidence
  were not attempted because this runner exposes only `VPS_HOST`, not a
  read-only SSH/VPS status credential family.

## Definition of Done
- [x] Binding names scanned without value disclosure.
- [x] Read-only server-health projection captured.
- [x] Public and protected app/worker readiness verified through existing
      scripts.
- [x] Runtime freshness/rollback guard captured.
- [x] Evidence and project state updated.
- [x] No prohibited production mutation occurred.

## Result Report
- Task summary: restored and read the DRE Coolify health path after child
  unblocker completion; Soar production is reachable and rollback is not
  indicated.
- Files changed:
  - `history/evidence/luc-4767-coolify-vps-health-readback-2026-06-21.md`
  - `history/tasks/luc-4767-coolify-vps-health-readback-2026-06-21-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/system-health.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: Coolify checker tests, Coolify GET projection, public smoke,
  protected smoke, rollback guard.
- What is incomplete: host-level VPS CPU/memory/disk/proxy pressure and
  sanitized log-window capture remain unavailable without approved read-only
  SSH/VPS status credentials beyond `VPS_HOST`.
- Next steps: keep routine DRE production watch; if deeper VPS pressure is
  required, route a narrow Security/Ops binding issue for read-only SSH/VPS
  status credentials.
- Decisions made: close [LUC-4767](/LUC/issues/LUC-4767) as read-only verified
  rather than blocked, because the requested Coolify/DB/Redis/worker/runtime
  projection is captured and host-pressure depth is a residual capability gap.
