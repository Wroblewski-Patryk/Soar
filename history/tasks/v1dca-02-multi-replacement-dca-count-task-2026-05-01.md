# Task

## Header
- ID: V1DCA-02
- Title: Preserve multi-level DCA visibility across repeated exchange-sync position replacements
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: V1DCA-01
- Priority: P0

## Context
The production DOGEUSDT trade ledger showed two persisted `BOT` `DCA` fills in
the active runtime session, while the runtime `Positions` row could still show
only one executed DCA level after exchange sync replaced the local open
position row more than once. `V1DCA-01` fixed the first replacement case, but
its lifecycle window still started at the current replacement row's
`openedAt`, which excluded older DCA fills from the same uninterrupted
position lifecycle.

## Goal
Keep the dashboard runtime `Positions` DCA count aligned with persisted
trade-ledger truth when one open imported managed position is represented by
several consecutive `EXCHANGE_SYNC` replacement rows.

## Success Signal
- User or operator problem: DOGEUSDT has two real DCA fills but the dashboard
  can imply only one executed DCA level.
- Expected product or reliability outcome: the current runtime position shows
  all persisted DCA fills that belong to the same uninterrupted lifecycle.
- How success will be observed: focused API regression returns `dcaCount=2`,
  `dcaExecutedLevels=[-10,-20]`, and ignores unrelated unscoped DCA rows.
- Post-launch learning needed: yes

## Deliverable For This Stage
One backend read-model fix, one focused regression, and source-of-truth docs
sync. Production verification remains a post-deploy follow-up because the
commit must first be deployed by the target environment.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Inspect protected production DOGEUSDT trade and positions payloads.
2. Extend the existing runtime positions read model to resolve lifecycle
   continuity from same-session persisted `OPEN/DCA/CLOSE` trade rows instead
   of using only the current replacement row's `openedAt`.
3. Keep supplemental DCA matching constrained to persisted rows with matching
   bot/wallet/strategy/symbol/side identity.
4. Add a regression with two DCA fills linked to superseded position ids and a
   current exchange-sync replacement row.
5. Run focused and deploy-relevant validation.
6. Update canonical planning/context docs and record the recurring pitfall.

## Acceptance Criteria
- [x] Current open runtime position counts multiple DCA fills linked to
  superseded replacement rows from the same uninterrupted lifecycle.
- [x] A DCA row with missing strategy identity is not counted.
- [x] The read model still deduplicates direct and supplemental trades by
  persisted trade id.
- [x] Focused imported DCA visibility regression passes.
- [x] Lint, API typecheck, API build, and repository guardrails pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` reviewed and applicable checks satisfied.
- [x] No mock-only path, display-only counter, or temporary workaround is
  introduced.
- [x] Runtime behavior is derived from persisted trade-ledger truth.
- [x] Documentation and context are synchronized.

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
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts --run` => PASS (`3/3`)
  - `pnpm --filter api run typecheck` => PASS
  - `pnpm --filter api run build` => PASS
  - `pnpm run lint` => PASS
  - `pnpm run quality:guardrails` => PASS
- Manual checks:
  - Protected production ledger inspection confirmed the active session summary
    had `dcaCount=2` and the DOGEUSDT trade ledger contained two persisted
    `BOT/DCA` rows linked to superseded position ids.
- Screenshots/logs: not applicable
- High-risk checks:
  - Supplemental DCA rows still require matching persisted trade identity:
    bot/wallet/strategy/symbol/entry side and session window.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/architecture-source-of-truth.md`
  - `DEFINITION_OF_DONE.md`
  - `INTEGRATION_CHECKLIST.md`
  - `NO_TEMPORARY_SOLUTIONS.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required; this refines an existing
  runtime read-model contract without changing ownership.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: not required
- Rollback note: revert the backend read-model commit if runtime positions DCA
  visibility regresses.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Review Checklist
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
Production positions payload returned no current DOGEUSDT row during the
pre-fix inspection, but the ledger evidence still reproduced the counting class:
two real DOGEUSDT DCA fills in the active session summary and trade ledger,
with both linked to superseded local position ids.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes, read model is recomputed from
  persisted rows.
- Regression check performed: focused API e2e

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: production dashboard operator
- Existing workaround or pain: manual trade-ledger inspection was needed to see
  both DCA fills.
- Smallest useful slice: runtime positions read-model fix plus regression.
- Success metric or signal: dashboard/API `dcaCount` matches persisted DCA
  rows for the active lifecycle.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: post-deploy protected DOGEUSDT
  positions verification.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: runtime dashboard position monitoring
- SLI: runtime positions endpoint returns ledger-aligned DCA counts
- SLO: not applicable for this narrow read-model fix
- Error budget posture: not applicable
- Health/readiness check: existing API health/readiness
- Logs, dashboard, or alert route: not changed
- Smoke command or manual smoke: focused API regression
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: authenticated user runtime trading data
- Trust boundaries: unchanged; existing endpoint ownership checks remain in
  force.
- Permission or ownership checks: unchanged `getOwnedBotRuntimeSession` and
  bot-scoped query constraints.
- Abuse cases: broad cross-bot trade counting is prevented by scoped identity
  matching.
- Secret handling: credentials used only as transient environment variables
  during production inspection.
- Security tests or scans: repository guardrails PASS
- Fail-closed behavior: DCA rows without canonical strategy identity are not
  counted.
- Residual risk: post-deploy production verification is still required after
  Coolify deploys the commit.

## Result Report
- Task summary: runtime positions DCA continuity now spans repeated
  exchange-sync replacement rows inside one uninterrupted lifecycle.
- Files changed: see Scope.
- How tested: focused imported DCA visibility API e2e, lint, API typecheck,
  API build, and repository guardrails passed.
- What is incomplete: post-deploy protected production DOGEUSDT verification.
- Next steps: deploy current `main` and rerun protected DOGEUSDT positions
  verification.
- Decisions made: persisted trade-ledger truth remains the only DCA display
  source; no display-only counter was introduced.
