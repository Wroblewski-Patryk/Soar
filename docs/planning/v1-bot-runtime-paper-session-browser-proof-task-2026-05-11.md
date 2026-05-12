# Task

## Header
- ID: V1-BOT-RUNTIME-PAPER-SESSION-BROWSER-PROOF-2026-05-11
- Title: Bot Runtime PAPER session browser proof
- Task Type: verification
- Current Stage: release
- Status: DONE
- Owner: QA/Test
- Depends on: V1-DASHBOARD-HOME-RUNTIME-SESSION-FIXTURE-2026-05-11
- Priority: P0
- Module Confidence Rows: SOAR-BOT-RUNTIME-001
- Requirement Rows: REQ-FUNC-003
- Quality Scenario Rows: QA-003
- Risk Rows: RISK-003
- Iteration: 2026-05-11-05
- Operation Mode: TESTER
- Mission ID: V1-BOT-RUNTIME-PAPER-SESSION-BROWSER-PROOF-2026-05-11
- Mission Status: IN_PROGRESS

## Context
The V1 scorecard lists Bot Runtime as priority 2 after Dashboard Home. The
PAPER snapshot import now creates representative runtime-session data for bot
`2009f226-28ed-4231-878b-350d27057b5f`, and Dashboard Home can render the same
runtime aggregate. Bot Runtime still needs a direct browser proof on its
canonical monitoring route.

## Goal
Prove that the Bot Runtime monitoring page renders a representative PAPER
running session through the real local API/Web path.

## Scope
- Route: `/dashboard/bots/2009f226-28ed-4231-878b-350d27057b5f/preview`
- Legacy redirects: `/dashboard/bots/:id/runtime` and `/dashboard/bots/runtime?botId=...`
- API readbacks: runtime sessions, session positions, aggregate.
- Docs/state: this task file, module confidence, requirements, quality, risk,
  task board, project state, V1 artifacts.

## Implementation Plan
1. Import the existing PAPER runtime snapshot.
2. Start local API/Web and verify `/health` plus login route.
3. Authenticate the snapshot owner through the real API.
4. Open the canonical Bot Runtime monitoring route in a browser.
5. Verify selected bot, session status, open positions, wallet KPIs/summary,
   runtime signal section, and safe interaction such as filter or view switch.
6. Verify legacy runtime redirects land on preview.
7. Run relevant tests/typecheck/guardrails, refresh V1 artifacts, update docs,
   and clean up processes.

## Acceptance Criteria
- Bot Runtime canonical route renders representative PAPER runtime state.
- API readbacks and browser evidence agree on session/open-position truth.
- At least desktop plus one additional viewport is checked.
- A safe monitoring interaction is exercised.
- Legacy runtime redirects are verified or a blocker is recorded.
- Source-of-truth docs reflect the result truthfully.

## Constraints
- use existing systems and approved snapshot/import path
- do not place, cancel, close, or mutate orders/positions
- do not mutate production or LIVE trading state
- do not print secret values
- do not invent new runtime data paths

## Definition of Done
- [x] Browser evidence captured or blocker recorded.
- [x] Real local API/Web path used.
- [x] Validation commands and cleanup evidence recorded.
- [x] Source-of-truth docs/state updated.

## Forbidden
- manual ad hoc SQL as proof path
- fake Web data
- production or LIVE mutations
- destructive DB reset

## Validation Evidence
- Snapshot import: `corepack pnpm@10.13.1 --filter api run snapshot:paper:import`
  passed after loading local `DATABASE_URL` from `apps/api/.env` and using
  process-only test API-key encryption env. Import summary: 1 market universe,
  1 symbol group, 1 strategy, 1 bot, 1 bot market group, 1 market group
  strategy link, and 3 open positions.
- Local API/Web: API `/health` returned `200`; Web `/auth/login` returned
  `200`.
- Browser plugin path: attempted first, but unavailable in this desktop
  context with `No active Codex browser pane available`; standalone Playwright
  fallback was used.
