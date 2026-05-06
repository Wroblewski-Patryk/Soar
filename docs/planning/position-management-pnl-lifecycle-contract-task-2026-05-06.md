# Task

## Header
- ID: PMPLC-01
- Title: Freeze PnL-based position management lifecycle contract
- Task Type: design
- Current Stage: release
- Status: DONE
- Owner: Planning Agent
- Depends on: existing execution lifecycle architecture
- Priority: P1
- Iteration: 2026-05-06 architecture sync
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches architecture-source-of-truth work.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator clarified expected PnL/ROI-percent behavior for DCA, basic
TP/SL, advanced TTP/TSL, exchange-backed protection orders, and bot/exchange
reconciliation. Existing architecture already had a DCA-first rule, PAPER/LIVE
parity, LIVE import/recovery constraints, and dynamic-stop display contracts,
but it did not fully specify positive/negative DCA lanes, unreachable DCA
warnings, TTP/TSL field semantics, unaffordable-DCA policy, or the logical
runtime loop shape.

## Goal
Record the clarified position-management behavior as canonical architecture so
future implementation tasks and backtest/runtime parity work have a precise
source of truth.

## Scope
- `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-exchange-protection-order-contract.md`
- `docs/architecture/README.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Success Signal
- User or operator problem: implementers need unambiguous strategy lifecycle
  behavior from PnL percent.
- Expected product or reliability outcome: runtime, backtest, paper, and live
  implementation tasks can converge on one lifecycle contract.
- How success will be observed: architecture docs contain the clarified rules
  and source-of-truth context points to the new contract.
- Post-launch learning needed: no.

## Deliverable For This Stage
Canonical documentation updates and task evidence only; no runtime code changes.

## Constraints
- use existing architecture docs and reference-contract pattern
- do not introduce runtime behavior or schema changes in this task
- do not create workaround paths
- keep repository artifacts in English

## Implementation Plan
1. Add a dedicated architecture reference contract for PnL-based lifecycle
   behavior.
2. Link the contract from the main execution lifecycle and parity contracts.
3. Extend live protection-order and live runtime parity docs for DCA
   reachability and imported-position adoption.
4. Sync planning/context files with closure evidence.
5. Run docs-relevant guardrails and review the diff.

## Acceptance Criteria
- The contract defines `basic` versus `advanced` close authority.
- The contract defines positive and negative DCA lanes and execution order.
- The contract captures DCA-first close gating and unaffordable-DCA policy.
- The contract captures basic TP/SL reachability warnings for DCA.
- The contract captures TTP/TSL activation versus trail-distance semantics and
  monotonic ratcheting.
- The contract captures live order/position reconciliation and adoption-point
  behavior for manual exchange positions.
- Planning and context docs point to the evidence.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` reviewed for applicable documentation task
  requirements.
- [x] Relevant architecture source of truth updated.
- [x] Planning/context source of truth updated.
- [x] Validation evidence recorded.
- [x] No runtime code changed.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new runtime systems
- duplicated lifecycle logic
- temporary bypasses
- implementation changes hidden inside an architecture commit
- silent downgrade of exchange-protection safety semantics

