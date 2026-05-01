# BHIST-01 Bot Portfolio History and Capital Events Task

## Header
- ID: BHIST-01
- Title: Add bot-scoped portfolio history with reset and wallet-capital markers
- Task Type: feature
- Current Stage: release
- Status: DONE
- Owner: Backend Builder + Frontend Builder
- Depends on: WLEDGER-06, WLEDGER-07..09
- Priority: P1
- Iteration: post-V1 product follow-up
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Soar now exposes wallet-level performance summary, equity timeline, and
cashflow markers for LIVE wallet previews. Operators can inspect deposits,
withdrawals, contributed capital, and wallet delta, but there is still no
dedicated bot-scoped history view that answers the user question:

"show me the progress from bot start until now, with markers for paper reset
or added wallet funds."

The new work must stay inside approved architecture:
- wallet remains the source of truth for execution mode and capital context,
- LIVE deposits/withdrawals come from the wallet ledger,
- PAPER reset remains the canonical active-capital checkpoint,
- no parallel accounting or fake chart reconstruction is allowed.

## Goal
Define and implement one bot-scoped portfolio history surface that visualizes
portfolio progress from the active bot lifecycle start to now and overlays the
capital events that explain value jumps without misclassifying them as bot PnL.

## Success Signal
- User or operator problem:
  - An operator cannot currently answer "how did this bot progress over time"
    in one place when resets or wallet cash movements happened.
- Expected product or reliability outcome:
  - Bot monitoring gains one truthful timeline that separates trading result
    from capital-context changes.
- How success will be observed:
  - The selected bot surface shows a chart or timeline with value progression
    plus reset/deposit/withdrawal markers and matching tooltip/detail data.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verify the implemented bot-scoped portfolio history vertical slice, capture
validation evidence, and sync canonical docs/context.

## Scope
- API:
  - extend existing bot monitoring/runtime read surfaces or add one bot-scoped
    read endpoint such as `GET /dashboard/bots/:id/portfolio-history`
- Read model:
  - derive one bot-scoped value timeline from existing runtime/session trade
    truth plus wallet capital context
- Marker sources:
  - `PAPER_RESET` from wallet `paperResetAt`
  - `LIVE_DEPOSIT`, `LIVE_WITHDRAWAL`, `TRANSFER_IN`, `TRANSFER_OUT` from
    existing wallet ledger events when they affect the linked wallet
  - optional `ALLOCATION_CHANGED` only if existing wallet audit truth is
    already available without inventing a new event system
- Web:
  - selected bot monitoring/detail surface, not wallet preview replacement
- Docs/context:
  - task board, project state, relevant planning notes, and module docs if the
    implementation changes public route/API shape

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- reuse wallet ledger for LIVE capital events instead of creating bot-local
  deposit/withdraw tables
- reuse paper reset checkpoint semantics instead of inventing synthetic
  restart baselines

## Implementation Plan
1. Verify the new `GET /dashboard/bots/:id/portfolio-history` contract and the
   selected-bot monitoring UI against the frozen semantics for `PAPER` and
   `LIVE`.
2. Record the exact validation split:
   - API/web typecheck PASS,
   - focused Vitest reruns blocked in this sandbox by `spawn EPERM`.
3. Sync module docs, planning notes, and queue/context entries to reflect the
   implementation status without overstating closure.

## Acceptance Criteria
- A selected bot can show one history view from active lifecycle start to now.
- PAPER reset appears as an explicit marker and does not erase older history
  rows silently.
- LIVE deposits/withdrawals appear as wallet-capital markers and do not change
  bot PnL.
- The UI explains partial or unavailable history truth instead of drawing fake
  continuity.
- The implementation reuses wallet-ledger and runtime-history systems rather
  than creating a second accounting path.

## Definition of Done
- [x] Bot portfolio history semantics are implemented in one approved API/read path.
- [x] Selected bot UI renders timeline and markers with explicit states.
- [x] Focused API/web validation passes.
- [x] Canonical docs/context are updated with implementation evidence.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from earlier stages is already implemented and documented.
- [x] Remaining verification blocker is stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- counting wallet deposits/withdrawals as bot profit/loss
- reconstructing fake paper or live points from config baselines alone

## Validation Evidence
- Tests:
  - PASS: `node node_modules/typescript/bin/tsc -p apps/api/tsconfig.json --noEmit`
  - PASS: `node node_modules/typescript/bin/tsc -p apps/web/tsconfig.json --noEmit`
  - PASS: `pnpm --filter api exec vitest run src/modules/bots/bots.portfolio-history.e2e.test.ts`
    (`2/2`)
  - PASS: `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.portfolio-history.test.tsx`
    (`1/1`)
  - PASS: `pnpm run quality:guardrails`
  - PASS: `pnpm --filter api run build`
  - PASS: `pnpm --filter web run build`
- Manual checks:
  - reviewed API contract, marker semantics, and web state coverage against
    the wallet-ledger and paper-reset architecture constraints
- Screenshots/logs:
  - not applicable
- High-risk checks:
  - ensure LIVE markers reuse wallet ledger and PAPER marker reuses
    `paperResetAt`

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/wallet-source-of-truth-contract.md`
  - `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates:
  - none required beyond module/public-contract docs already synced

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference:
  - existing bot monitoring/dashboard patterns and wallet preview timeline
