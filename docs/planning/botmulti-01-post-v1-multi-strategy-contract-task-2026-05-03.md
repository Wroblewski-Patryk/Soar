# Task

## Header
- ID: BOTMULTI-01
- Title: Freeze post-V1 multi-strategy bot contract
- Task Type: research
- Current Stage: planning
- Status: DONE
- Owner: Planning Agent
- Depends on: SYSFINAL-09
- Priority: P1
- Iteration: 2026-05-03 post-V1 BOTMULTI activation
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the architecture nature of the iteration.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The `BOTMULTI-A` roadmap was deferred until the current V1 singular-bot system
was stable. `SYSFINAL-09` closed that confidence pass with local regression and
public production smoke evidence. The next planned task is therefore
architecture-only: freeze the post-V1 multi-strategy bot contract before any DB,
API, runtime, or UI implementation starts.

## Goal
Replace the singular strategy contract in architecture docs with the post-V1
target:

```text
1 bot = 1 wallet + 1 active symbol-group market scope + N enabled strategies
```

while preserving V1 safety constraints: exact venue context, wallet-owned
execution/capital context, strict selected-bot scope, deterministic signal
merge, fail-closed manual order ambiguity, and position-scoped lifecycle
ownership.

## Success Signal
- User or operator problem: multi-strategy work must not revive ambiguous legacy
  topology or regress live money-path truth.
- Expected product or reliability outcome: architecture now states the target
  contract before implementation starts.
- How success will be observed: canonical architecture docs agree on the bot,
  runtime context, signal merge, and lifecycle ownership model.
- Post-launch learning needed: no.

## Deliverable For This Stage
Architecture and planning updates only. No product code, schema, API, runtime,
or UI implementation.

## Scope
- `docs/architecture/03_domain-model.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/05_strategy-signal-and-decision-flow.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/runtime-signal-merge-contract.md`
- `docs/planning/botmulti-post-v1-multi-strategy-reintroduction-plan-2026-04-29.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Confirm `BOTMULTI-A` prerequisites are satisfied by `SYSFINAL-09`.
2. Review current architecture docs for singular-strategy and existing
   multi-strategy merge language.
3. Freeze the target contract in architecture docs.
4. Preserve explicit out-of-scope boundary: one active market scope per bot;
   multi-market-group bots remain outside this wave.
5. Record manual-order and lifecycle fail-closed rules.
6. Sync planning/context docs and run guardrails.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within planning/architecture stage
- do not modify product code in this task

## Acceptance Criteria
- Architecture states the post-V1 multi-strategy bot target.
- Legacy singular-strategy source-of-truth wording is removed from canonical
  architecture docs.
- Runtime merge and lifecycle docs define strategy provenance boundaries.
- Manual order ambiguity is fail-closed when multiple strategy links exist.
- `BOTMULTI-02` is the next executable task.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are represented for a docs-only
  planning task.
- [x] Architecture docs are updated before implementation.
- [x] No code, schema, or runtime behavior changed.
- [x] Queue/context docs are synchronized.
- [x] Repository guardrails pass after documentation sync.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- schema/API/runtime/UI implementation in `BOTMULTI-01`
- multi-market-group bot scope in this wave

## Frozen Contract
- Bot target: one wallet, one active symbol-group market scope, many enabled
  strategy links.
- Canonical strategy set: enabled `MarketGroupStrategyLink` rows under the
  active canonical `BotMarketGroup`.
- Compatibility-only fields: `Bot.strategyId`, `Bot.symbolGroupId`, and legacy
  `BotStrategy` rows.
- Manual order context:
  - one enabled strategy can be defaulted;
  - multiple enabled strategies require explicit strategy context or fail
    closed with an ambiguity error;
  - no write path may silently choose the first linked strategy.
- Runtime merge:
  - strategy outputs merge deterministically through the canonical merge
    contract;
  - merge trace must retain participating strategy outputs and primary strategy
    provenance for downstream lifecycle ownership.
- Lifecycle:
  - DCA/TTP/SL/TSL remain position-scoped;
  - the strategy provenance that opened or canonically adopted the position owns
    the active protection ladder until close or a later explicit transfer
    contract.

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm run docs:parity:check` => PASS.
- Manual checks:
  - Reviewed `docs/planning/botmulti-post-v1-multi-strategy-reintroduction-plan-2026-04-29.md`.
  - Reviewed `docs/architecture/03_domain-model.md`.
  - Reviewed `docs/architecture/04_runtime-contexts.md`.
  - Reviewed `docs/architecture/05_strategy-signal-and-decision-flow.md`.
  - Reviewed `docs/architecture/06_execution-lifecycle.md`.
  - Reviewed `docs/architecture/reference/runtime-signal-merge-contract.md`.
  - Reviewed current Prisma bot topology enough to confirm existing
    `BotMarketGroup` and `MarketGroupStrategyLink` persistence seams.
