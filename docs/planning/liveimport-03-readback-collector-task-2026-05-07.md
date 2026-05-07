# LIVEIMPORT-03-COLLECTOR-2026-05-07 - Readback Evidence Collector

## Header
- ID: LIVEIMPORT-03-COLLECTOR-2026-05-07
- Title: Add read-only production readback collector for live import evidence
- Task Type: release
- Current Stage: implementation
- Status: DONE
- Owner: Ops/Release
- Depends on: production build-info freshness for `1f816362`
- Priority: P0
- Iteration: 2026-05-07
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the continuation slice.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`LIVEIMPORT-03` is the active V1 blocker. Production now exposes the pushed
candidate SHA, but this shell still has no production operator auth. The repo
already has ops auth helpers and protected runtime read endpoints; the missing
piece is a repeatable, redacted, read-only collector that can run immediately
once auth is available.

## Goal
Add a small ops script that uses existing auth helpers and existing protected
API routes to collect redacted ETH/DOGE runtime position evidence without
creating new API behavior or write paths.

## Scope
- `scripts/collectLiveImportReadbackEvidence.mjs`
- `package.json`
- planning/context state docs

## Implementation Plan
1. Reuse `resolveOpsAuthToken` and `buildOpsRequestHeaders`.
2. Support token or login-based auth through `LIVEIMPORT_READBACK_*` env vars
   and CLI flags.
3. Check optional production build-info SHA before protected readback.
4. Discover LIVE bots and latest RUNNING session, or use explicit bot/session
   ids.
5. Read `/dashboard/bots/:id/runtime-sessions/:sessionId/positions` per symbol.
6. Emit only redacted hashes and non-secret runtime state needed for
   `LIVEIMPORT-03`.

## Acceptance Criteria
- Script has a help path and dry-run path that do not require auth.
- Script fails closed when auth is missing.
- Script never logs token/password values.
- Script performs only GET requests.

## Definition of Done
- [x] Existing auth helper reuse.
- [x] No new backend route, schema, DB, exchange, or live-money behavior.
- [x] Repository guardrails and docs parity pass.

## Validation Evidence
- Tests:
  - `pnpm run ops:liveimport:readback -- --help`
  - `pnpm run ops:liveimport:readback -- --dry-run --expected-sha 1f816362c93e117e47cfe52a35e0fec93bd0b37d`
  - Missing-auth fail-closed run is expected to exit non-zero without printing
    secret values.
- Manual checks:
  - Production build-info already reports
    `1f816362c93e117e47cfe52a35e0fec93bd0b37d`.
- High-risk checks:
  - No production write endpoint is called.
  - No exchange endpoint is called.
  - No secret values are logged.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/operations/prod-web-build-info-gate-2026-05-02.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Deployment / Ops Evidence
- Deploy impact: none until this commit is pushed; script is local ops tooling.
- Env or secret changes: none; optional `LIVEIMPORT_READBACK_*` env names are
  read only.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: remove the script and package entry.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: production auth is missing, so `LIVEIMPORT-03` cannot be completed.
- Gap: no single redacted collector command existed for the exact readback.
- Constraint: no new API behavior or write path.

### 2. Select One Priority Task
- Selected task: add read-only collector script.
- Rationale: it removes execution ambiguity without pretending evidence exists.
- Deferred: actual production readback, because auth is still missing.

### 3. Plan Implementation
- Files: one script, package script entry, planning/state docs.
- Logic: auth resolve -> optional build-info guard -> GET bots/sessions/positions -> redact.
- Edge cases: missing auth, no LIVE bot, no running session, missing symbol.

### 4. Execute Implementation
- Added `ops:liveimport:readback`.

### 5. Verify and Test
- Validation performed: script help, dry-run, missing-auth fail-closed,
  guardrails, docs parity, diff check.
- Result: PASS where expected; missing-auth run fails closed by design.

### 6. Self-Review
- Simpler option considered: manually document curl commands.
- Technical debt introduced: no.
- Scalability assessment: script follows existing ops auth conventions and can
  be reused for later protected readback evidence.
- Refinements made: output uses hashes for ids and does not include token
  material.

### 7. Update Documentation and Knowledge
- Docs updated: task packet and queue/state docs.
- Context updated: yes.
- Learning journal updated: not applicable.

## Result Report
- Task summary: added a read-only, redacted live-import runtime readback
  collector ready for production auth.
- Files changed: script, package script, planning/state docs.
- How tested: help, dry-run, missing-auth fail-closed, guardrails, docs parity.
- What is incomplete: actual `LIVEIMPORT-03` evidence capture remains blocked
  until auth is available.
- Next steps: run the collector with production auth and expected SHA.
