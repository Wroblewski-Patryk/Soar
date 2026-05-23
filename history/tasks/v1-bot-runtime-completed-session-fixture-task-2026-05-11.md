# Task

## Header
- ID: V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11
- Title: Bot Runtime completed PAPER session fixture proof
- Task Type: test
- Current Stage: release
- Status: DONE
- Owner: QA/Test + Backend Builder
- Depends on: V1-BOT-RUNTIME-PAPER-SESSION-BROWSER-PROOF-2026-05-11
- Priority: P0
- Module Confidence Rows: SOAR-BOT-RUNTIME-001
- Requirement Rows: REQ-FUNC-003
- Quality Scenario Rows: QA-003
- Risk Rows: RISK-003
- Iteration: 2026-05-11-06
- Operation Mode: BUILDER
- Mission ID: V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11
- Mission Status: IN_PROGRESS

## Context
Bot Runtime now has local proof for a representative PAPER `RUNNING` session.
The V1 work order still lists stopped/completed session proof or worker
telemetry proof as the next Bot Runtime gap. The approved PAPER snapshot import
is the safest local data path for representative runtime monitoring evidence.

## Goal
Extend the existing PAPER snapshot import with deterministic completed session
read data and prove the Bot Runtime APIs/UI can surface completed-session truth
without fake Web data or live trading mutations.

## Scope
- Snapshot importer only: deterministic local completed PAPER session, event,
  and symbol stats for imported active PAPER bots.
- API readbacks: session list with `COMPLETED`, completed session detail,
  completed symbol stats, aggregate behavior.
- Browser proof if local route can safely filter/select completed sessions.
- Source-of-truth docs/state after verification.

## Implementation Plan
1. Add a completed PAPER runtime session fixture to the importer beside the
   current running session.
2. Keep completed fixture read-only and deterministic; do not create orders or
   mutate positions.
3. Import the snapshot, run API readbacks for `status=COMPLETED`, and verify
   the canonical Bot Runtime route can surface completed-session state or
   record a blocker.
4. Run targeted validation and refresh V1 artifacts.
5. Update Bot Runtime state honestly.

## Acceptance Criteria
- Snapshot import creates at least one `COMPLETED` PAPER runtime session for
  the representative bot.
- Completed session has event/stat readback evidence through existing APIs.
- Browser/UI proof is captured or a precise blocker is recorded.
- No live-money, order, or production mutations occur.
- Source-of-truth docs reflect the remaining Bot Runtime gap truthfully.

## Constraints
- use existing runtime session tables and API contracts
- do not add fake frontend data
- do not add production-only behavior
- do not print secrets
- do not broaden snapshot semantics outside local PAPER representative proof

## Definition of Done
- [x] Completed-session fixture implemented or blocker recorded.
- [x] API readback evidence captured.
- [x] Relevant validation run.
- [x] Cleanup evidence captured.
- [x] Source-of-truth docs/state updated.

## Forbidden
- manual SQL as the primary proof path
- live trading or production mutation
- bypassing existing Bot Runtime APIs
- deleting unrelated dirty work

## Validation Evidence
- Implementation: `apps/api/scripts/importPaperRuntimeSnapshot.ts` now creates
  a deterministic local `COMPLETED` PAPER runtime session beside the running
  snapshot session, with one `SESSION_STOPPED` event and three symbol-stat rows.
- Snapshot import:
  - First direct `tsx` attempt failed safely because process `DATABASE_URL`
    was not set.
  - Rerun with `DATABASE_URL` loaded from `apps/api/.env` and process-only
    API-key encryption env passed through `pnpm --filter api run snapshot:paper:import`.
- API readback:
  - `GET /dashboard/bots/{botId}/runtime-sessions?limit=50` returned
    statuses `RUNNING,COMPLETED`.
  - `GET /dashboard/bots/{botId}/runtime-sessions?status=COMPLETED&limit=50`
    returned one completed session:
    `snapshot-paper-runtime-completed-2009f226-28ed-4231-878b-350d27057b5f`.
  - Completed session detail returned status `COMPLETED`, `eventsCount: 1`,
    and `symbolsTracked: 3`.
  - Completed symbol stats returned `3` rows.
  - Completed positions readback returned `total: 0` and `openCount: 0`.
  - Aggregate readback kept the overall aggregate session `RUNNING`, with
    aggregate metadata `sessionsCount: 2`, 2 events, 6 symbol-stat rows, and
    3 open positions from the running session.
- Browser proof:
  - Browser plugin path remained unavailable earlier with
    `No active Codex browser pane available`; Node REPL Playwright was used.
  - Authenticated canonical Bot Runtime route loaded at
    `/dashboard/bots/2009f226-28ed-4231-878b-350d27057b5f/preview`.
  - Session status filter changed to `COMPLETED`.
  - Page rendered `COMPLETED`, PAPER mode, Sessions: `1`, `0 open`,
    portfolio `$10,000.00`, free funds `$10,000.00`, and symbols
    `BTCUSDT`, `BNBUSDT`, `ETHUSDT`.
  - Screenshot:
    `C:\Users\wrobl\AppData\Local\Temp\soar-bot-runtime-completed-proof\completed-session-filter.png`.
  - Console issue: one `401 Unauthorized` resource error during browser
    session bootstrap; authenticated completed-session data rendered correctly.
- Validation:
  - `pnpm --filter api run typecheck` passed.
  - `node --check scripts/buildProjectIndex.mjs` passed.
  - `pnpm run quality:guardrails` passed.
  - V1 report generators passed after pinning scorecard to
    `history/artifacts/v1-master-state-ledger-2026-05-11.json`.
- Cleanup: local API/Web listeners and Playwright validation processes were
  stopped. Final check returned `No listeners on 3001/3002` and
  `No chrome-headless-shell processes`.
- Reality status: local `PARTIAL` proof. Running and completed PAPER sessions
  are now proven locally; worker telemetry/live-loop proof and production-safe
  clickthrough remain open.

## Result Report
- Task summary: Completed PAPER runtime-session fixture was added to the
  approved snapshot import and proven through API readbacks plus authenticated
  browser filtering on the canonical Bot Runtime route.
- Files changed: importer, task/source-of-truth docs, V1 generator next-proof
  text, and generated V1 reports.
- How tested: API typecheck, snapshot import, API readbacks, authenticated
  browser proof, project index syntax check, guardrails, and V1 generator
  refresh.
- What is incomplete: worker telemetry/live-loop proof and production-safe
  Bot Runtime clickthrough remain open.
- Next steps: prove worker telemetry/live-loop readback or run approved
  production-safe Bot Runtime clickthrough.
