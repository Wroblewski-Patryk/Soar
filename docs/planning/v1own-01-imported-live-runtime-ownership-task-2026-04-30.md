# Task

## Header
- ID: V1OWN-01
- Title: Hydrate imported owned LIVE positions into canonical runtime ownership
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1AUTO-01, V1ROE-03
- Priority: P0

## Context
Protected production verification on the active `LIVE DOGEUSDT` flow proved a
newer, narrower drift than price parity alone. The imported `EXCHANGE_SYNC`
row was visible on runtime surfaces and looked `BOT_MANAGED`, but
`runtimePositionAutomation` still skipped imported rows when `position.botId`
was `null`, and the signal-loop open-position count still used direct
`botId`-scoped rows only. That left the system in an inconsistent state:
operator surfaces could show an owned imported position while the runtime
engine still behaved as if no canonical bot-owned open position existed.

## Goal
Make imported owned `LIVE` positions participate in the same canonical runtime
ownership path as direct bot-owned rows, without introducing a parallel
takeover/runtime system.

## Scope
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts`
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.test.ts`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`

## Success Signal
- User or operator problem: imported `LIVE` positions visible on the dashboard
  no longer remain dormant just because the underlying row still has
  `botId=null`.
- Expected product or reliability outcome: runtime automation can execute
  `DCA/TTP/TSL` on canonically owned imported rows, and signal-loop bot-scope
  open-position counting no longer ignores those rows.
- How success will be observed: focused automated proofs show owned imported
  rows are hydrated into runtime ownership for automation and for bot-scope
  open-position counting.
- Post-launch learning needed: yes

## Deliverable For This Stage
Implemented code, focused regression coverage, and synchronized repository
truth describing the closure and the next protected production verification.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Reuse the canonical external-position ownership contract inside
   `runtimePositionAutomation` default position lookup so owned imported
   `EXCHANGE_SYNC` rows can be hydrated with effective bot execution context.
2. Reuse the same ownership contract in signal-loop open-position counting so
   max-open-position logic and runtime bot scope no longer ignore imported
   owned rows.
3. Lock both seams with focused tests.
4. Sync queue, state, and learning journal.

## Acceptance Criteria
- Imported owned `EXCHANGE_SYNC` rows can reach runtime automation with an
  effective bot execution context even when the persisted row still has
  `botId=null`.
- Bot-scope open-position counting for runtime signal decisions includes owned
  imported `LIVE` rows.
- The fix stays inside the existing external-position ownership contract.

## Definition of Done
- [x] Imported owned runtime automation no longer depends solely on persisted `botId`.
- [x] Bot-scope open-position counting includes owned imported `LIVE` rows.
- [x] Focused tests, API typecheck, and repository guardrails are green.

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
- Tests: `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts`
- Manual checks: none in this stage
- Screenshots/logs: focused Vitest pass
- High-risk checks: imported owned runtime automation, bot-scope open-position counting

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the runtime ownership hydration/count slice
- Observability or alerting impact: improves runtime truth indirectly
- Staged rollout or feature flag: no

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

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: yes
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: trading runtime metadata
- Trust boundaries: runtime engine, exchange ownership classifier, bot scope
- Permission or ownership checks: reused canonical external-position ownership contract
- Abuse cases: imported manual/ambiguous rows must stay fail-closed
- Secret handling: none
- Security tests or scans: focused fail-closed tests
- Fail-closed behavior: rows without canonical ownership still skip automation
- Residual risk: protected prod verification still required

## Result Report
- Task summary: imported owned `LIVE` positions are now hydrated into runtime
  automation and bot-scope open-position counting through the canonical
  external-position ownership contract.
- Files changed: runtime automation, runtime signal-loop defaults, focused
  tests, queue/context docs.
- How tested: focused Vitest pack, API typecheck, repository guardrails.
- What is incomplete: protected production verification of the active
  `DOGEUSDT` flow.
- Next steps: rerun the protected prod `DOGEUSDT` checks after deploy and
  confirm `DCA/TTP` activity plus updated runtime session truth.
- Decisions made: no architecture change; reuse the existing ownership
  classifier rather than rebinding imported rows eagerly.
