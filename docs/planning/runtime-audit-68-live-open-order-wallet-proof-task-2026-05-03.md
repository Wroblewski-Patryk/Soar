# Task

## Header
- ID: RUNTIME-AUDIT-68
- Title: Require wallet proof for LIVE botless exchange-synced open orders
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-67
- Priority: P1
- Iteration: 68
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Operator-reported LIVE/PAPER dashboard drift is being reduced through small
runtime read-model hardening slices. Recent work made imported position
ownership market-scoped. During the next audit pass, runtime session positions
still accepted botless LIVE `EXCHANGE_SYNC` open orders with `walletId = null`
when the symbol was externally owned by the bot.

## Goal
Make LIVE runtime dashboard open-order reads fail closed for botless
exchange-synced orders unless the row has wallet-level ownership proof.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: dashboard open-order counts must not include stale
  or global botless exchange-synced rows that only share the bot symbol.
- Expected product or reliability outcome: LIVE dashboard order state reflects
  deterministic bot/wallet ownership.
- How success will be observed: focused API regression proves wallet-null
  botless exchange-sync orders are excluded while wallet-owned rows remain
  visible.
- Post-launch learning needed: yes

## Deliverable For This Stage
Implement and verify one focused backend regression and read-filter fix.

## Constraints
- Use existing runtime read filters and ownership index mechanisms.
- Do not add a new ownership system for orders in this slice.
- Do not change position ownership behavior.
- Keep the runtime positions read service within guardrail budgets.

## Implementation Plan
1. Add a failing runtime-scope e2e case for LIVE botless exchange-sync open
   orders with and without wallet proof.
2. Narrow `externalOwnedOrderWhere` so LIVE botless exchange-sync orders must
   match the bot wallet exactly.
3. Run focused API tests, typecheck, guardrails, lint, and diff review.
4. Sync task board, project state, and MVP queue with evidence.

## Acceptance Criteria
- LIVE botless `EXCHANGE_SYNC` open order with matching `walletId` remains
  visible to the owning bot.
- LIVE botless `EXCHANGE_SYNC` open order with `walletId = null` is not counted
  or listed for the bot.
- Existing bot-scoped wallet-null orders remain covered by `botScopedOrderWhere`.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` applicable items are satisfied with evidence.
- [x] Focused regression passes.
- [x] API typecheck, guardrails, lint, and diff review pass.
- [x] Source-of-truth docs are updated.

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
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run` => PASS (`14/14`)
  - `pnpm --filter api run typecheck` => PASS
  - `pnpm run quality:guardrails` => PASS
  - `pnpm run lint` => PASS
  - `git diff --check` => PASS
- Manual checks: code review of runtime order filter and regression fixture
- Screenshots/logs: not applicable
- High-risk checks: fail-closed ownership regression for botless LIVE order rows

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous order read filter.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: LIVE dashboard open-order read allowed botless exchange-synced orders
  with no wallet proof when symbol ownership matched.
- Gaps: `Order` rows do not carry imported external position IDs, so wallet
  proof is the available deterministic legacy discriminator for botless orders.
- Inconsistencies: synced owned orders created by reconciliation already carry
  bot/wallet ownership, while the dashboard read filter still tolerated global
  botless rows.
- Architecture constraints: runtime must pass ownership and lifecycle
  guardrails after merge; dashboard must reflect persisted scoped truth.

### 2. Select One Priority Task
- Selected task: require wallet proof for LIVE botless exchange-synced open
  order visibility.
- Priority rationale: money-impacting dashboard management state.
- Why other candidates were deferred: broader order upsert owner scoping is a
  separate write-path audit candidate and should not be mixed into this read
  filter slice.

### 3. Plan Implementation
- Files or surfaces to modify: runtime positions read service, focused e2e
  runtime-scope test, source-of-truth docs.
- Logic: replace LIVE botless open-order wallet `OR(walletId, null)` with exact
  wallet match.
- Edge cases: keep bot-scoped wallet-null rows visible through the existing
  bot-scoped filter; keep PAPER behavior unchanged.

### 4. Execute Implementation
- Implementation notes: `externalOwnedOrderWhere` now requires exact
  `walletId` for LIVE botless exchange-synced open orders; bot-scoped
  wallet-null rows remain visible through `botScopedOrderWhere`.

### 5. Verify and Test
- Validation performed: focused runtime-scope e2e, API typecheck, repository
  guardrails, lint, and diff whitespace check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: removing botless order fallback entirely, but
  exact wallet proof preserves existing legacy wallet-owned rows safely.
- Technical debt introduced: no
- Scalability assessment: sufficient for V1 read-model hardening; write-path
  ownership scoping remains queued separately.
- Refinements made: kept implementation line-neutral in the guarded runtime
  positions read service.

### 7. Update Documentation and Knowledge
- Docs updated: this task, MVP next commits queue.
- Context updated: task board and project state.
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

## Notes
This task is intentionally read-path only.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: persisted DB read path
- Regression check performed: pending

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE bot operator reading dashboard order state
- Existing workaround or pain: dashboard order counts can appear inconsistent
- Smallest useful slice: read filter hardening for botless exchange-sync orders
- Success metric or signal: focused regression and runtime dashboard parity
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: review production dashboard after deploy

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: LIVE bot dashboard management-state monitoring
- SLI: runtime dashboard order-state correctness
- SLO: dashboard should not include unowned botless rows
- Error budget posture: not applicable
- Health/readiness check: not affected
- Logs, dashboard, or alert route: not affected
- Smoke command or manual smoke: focused API regression
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: user trading/order metadata
- Trust boundaries: authenticated dashboard API, per-user DB ownership
- Permission or ownership checks: bot/session ownership plus wallet-scoped
  botless fallback
- Abuse cases: stale global botless order row appears in another bot dashboard
- Secret handling: no secrets touched
- Security tests or scans: focused ownership regression
- Fail-closed behavior: wallet-null botless LIVE order excluded
- Residual risk: write-path exchange order upsert owner scoping remains a
  separate audit candidate

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: LIVE runtime session positions no longer attribute botless
  exchange-synced open orders to a bot when the order has no wallet proof.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/runtime-audit-68-live-open-order-wallet-proof-task-2026-05-03.md`
- How tested: focused runtime-scope e2e (`14/14`), API typecheck, guardrails,
  lint, and diff check all passed.
- What is incomplete: broader exchange order upsert owner scoping remains a
  separate audit candidate.
- Next steps: audit write-path order reconciliation scoping by owner/wallet.
- Decisions made: exact wallet proof is required for LIVE botless open-order
  fallback; bot-scoped wallet-null rows remain valid through the bot filter.
