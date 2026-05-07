# Task

## Header
- ID: FULLARCH-FIX-06
- Title: Lock Binance futures position snapshot normalization
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: FULLARCH-FIX-03
- Priority: P1
- Iteration: 52
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The full architecture audit identified insufficient Binance USD-M futures
snapshot coverage for one-way signed `positionAmt`, `positionSide=BOTH`,
hedge-mode sides, and multi-position snapshots. This can affect the live import
path because position reconciliation consumes normalized exchange snapshots
before ownership and runtime readback.

## Goal
Ensure Binance futures snapshots normalize to a stable internal contract:
positive `contracts`, resolved one-way side from signed `positionAmt`, explicit
hedge side preservation, and no signed quantity leakage into reconciliation.

## Scope
- `apps/api/src/modules/positions/positions.exchangeSnapshotNormalization.ts`
- `apps/api/src/modules/positions/positions.exchangeSnapshotNormalization.test.ts`
- `.agents/state/known-issues.md`
- `.agents/state/system-health.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- This task evidence file.

## Implementation Plan
1. Add failing normalization regressions for Binance futures one-way and hedge
   snapshots.
2. Normalize `positionAmt` as a signed source for side derivation and an
   absolute source for contracts.
3. Preserve explicit `position.side` as the highest-priority exchange adapter
   value.
4. Validate the normalizer plus focused live import/reconciliation readback
   pack.
5. Sync source-of-truth docs.

## Acceptance Criteria
- One-way `positionSide=BOTH` + negative `positionAmt` normalizes to
  `side=SHORT` and positive contracts.
- One-way positive `positionAmt` normalizes to `side=LONG` when the side is
  otherwise `BOTH`.
- Hedge-mode explicit `LONG`/`SHORT` side is preserved while contracts stay
  positive.
- Focused live import/reconciliation pack remains green.

## Success Signal
- User or operator problem: imported Binance futures positions should not be
  skipped or misclassified because signed quantities leak into normalized
  snapshot truth.
- Expected product or reliability outcome: safer exchange import input for
  ownership and runtime readback.
- How success will be observed: regression tests prove the normalized contract.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified code/test change plus synchronized planning/context evidence.

## Constraints
- Reuse existing exchange snapshot normalization path.
- Do not introduce a new exchange adapter or importer.
- Do not loosen ownership, bot scope, actionability, or live-money gates.
- Do not run production writes, deployments, or live-money actions.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` reviewed and applicable items are met.
- [x] Regression coverage added for one-way and hedge-mode Binance futures
  snapshot inputs.
- [x] Normalization produces positive contracts and deterministic side.
- [x] Focused import/reconciliation validation passes.
- [x] Source-of-truth docs are updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New systems without approval.
- Duplicated import or ownership logic.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Implicit stage skipping.

