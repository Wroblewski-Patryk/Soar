# V1DCA-01 Runtime Positions DCA Visibility

## Header
- ID: V1DCA-01
- Title: Preserve DCA visibility after exchange-sync position replacement
- Task Type: fix
- Current Stage: implementation
- Status: DONE
- Owner: Backend Builder
- Depends on: V1HIST-10, V1AUTO-01, V1ROE-04
- Priority: P0

## Context
Production observation on 2026-05-01 showed a `LIVE` DOGEUSDT DCA fill in the
trade ledger while the selected bot dashboard `Positions` table still rendered
the current DOGEUSDT open row with `dcaCount=0`. Protected API inspection
confirmed that the DCA trade existed with `lifecycleAction=DCA`, but it was
linked to a superseded local `positionId` while the current exchange-synced
open row had a newer `positionId`.

The approved `LIVE Runtime Lifecycle Parity Contract` requires DCA add fills to
preserve DCA semantics, and the `LIVE Protection-State Parity Contract` treats
runtime DCA progression as operator-visible protection truth.

## Goal
Make the runtime positions read model show canonical DCA progression for the
current managed open position even when exchange reconciliation replaced the
local position row after the DCA fill.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
- `docs/planning/v1dca-visibility-runtime-positions-task-2026-05-01.md`
- Canonical context/planning docs updated after verification.

## Implementation Plan
1. Add a focused regression where a current imported/open managed position has
   an `EXCHANGE_SYNC OPEN` anchor while a same-session BOT DCA trade remains
   linked to the superseded position row.
2. Extend the runtime positions trade query to include same-session DCA
   candidate trades in addition to direct `positionId` matches.
3. Attach only deterministic supplemental DCA rows to current open positions
   when user, bot, wallet, strategy, symbol, side, and lifecycle window match.
4. Deduplicate direct and supplemental rows by trade id and keep chronological
   ordering.
5. Run focused API validation, typecheck, guardrails, then sync docs/context.

## Acceptance Criteria
- The current open DOGEUSDT runtime position can report `dcaCount=1` when the
  DCA trade is linked to a superseded prior position row.
- Direct same-position DCA visibility remains green.
- Supplemental DCA attachment is scoped to the same bot/wallet/strategy/symbol
  and session lifecycle window.
- No fake rows, mock data, or UI-only fallback are introduced.

## Constraints
- Use the persisted trade ledger as the canonical source.
- Keep the fix inside the existing bots runtime positions read ownership.
- Do not introduce a parallel lifecycle model or temporary workaround.
- Do not weaken runtime protection-state parity.

## Definition of Done
- [x] Focused regression proves DCA visibility across exchange-sync position
  replacement.
- [x] API typecheck passes.
- [x] Repository guardrails pass.
- [x] Context and planning docs record the production runtime fix and evidence.
- [x] `DEFINITION_OF_DONE.md` applicable checks are satisfied.

## Stage Exit Criteria
- [x] The runtime read model uses real persisted trade rows only.
- [x] Validation evidence is recorded.
- [x] Residual risks are stated.

## Forbidden
- Display-only fake DCA count.
- Counting deposits, order attempts, or non-DCA rows as DCA.
- Broad `userId + symbol` matching without bot/wallet/strategy scope.
- Architecture changes without explicit approval.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
    => PASS, `2/2`.
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm --filter api run build` => PASS.
  - `pnpm run quality:guardrails` => PASS.
- Manual checks: protected production API shape was inspected before the task;
  post-deploy verification remains a release follow-up after commit deploys.
- Screenshots/logs: not applicable.
- High-risk checks: money-impacting read path uses persisted trade ledger and
  fail-closed scoping.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
  - `docs/architecture/reference/live-protection-state-parity-contract.md`
  - `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected unless verification exposes
  write-side lifecycle replacement drift that needs a separate contract update.

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous read-model behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: existing API deploy path.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: no schema change expected
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: persisted read model, no in-memory state
  dependency
- Regression check performed: focused imported DCA visibility e2e PASS.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: authenticated user trading/runtime data
- Trust boundaries: dashboard API user/bot ownership checks remain unchanged
- Permission or ownership checks: existing route/session/bot ownership plus
  trade candidate scoping
- Abuse cases: avoid broad cross-bot DCA attribution
- Secret handling: production credentials are not persisted or documented
- Security tests or scans: guardrails/typecheck PASS
- Fail-closed behavior: supplemental DCA rows require deterministic identity
  match
- Residual risk: post-deploy production verification is still required to prove
  the live DOGE row updates after Coolify deploy.

## Result Report
- Task summary: fixed runtime positions DCA visibility after exchange-sync
  position replacement by bridging canonical persisted DCA trades into the
  current open lifecycle read model under strict identity scope.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
  - `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
  - canonical planning/context docs
- How tested:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter api run build`
  - `pnpm run quality:guardrails`
- What is incomplete: protected production post-deploy verification after
  Coolify deploy.
- Next steps: after deploy, re-check the protected `LIVE` DOGEUSDT runtime
  positions endpoint and dashboard row to confirm `dcaCount=1`.
- Decisions made: no architecture change; the fix reuses the persisted trade
  ledger and existing bots runtime positions read ownership.