- API readbacks:
  - `/dashboard/bots/2009f226-28ed-4231-878b-350d27057b5f/runtime-sessions`
    returned `200` with one PAPER `RUNNING` session,
    `snapshot-paper-runtime-...`, `eventsCount: 1`, and `symbolsTracked: 3`.
  - `/dashboard/bots/2009f226-28ed-4231-878b-350d27057b5f/runtime-monitoring/aggregate?perSessionLimit=200`
    returned `200` with aggregate status `RUNNING`.
  - `/dashboard/bots/2009f226-28ed-4231-878b-350d27057b5f/runtime-sessions/{sessionId}/positions?limit=200`
    returned `200` with `total: 3`, `openCount: 3`,
    `openOrdersCount: 0`, reference balance `10000`, and free cash about
    `7000`.
  - Symbol stats and trades endpoints returned `200`; trades total was `0`.
- Browser proof:
  - Canonical route
    `/dashboard/bots/2009f226-28ed-4231-878b-350d27057b5f/preview` rendered
    bot `asd`, monitoring surface text, `RUNNING`, `PAPER`,
    `BTCUSDT`, `BNBUSDT`, `ETHUSDT`, wallet/portfolio KPI text, and no
    framework overlay.
  - Desktop excerpt included `RUNNING Mode: PAPER Sessions: 1`, checklist
    `4/5 OK`, positions data `OK 3 open`, signal data `OK 3/3`, no session
    errors `OK`, portfolio `$10,000`, free funds `$7,000`, open positions `3`,
    and open orders `0`. The heartbeat check was `CHECK` because the imported
    snapshot heartbeat is intentionally old.
  - Tablet `768x1024` and mobile `390x844` both rendered the runtime symbols.
  - Safe interaction passed by switching the monitoring view to session mode.
  - Legacy `/dashboard/bots/{id}/runtime` redirected to
    `/dashboard/bots/{id}/preview`.
  - Legacy `/dashboard/bots/runtime?botId={id}` redirected to
    `/dashboard/bots/{id}/preview`.
  - Console issues: none recorded by the Bot Runtime proof runner.
  - Screenshots captured under
    `C:\Users\wrobl\AppData\Local\Temp\soar-bot-runtime-paper-proof`:
    `desktop-bot-runtime.png`, `desktop-after-view-switch.png`,
    `tablet-bot-runtime.png`, `mobile-bot-runtime.png`,
    `legacy-id-runtime-redirect.png`, and
    `legacy-query-runtime-redirect.png`.
- Tests and generators: snapshot import, local API/Web health, runtime API
  readbacks, browser proof, focused Bot Runtime Web Vitest (`4` files,
  `18` tests), `node --check scripts/buildProjectIndex.mjs`,
  repository guardrails, `ops:project:index`, `ops:project:scan`,
  `ops:project:ledger`, `ops:project:scorecard`, and `git diff --check`
  passed. `git diff --check` reported line-ending warnings only.
- Cleanup: local API/Web and Playwright processes started for this proof were
  cleaned up after validation. Final check returned `No listeners on
  3001/3002` and `No chrome-headless-shell processes`.
- Reality status: local `PARTIAL` proof. The running PAPER session route is
  locally proven. The stopped/completed gap was closed by
  `V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11`; worker
  telemetry/live-loop proof and production-safe/non-local proof remain open.

## Result Report
- Task summary: Bot Runtime canonical monitoring route now has local
  authenticated browser evidence against representative PAPER runtime-session
  data produced by the approved snapshot import path.
- Files changed: this task file, source-of-truth state/docs, generated V1
  reports, and `scripts/buildProjectIndex.mjs` to keep the generated Bot
  Runtime next-proof text aligned with the new running-session evidence.
- How tested: snapshot import, local API/Web health, authenticated Playwright
  proof, runtime API readbacks, responsive screenshots, safe view switch, and
  legacy redirect checks.
- What is incomplete: worker telemetry or live loop proof, and
  production-safe/non-local clickthrough remain open.
- Next steps: add worker telemetry/live-loop readback before upgrading Bot
  Runtime beyond `PARTIAL_LOCAL`.
- Learning captured: `.codex/context/LEARNING_JOURNAL.md` now records that V1
  report refreshes should pass the exact generated index/scan/ledger JSON
  inputs to avoid stale next-proof text.