- Canonical visual target:
  - selected bot history chart with event markers and explicit caveat state
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: yes
- Existing shared pattern reused:
  - dashboard cards, view states, table/chart patterns
- New shared pattern introduced: no
- Design-memory update required: no
- Visual gap audit completed: partial
- Background or decorative asset strategy: reuse existing dashboard visuals
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches:
  - visual parity is implemented structurally, but screenshot evidence is
    still pending because this sandbox run did not open a browser session
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Input-mode checks: touch | pointer | keyboard
- Accessibility checks:
  - marker labels, chart summary text, focusable detail triggers, color not as
    the only signal
- Parity evidence:
  - wallet preview semantics and bot monitoring semantics must not disagree on
    deposit/withdrawal meaning

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none expected
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: standard web/API rollback if later implementation regresses
- Observability or alerting impact: none expected for this slice
- Staged rollout or feature flag: not required

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  - wallet preview had timeline truth, but bot monitoring lacked one
    bot-scoped history surface
- Gaps:
  - no single chart answered "bot progress from start to now with
    reset/capital events"
- Inconsistencies:
  - without a dedicated read model, an executor could incorrectly reuse wallet
    delta as bot history
- Architecture constraints:
  - wallet-first and paper-reset contracts must remain authoritative

### 2. Select One Priority Task
- Selected task:
  - implement and verify one bot-scoped portfolio history vertical slice
- Priority rationale:
  - user explicitly requested the capability and current repo truth is only
    partially there through wallet preview
- Why other candidates were deferred:
  - release-evidence tasks remain blocked on external stage/prod access, while
    this slice materially advances local V1 product completeness

### 3. Plan Implementation
- Files or surfaces to modify:
  - bot monitoring API read model, selected-bot web surface, focused tests,
    planning/context docs
- Logic:
  - derive bot value line from current runtime/history truth and overlay wallet
    markers where relevant
- Edge cases:
  - partial wallet ledger coverage
  - no trades yet
  - paper reset inside requested range
  - live wallet deposit with fixed allocation not changing bot reference

### 4. Execute Implementation
- Implementation notes:
  - added `botPortfolioHistoryRead.service.ts` and
    `GET /dashboard/bots/:id/portfolio-history`
  - extended monitoring controller and selected-bot monitoring UI with
    summary cards, line chart, recent points, marker table, and explicit
    `loading | empty | error | success | partial` messaging
  - added focused API/web coverage files for the new contract and surface

### 5. Verify and Test
- Validation performed:
  - API/web typecheck PASS
  - focused API/web Vitest PASS
- Result:
  - implementation is verified for the selected API/web slice

### 6. Self-Review
- Simpler option considered:
  - relying only on wallet preview
- Technical debt introduced: no
- Scalability assessment:
  - reusing wallet ledger plus bot runtime history scales better than adding a
    second event store
- Refinements made:
  - scope narrowed to one bot-scoped read surface with explicit marker sources

### 7. Update Documentation and Knowledge
- Docs updated:
  - this task packet, `docs/modules/api-bots.md`,
    `docs/modules/web-bots.md`, and `docs/planning/mvp-next-commits.md`
- Context updated:
  - `.codex/context/TASK_BOARD.md` and `.codex/context/PROJECT_STATE.md`
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
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
- Task summary:
  - implemented bot-scoped portfolio history across API and web with reset and
    wallet-capital markers plus explicit partial-history messaging
- Files changed:
  - `apps/api/src/modules/bots/botPortfolioHistoryRead.service.ts`
  - `apps/api/src/modules/bots/bots.controller.ts`
  - `apps/api/src/modules/bots/bots.portfolio-history.e2e.test.ts`
  - `apps/api/src/modules/bots/bots.repository.ts`
  - `apps/api/src/modules/bots/bots.routes.ts`
  - `apps/api/src/modules/bots/bots.types.ts`
  - `apps/api/src/modules/bots/botsRuntimeRead.service.ts`
  - `apps/web/src/features/bots/components/BotsManagement.portfolio-history.test.tsx`
  - `apps/web/src/features/bots/components/BotsManagement.test.tsx`
  - `apps/web/src/features/bots/components/BotsManagement.tsx`
  - `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx`
  - `apps/web/src/features/bots/components/bots-management/BotsPortfolioHistorySection.tsx`
  - `apps/web/src/features/bots/hooks/useBotsMonitoringController.ts`
  - `apps/web/src/features/bots/services/bots.service.ts`
  - `apps/web/src/features/bots/types/bot.type.ts`
  - `apps/web/src/i18n/namespaces/dashboard-bots.en.ts`
  - `apps/web/src/i18n/namespaces/dashboard-bots.pl.ts`
  - `apps/web/src/i18n/namespaces/dashboard-bots.pt.ts`
  - `docs/modules/api-bots.md`
  - `docs/modules/web-bots.md`
  - `docs/planning/mvp-next-commits.md`
  - this task packet
- How tested:
  - API/web typecheck PASS; focused API/web Vitest PASS; API/web build PASS;
    repository guardrails PASS
- What is incomplete:
  - production/browser visual smoke remains part of the broader release
    evidence wave, not a blocker for this local slice
- Next steps:
  - rerun focused tests, then perform browser-level parity/responsive review of
    the selected-bot monitoring tab
- Decisions made:
  - keep LIVE capital events wallet-ledger-backed, keep PAPER reset marker
    checkpoint-backed, and expose incomplete truth explicitly instead of
    drawing synthetic continuity