## Validation Evidence
- Tests:
  - Pre-fix focused normalizer regression failed as expected:
    `3 failed, 2 passed`.
  - `pnpm --filter api exec vitest run src/modules/positions/positions.exchangeSnapshotNormalization.test.ts --run`
    PASS (`5/5`).
  - `pnpm --filter api exec vitest run src/modules/positions/positions.exchangeSnapshotNormalization.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/livePositionReconciliation.diagnostics.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts --run --sequence.concurrent=false`
    PASS (`42/42`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run lint` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run docs:parity:check` PASS.
  - `git diff --check` PASS with line-ending warnings only.
- Manual checks:
  - Confirmed explicit adapter `position.side` remains highest priority.
- Screenshots/logs: not applicable.
- High-risk checks:
  - No production credentials, production writes, exchange writes, deploys, or
    live-money actions were used.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/planning/full-architecture-conformance-audit-task-2026-05-07.md`
  - `docs/planning/live-import-runtime-architecture-audit-task-2026-05-07.md`
  - `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## UX/UI Evidence
- Design source type: not applicable
- Design source reference: not applicable
- Canonical visual target: not applicable
- Fidelity target: not applicable
- Stitch used: no
- Experience-quality bar reviewed: not applicable
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: not applicable
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: not applicable
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: none
- Required states: not applicable
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: not applicable

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the normalizer/test change if unexpected exchange
  adapter behavior is found.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `positionAmt` could leak signed quantities and `positionSide=BOTH`
  into normalized snapshots.
- Gaps: production `LIVEIMPORT-03` readback is still missing.
- Inconsistencies: local import path lacked explicit normalization coverage for
  Binance one-way/hedge futures payloads.
- Architecture constraints: exchange import must normalize before ownership and
  keep bot actionability fail-closed.

### 2. Select One Priority Task
- Selected task: `FULLARCH-FIX-06`.
- Priority rationale: it is the remaining local live-import audit repair that
  does not require production credentials.
- Why other candidates were deferred: `LIVEIMPORT-03` and `BOTMULTI-09`
  require authenticated/protected production access that is not present.

### 3. Plan Implementation
- Files or surfaces to modify: one normalizer and its unit tests.
- Logic: derive side from signed `positionAmt` only when adapter side is absent
  or `positionSide=BOTH`; store contracts as absolute quantity.
- Edge cases: preserve explicit `position.side`; keep zero-size handling in
  reconciliation rather than inventing a side in the normalizer.

### 4. Execute Implementation
- Implementation notes: added three regressions and small helper functions for
  signed amount, side derivation, and positive contracts.

### 5. Verify and Test
- Validation performed: focused normalizer regression, focused
  import/reconciliation pack, and API typecheck.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: add tests only. Rejected because the tests exposed
  an actual normalization bug.
- Technical debt introduced: no
- Scalability assessment: keeps Binance-specific raw payload behavior behind
  the existing generic snapshot normalizer.
- Refinements made: explicit adapter side remains highest priority to avoid
  overriding CCXT-normalized truth.

### 7. Update Documentation and Knowledge
- Docs updated:
  - this task evidence
  - `docs/planning/mvp-next-commits.md`
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/known-issues.md`
  - `.agents/state/system-health.md`
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
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This closes local Binance futures normalization coverage. It does not replace
authenticated production readback for `LIVEIMPORT-03`.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: operators importing Binance futures positions.
- Existing workaround or pain: signed exchange quantities could make a valid
  short position look like an invalid negative-sized or unresolved-side row.
- Smallest useful slice: normalizer contract and focused reconciliation pack.
- Success metric or signal: focused tests pass and six-position import readback
  remains green.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: production readback remains required.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: live exchange position import into runtime readback.
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not changed
- Logs, dashboard, or alert route: not changed
- Smoke command or manual smoke: focused test pack.
- Rollback or disable path: revert code/test change if needed.

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused normalizer and import/reconciliation
  pack.

## AI Testing Evidence

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: exchange position snapshot data.
- Trust boundaries: raw exchange payloads are normalized server-side before
  ownership decisions.
- Permission or ownership checks: unchanged and covered by focused takeover
  readback pack.
- Abuse cases: malformed signed quantity causing false ownership/actionability.
- Secret handling: no secrets used.
- Security tests or scans: not applicable
- Fail-closed behavior: ownership/actionability gates unchanged.
- Residual risk: production readback still requires authenticated evidence.

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: normalized Binance futures signed `positionAmt` into positive
  contracts and deterministic one-way side while preserving explicit adapter
  side truth.
- Files changed:
  - `apps/api/src/modules/positions/positions.exchangeSnapshotNormalization.ts`
  - `apps/api/src/modules/positions/positions.exchangeSnapshotNormalization.test.ts`
  - `.agents/state/known-issues.md`
  - `.agents/state/system-health.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/fullarch-fix-06-binance-futures-position-normalization-task-2026-05-07.md`
- How tested: focused normalizer test, focused import/reconciliation pack, and
  API typecheck, lint, guardrails, docs parity, and diff check.
- What is incomplete: authenticated `LIVEIMPORT-03` production runtime
  readback.
- Next steps: run `LIVEIMPORT-03` with authenticated read-only production
  access and capture redacted evidence.
- Decisions made: no architecture or product decision changed.