## Validation Evidence
- Tests: `pnpm run quality:guardrails` PASS.
- Manual checks: architecture diff review PASS.
- Screenshots/logs: not applicable.
- High-risk checks: docs-only task; no money-impacting code path changed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/reference/execution-lifecycle-parity-contract.md`
  - `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
  - `docs/architecture/reference/live-exchange-protection-order-contract.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no; user approved recording clarified behavior.
- Approval reference if architecture changed: user request on 2026-05-06 to
  add the agreed behavior and commit it.
- Follow-up architecture doc updates:
  `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`.

## UX/UI Evidence
- Design source type: not applicable.
- Design source reference: not applicable.
- Canonical visual target: not applicable.
- Fidelity target: not applicable.
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
- Screenshot comparison pass completed: not applicable.
- Remaining mismatches: none.
- Required states: not applicable.
- Responsive checks: not applicable.
- Input-mode checks: not applicable.
- Accessibility checks: not applicable.
- Parity evidence: architecture contract requires backtest/paper/live parity.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this docs-only commit.
- Observability or alerting impact: future runtime tasks must expose
  unaffordable-DCA and fail-closed skip telemetry.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: DCA-first existed, but PnL-level examples and warnings were not fully
  canonical.
- Gaps: positive/negative DCA lanes, TP/SL reachability warnings, TTP/TSL field
  names, unaffordable-DCA policy, and adoption-point import behavior.
- Inconsistencies: user examples included minor ordering/arithmetic typos that
  needed canonical correction.
- Architecture constraints: architecture docs are source of truth; no runtime
  workaround or behavior fork allowed.

### 2. Select One Priority Task
- Selected task: freeze PnL-based position management lifecycle contract.
- Priority rationale: architecture ambiguity in money-impacting lifecycle logic
  is higher priority than implementation expansion.
- Why other candidates were deferred: code changes need this contract first.

### 3. Plan Implementation
- Files or surfaces to modify: architecture reference docs and planning/context
  source-of-truth files.
- Logic: create a precise reference contract and link it from existing
  lifecycle contracts.
- Edge cases: DCA levels beyond hard TP/SL, DCA funds exhaustion, imported
  exchange positions without historical trailing state, and monotonic
  TTP/TSL protection.

### 4. Execute Implementation
- Implementation notes: added a dedicated reference contract and linked it from
  main lifecycle, parity, live parity, and live protection-order contracts.

### 5. Verify and Test
- Validation performed: repository guardrails and manual diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only extend `06_execution-lifecycle.md`.
- Technical debt introduced: no.
- Scalability assessment: dedicated reference contract keeps the main lifecycle
  readable while giving implementers precise behavior.
- Refinements made: corrected DCA level order and TSL arithmetic in canonical
  examples.

### 7. Update Documentation and Knowledge
- Docs updated: architecture, planning, task board, and project state.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to task nature.
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
This task intentionally does not implement runtime changes. Follow-up execution
tasks should add focused regression coverage before changing behavior.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to
`READY` or `IN_PROGRESS`.

- Goal: recorded above.
- Scope: recorded above.
- Implementation Plan: recorded above.
- Acceptance Criteria: recorded above.
- Definition of Done: recorded above using `DEFINITION_OF_DONE.md`.
- Result Report: recorded below.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes.
- Real API/service path used: not applicable.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable.
- Error state verified: not applicable.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: repository guardrails.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: strategy/runtime implementers and live operators.
- Existing workaround or pain: lifecycle behavior partly lived in chat and code
  examples instead of architecture.
- Smallest useful slice: docs-only architecture contract.
- Success metric or signal: future implementation can cite one canonical
  contract.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: no.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable.
- Critical user journey: position lifecycle management.
- SLI: not applicable for docs-only change.
- SLO: not applicable.
- Error budget posture: not applicable.
- Health/readiness check: not applicable.
- Logs, dashboard, or alert route: future tasks must surface DCA/protection
  skip telemetry.
- Smoke command or manual smoke: not applicable.
- Rollback or disable path: revert commit.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable.
- Data classification: no data touched.
- Trust boundaries: exchange/live lifecycle boundaries documented only.
- Permission or ownership checks: adoption-point import requires canonical
  ownership before management.
- Abuse cases: not applicable for docs-only change.
- Secret handling: none.
- Security tests or scans: not applicable.
- Fail-closed behavior: documented for ambiguous imported positions and
  unaffordable DCA policy.
- Residual risk: implementation still needs follow-up tests and code changes.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable.
- Memory consistency scenarios: not applicable.
- Multi-step context scenarios: not applicable.
- Adversarial or role-break scenarios: not applicable.
- Prompt injection checks: not applicable.
- Data leakage and unauthorized access checks: not applicable.
- Result: not applicable.

## Result Report

- Task summary: Added the canonical PnL-based position management lifecycle
  contract and linked it from existing lifecycle architecture.
- Files changed: listed in Scope.
- How tested: `pnpm run quality:guardrails`; manual diff review.
- What is incomplete: runtime/backtest implementation and regression tests
  still need separate execution tasks.
- Next steps: add implementation tasks for validation warnings, DCA-funds
  policy, exchange protection order reconciliation, and parity regression
  coverage.
- Decisions made: DCA lanes execute closest-to-zero first; `TTP`/`TSL` use
  activation percent plus trail-distance percent; imported positions start at
  adoption point without invented history.