- Screenshots/logs: not applicable.
- High-risk checks: no code, DB, LIVE, or deployment mutation.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/03_domain-model.md`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes.
- Mismatch discovered: yes, historical singular-strategy docs conflicted with
  the existing multi-strategy merge reference.
- Decision required from user: no. The user already approved executing planned
  tasks, and `BOTMULTI-A` was a deferred approved roadmap unlocked after V1
  stability.
- Approval reference if architecture changed:
  `docs/planning/botmulti-post-v1-multi-strategy-reintroduction-plan-2026-04-29.md`.
- Follow-up architecture doc updates: `BOTMULTI-02` must inventory remaining
  stale module/code compatibility surfaces before schema/API changes.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: current dashboard design system.
- Canonical visual target: not changed in this task.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: not applicable.
- Visual-direction brief reviewed: not applicable.
- Existing shared pattern reused: not applicable.
- New shared pattern introduced: no.
- Design-memory entry reused: not applicable.
- Design-memory update required: no.
- Visual gap audit completed: not applicable.
- Background or decorative asset strategy: not applicable.
- Canonical asset extraction required: no.
- Screenshot comparison pass completed: not required.
- Remaining mismatches: UI exposure deferred to `BOTMULTI-07`.
- Required states: deferred to implementation tasks.
- Responsive checks: deferred to implementation tasks.
- Input-mode checks: deferred to implementation tasks.
- Accessibility checks: deferred to implementation tasks.
- Parity evidence: architecture-only.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: none.
- Rollback note: documentation-only contract update; revert docs if the
  architecture direction changes.
- Observability or alerting impact: none.
- Staged rollout or feature flag: future implementation tasks must define
  rollout controls.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `BOTMULTI-A` was deferred, and architecture docs still mixed singular
  strategy wording with a multi-strategy merge contract.
- Gaps: canonical post-V1 contract needed to be frozen before code changes.
- Inconsistencies: singular-strategy runtime context versus existing
  multi-strategy merge reference.
- Architecture constraints: exact venue context, wallet-first execution
  context, selected-bot strictness, and fail-closed lifecycle safety.

### 2. Select One Priority Task
- Selected task: `BOTMULTI-01`.
- Priority rationale: it is the first unchecked planned task after `SYSFINAL`
  closure and must precede implementation.
- Why other candidates were deferred: `BOTMULTI-02..08` depend on this frozen
  architecture target.

### 3. Plan Implementation
- Files or surfaces to modify: architecture docs and planning/context files.
- Logic: docs-only source-of-truth update.
- Edge cases: avoid accidentally expanding scope to multi-market-group bots or
  implementing DB/API changes in the architecture task.

### 4. Execute Implementation
- Implementation notes: updated architecture wording and planning status only.

### 5. Verify and Test
- Validation performed: architecture review, repository guardrails, and docs
  parity.
- Result: contract frozen; no runtime behavior changed.

### 6. Self-Review
- Simpler option considered: jump directly to schema/API implementation.
- Technical debt introduced: no.
- Scalability assessment: the contract narrows a broad architecture change into
  ordered follow-up tasks.
- Refinements made: lifecycle ownership remains position-scoped to avoid
  multi-strategy protection ambiguity.

### 7. Update Documentation and Knowledge
- Docs updated:
  - architecture docs listed in scope
  - planning packet
  - this task artifact
  - context and queue docs
- Context updated: yes.
- Learning journal updated: not applicable.

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
- [x] Relevant validations were run after final sync.
- [x] Docs or context were updated because repository truth changed.
- [x] Learning journal update is not applicable.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: future operator using multi-strategy bot
  management/runtime truth.
- Existing workaround or pain: legacy topology ambiguity could return if the
  contract is not explicit.
- Smallest useful slice: architecture-only contract freeze.
- Success metric or signal: `BOTMULTI-02` can audit implementation debt against
  one target.
- Feature flag, staged rollout, or disable path: future implementation tasks
  must define rollout controls.
- Post-launch feedback or metric check: not applicable.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable.
- Critical user journey: future bot create/edit/runtime with multiple strategy
  provenance.
- SLI: not applicable for docs-only task.
- SLO: not applicable.
- Error budget posture: not applicable.
- Health/readiness check: not impacted.
- Logs, dashboard, or alert route: future runtime tasks must preserve merge
  trace observability.
- Smoke command or manual smoke: not applicable.
- Rollback or disable path: documentation-only revert.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: represented through contract-first
  sequencing.
- Real API/service path used: not applicable.
- Endpoint and client contract match: deferred to `BOTMULTI-04` and
  `BOTMULTI-07`.
- DB schema and migrations verified: not changed.
- Loading state verified: not applicable.
- Error state verified: fail-closed manual-order ambiguity documented.
- Refresh/restart behavior verified: not changed.
- Regression check performed: guardrails and docs parity after sync.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable.
- Data classification: trading configuration and runtime provenance.
- Trust boundaries: browser, API, DB, runtime engine, exchange adapters.
- Permission or ownership checks: future implementation must preserve existing
  ownership isolation.
- Abuse cases: silent strategy selection could cause unintended trading intent;
  contract now forbids it.
- Secret handling: not touched.
- Security tests or scans: not required.
- Fail-closed behavior: manual order ambiguity and missing provenance must fail
  closed.
- Residual risk: implementation debt remains until `BOTMULTI-02..08`.

## Result Report
- Task summary: froze the post-V1 BOTMULTI architecture contract.
- Files changed: architecture and planning/context docs only.
- How tested: repository guardrails and docs parity.
- What is incomplete: no DB/API/runtime/web implementation yet.
- Next steps: `BOTMULTI-02` inventory of legacy compatibility remnants and
  migration debt.
- Decisions made: post-V1 target is one bot, one wallet, one active market
  scope, and many enabled strategy links; multi-market-group bots remain out of
  scope.
