# V1SUBS-01 Live Entitlement Bot Write Guard Task

## Header
- ID: V1SUBS-01
- Title: Enforce live-trading entitlement in bot write paths
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: `V1SCOPE-01`
- Priority: P1
- Iteration: V1 scope verification pass 2
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`V1SCOPE-01` left `SUBS-ENTITLEMENTS-001` as the only lower-priority row still
classified `IN_V1`. The architecture and product docs both say entitlements
gate live-trading capability, but the current bot write path explicitly checks
only bot-count limits on create and does not protect the `PAPER -> LIVE`
update path against a plan with `features.liveTrading=false`.

## Goal
Make bot create/update fail closed when a user without live-trading entitlement
tries to create a LIVE bot or switch a bot into LIVE mode, and capture focused
evidence for that V1 entitlement contract.

## Scope
- `apps/api/src/modules/subscriptions/subscriptionEntitlements.service.ts`
- `apps/api/src/modules/subscriptions/subscriptions.errors.ts`
- `apps/api/src/modules/bots/botsCommand.service.ts`
- `apps/api/src/modules/bots/bots.controller.ts`
- `apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts`
- `docs/modules/api-bots.md`
- `docs/modules/api-subscriptions.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Success Signal
- User or operator problem:
  users without LIVE entitlement cannot bypass the plan contract through bot
  create/update flows.
- Expected product or reliability outcome:
  LIVE capability follows the approved entitlement contract and fails closed on
  write paths.
- How success will be observed:
  focused API e2e proves LIVE create and `PAPER -> LIVE` switch are rejected
  when `features.liveTrading=false`.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement the backend guard, add focused regression coverage, and sync the V1
planning/context docs to reflect the new entitlement evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] LIVE bot create path checks live-trading entitlement explicitly.
- [x] `PAPER -> LIVE` bot update path cannot bypass the same entitlement rule.
- [x] Focused regression evidence and canonical docs are updated.

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
- Tests: to be filled after implementation
- Manual checks: not applicable for this backend-focused slice
- Screenshots/logs: not applicable
- High-risk checks: verify fail-closed response shape for unauthorized LIVE capability

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docs/architecture/10_safety-entitlements-and-risk.md`,
  `docs/architecture/reference/subscription-tier-entitlements-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: none
- Rollback note: revert the bot-write entitlement guard and focused e2e additions
- Observability or alerting impact: none
- Staged rollout or feature flag: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  current create flow enforces only bot-count limits; current update flow does
  not re-check entitlement when switching mode into LIVE.
- Gaps:
  no focused proof that `features.liveTrading=false` blocks LIVE create/update.
- Inconsistencies:
  product + architecture declare live-trading entitlement gating, while the
  write path can rely only on mode-count semantics.
- Architecture constraints:
  reuse the subscription entitlement service and keep bot write paths fail
  closed.

### 2. Select One Priority Task
- Selected task:
  enforce live-trading entitlement in bot create/update paths.
- Priority rationale:
  this is the remaining `IN_V1` entitlement row and affects money-impacting
  LIVE capability.
- Why other candidates were deferred:
  stage/prod gate work is externally blocked; route-smoke work is lower value
  than a real entitlement gap.

### 3. Plan Implementation
- Files or surfaces to modify:
  subscription entitlement service/errors, bot command/controller path, focused
  bots entitlement e2e, module docs, queue/context docs.
- Logic:
  add one reusable live-capability assertion, call it from LIVE create and
  `PAPER -> LIVE` transition paths, and return a deliberate API error payload.
- Edge cases:
  keep existing bot-count enforcement unchanged; avoid blocking de-risking
  updates on already-LIVE bots unless they newly switch into LIVE.

### 4. Execute Implementation
- Implementation notes:
  - added `SubscriptionFeatureUnavailableError` plus shared
    `assertSubscriptionAllowsLiveTrading(...)` entitlement guard
  - enforced the guard on LIVE bot create inside the same transaction as the
    bot-count check
  - enforced the guard on `PAPER -> LIVE` mode switch before the existing
    open-paper-position safety gate
  - mapped the new error to an explicit `403` API response in bot controller
  - extended focused entitlement e2e with LIVE create and mode-switch denial
    scenarios

### 5. Verify and Test
- Validation performed:
  - `node node_modules/typescript/bin/tsc -p apps/api/tsconfig.json --noEmit`
  - `pnpm --filter api exec vitest run src/modules/bots/bots.subscription-entitlements.e2e.test.ts`
  - `pnpm --filter api run build`
  - `pnpm run quality:guardrails`
- Result:
  - `apps/api` typecheck PASS
  - focused entitlement e2e PASS (`5/5`)
  - API build PASS
  - repository guardrails PASS

### 6. Self-Review
- Simpler option considered:
  relying on `maxBotsByMode.LIVE=0` alone, rejected because plan edits can make
  counts and feature flags diverge and update flow bypasses create-time checks.
- Technical debt introduced: no
- Scalability assessment:
  one reusable entitlement assertion keeps future LIVE write-path checks
  centralized.
- Refinements made:
  - kept LIVE entitlement enforcement in the shared subscription service
    instead of duplicating feature checks in controllers
  - moved LIVE create enforcement into the same transaction that already owns
    bot-count evaluation

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/modules/api-bots.md`
  - `docs/modules/api-subscriptions.md`
  - `docs/planning/mvp-next-commits.md`
  - this task packet
- Context updated:
  - `.codex/context/TASK_BOARD.md` and `.codex/context/PROJECT_STATE.md`
- Learning journal updated: not applicable.

## Review Checklist (mandatory)
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
This task is intentionally limited to bot write-path entitlement enforcement
for LIVE capability. It does not attempt a full billing/runtime post-expiry
policy pass.

## Result Report

- Task summary:
  fail-closed LIVE entitlement enforcement now blocks unsupported LIVE bot
  create and `PAPER -> LIVE` transition paths.
- Files changed:
  - `apps/api/src/modules/subscriptions/subscriptionEntitlements.service.ts`
  - `apps/api/src/modules/subscriptions/subscriptions.errors.ts`
  - `apps/api/src/modules/bots/botsCommand.service.ts`
  - `apps/api/src/modules/bots/bots.controller.ts`
  - `apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts`
  - `docs/modules/api-bots.md`
  - `docs/modules/api-subscriptions.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/tasks/v1subs-01-live-entitlement-bot-write-guard-task-2026-05-01.md`
- How tested:
  `apps/api` local typecheck PASS; focused entitlement e2e PASS (`5/5`);
  API build PASS; repository guardrails PASS.
- What is incomplete:
  production entitlement smoke is still part of the broader authenticated
  release-gate evidence wave.
- Next steps:
  run `bots.subscription-entitlements.e2e.test.ts` plus guardrails outside this
  sandbox, then continue with the next local `IN_V1` or evidence-driven V1 task.
- Decisions made:
  - feature-flag truth (`features.liveTrading`) is authoritative alongside
    count pools for LIVE capability
  - `PAPER -> LIVE` mode switch is treated as a LIVE capability boundary and
    must fail closed without entitlement
