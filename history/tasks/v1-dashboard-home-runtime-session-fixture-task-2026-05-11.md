# Task

## Header
- ID: V1-DASHBOARD-HOME-RUNTIME-SESSION-FIXTURE-2026-05-11
- Title: Dashboard Home PAPER snapshot runtime-session fixture
- Task Type: test
- Current Stage: release
- Status: DONE
- Owner: QA/Test + Backend Builder
- Depends on: V1-DASHBOARD-HOME-ACTIVE-RUNTIME-BROWSER-PROOF-2026-05-11
- Priority: P0
- Module Confidence Rows: SOAR-DASHBOARD-001
- Requirement Rows: REQ-FUNC-002
- Quality Scenario Rows: QA-002
- Risk Rows: RISK-002
- Iteration: 2026-05-11-04
- Operation Mode: BUILDER
- Mission ID: V1-DASHBOARD-HOME-RUNTIME-SESSION-FIXTURE-2026-05-11
- Mission Status: DONE_LOCAL

## Context
The active PAPER Dashboard Home browser proof imported the approved snapshot and
rendered the active bot configuration, but Dashboard Home stayed in
`NO_SESSION` and showed no open position rows. Architecture says Dashboard Home
loads aggregate runtime payloads from runtime session APIs before rendering
positions/orders/history.

## Goal
Update the existing approved PAPER snapshot import path so representative local
snapshot data includes runtime-session evidence needed by Dashboard Home.

## Scope
- `apps/api/scripts/importPaperRuntimeSnapshot.ts`
- `apps/api/prisma/snapshots/README.md`
- A focused rerun of snapshot import and active Dashboard browser proof.
- Source-of-truth docs/state after proof.

## Implementation Plan
1. Extend the import script to replace local runtime session/stat/event rows for
   imported snapshot bots.
2. Create one deterministic running PAPER runtime session per imported active
   bot when the snapshot contains open positions for that bot.
3. Seed minimal symbol stats and a `SESSION_STARTED` runtime event from the same
   snapshot positions, without adding fake Web data or a new seeding framework.
4. Rerun `snapshot:paper:import`, API readbacks, and active `/dashboard` browser
   proof.
5. Update docs/state truthfully and run relevant validation.

## Acceptance Criteria
- `snapshot:paper:import` remains idempotent for imported bot IDs.
- `/dashboard/bots/:id/runtime-sessions` returns a representative session for
  the snapshot bot.
- `/dashboard/bots/:id/runtime-monitoring/aggregate` exposes snapshot open
  position rows through the existing runtime contract.
- `/dashboard` browser proof shows active runtime rows or records a blocker.
- Automated tests/typecheck/guardrails relevant to the touched scope pass.

## Constraints
- use existing systems and approved mechanisms
- do not add a new seeding framework
- do not write fake runtime data in Web
- do not mutate production or LIVE trading state
- do not print secret values

## Definition of Done
- [x] Import script creates runtime-session fixture data through existing Prisma
  models.
- [x] Active Dashboard browser proof rerun.
- [x] Validation commands and cleanup evidence recorded.
- [x] Source-of-truth docs/state updated.

## Forbidden
- manual ad hoc SQL as the release evidence path
- fake Web data
- production or LIVE mutations
- destructive DB reset

## Validation Evidence
- Tests: `snapshot:paper:import` PASS after script change; API typecheck PASS; repository guardrails PASS; V1 artifact generators PASS; `git diff --check` PASS with line-ending warnings only.
- Manual checks: PASS. `/runtime-sessions` returns one deterministic `RUNNING`
  session for bot `2009f226-28ed-4231-878b-350d27057b5f`; session positions
  endpoint returns `total: 3`, `openCount: 3`, symbols `ETHUSDT`, `BNBUSDT`,
  `BTCUSDT`; aggregate returns `RUNNING`, `openCount: 3`, symbols
  `ETHUSDT`, `BTCUSDT`, `BNBUSDT`.
- Browser proof: PASS with explained non-app console noise. Authenticated
  Playwright fallback shows `/dashboard` desktop `1280x720`, tablet `768x1024`,
  and mobile `390x844` with bot `asd`, PAPER mode, status `RUNNING`, no
  `NO_SESSION`, no `No open positions`, open rows for `BTCUSDT`, `BNBUSDT`,
  and `ETHUSDT`, portfolio `10,000.00 USDT`, free funds `7,000.00 USDT`, and
  `Orders` tab interaction showing `No open orders`.
- Screenshots: saved outside repo in
  `C:\Users\wrobl\AppData\Local\Temp\soar-runtime-session-fixture-proof-v3`.
- Console health: no framework overlay or page errors. Console reported
  `net::ERR_NETWORK_ACCESS_DENIED` resource failures under restricted local
  test network; rendered runtime data remained complete.
- Cleanup: PASS. Stopped local API/Web dev-server processes started for proof; final port check showed no `3001`/`3002` listeners after stopping the lingering Web node process. `chrome-headless-shell` check returned no processes.
- Reality status: locally_verified; production-safe clickthrough still open.

## Result Report
- Task summary: existing PAPER snapshot import now creates the missing runtime
  read-contract data needed by Dashboard Home active runtime proof.
- Files changed: `apps/api/scripts/importPaperRuntimeSnapshot.ts`,
  `apps/api/prisma/snapshots/README.md`, this task file, V1 source-of-truth
  state/docs, and regenerated V1 operation artifacts.
- How tested: reran `snapshot:paper:import`; checked runtime session,
  session positions, and aggregate endpoints; reran authenticated browser proof
  for `/dashboard`; ran API typecheck, repository guardrails, V1 artifact
  generators, diff check, and cleanup checks.
- What is incomplete: production-safe clickthrough/non-local proof remains open.
- Next steps: move to Bot Runtime PAPER session proof or production-safe
  Dashboard Home clickthrough when approved.
