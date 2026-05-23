# Task

## Header
- ID: PROJECT-ARCHITECTURE-CODE-DISCREPANCY-AUDIT-2026-05-17
- Title: Audit architecture-code discrepancies across current Soar layers
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Review
- Depends on: canonical architecture and project state
- Priority: P1
- Module Confidence Rows: Exchange Adapter, Assistant/AI, Workers, Dashboard Routes, Operations
- Requirement Rows: REQ-ARCH-028, REQ-EXCH-029, REQ-AI-030
- Quality Scenario Rows: not changed
- Risk Rows: RISK-028, RISK-029, RISK-030
- Iteration: 2026-05-17 architecture/code audit
- Operation Mode: ARCHITECT
- Mission ID: PROJECT-ARCH-CODE-AUDIT-2026-05-17
- Mission Status: PARTIALLY_VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the architecture audit nature of this iteration.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by separating real code defects from documentation drift and architecture overclaims.

## Mission Block
- Mission objective: compare code reality with canonical architecture and record every high-signal discrepancy found in the audited layers.
- Release objective advanced: future repair planning can start from durable findings instead of chat-only analysis.
- Included slices: architecture docs, generated project inventory, Web route map, API routing/health, worker topology, Prisma bot scope, exchange boundaries, assistant runtime, documentation drift.
- Explicit exclusions: no product code repair, no deploy, no production mutation, no LIVE order/cancel/close, no browser route-state proof, no full API/Web regression run.
- Checkpoint cadence: record findings after generated inventory and targeted source inspection.
- Stop conditions: architecture/code mismatch requiring a product decision, validation failure, or evidence that source-of-truth files cannot be updated.
- Handoff expectation: durable audit report, updated project memory/state, and next repair order.

## Context
The user requested a complete discrepancy audit between how the app currently
works in code and how architecture describes it. The repo already has extensive
V1 proof, but some architecture documents and generated inventory can drift
from actual runtime shape.

## Goal
Create a durable architecture-code discrepancy baseline that future sessions can
use to plan fixes without rediscovering the same mismatches.

## Success Signal
- User or operator problem: future agents cannot confidently tell whether a mismatch is a bug, docs drift, deferred scope, or accepted architecture.
- Expected product or reliability outcome: discrepancy findings are explicit, prioritized, and linked to source files.
- How success will be observed: audit report and state ledgers point to the same repair order.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified audit report plus source-of-truth updates. No application behavior
change is expected in this stage.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within audit/verification stage

## Definition of Done
- [x] Architecture and code surfaces for the audited layers are inspected.
- [x] Discrepancies are recorded with severity, impact, and repair direction.
- [x] Project memory/state files are updated so the next step can plan repairs.
- [x] Relevant docs validation runs after updates.

## Stage Exit Criteria
- [x] The output matches the declared `verification` stage.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm run ops:project:index` PASS
  - `pnpm run ops:project:scan -- --index history/artifacts/project-index-2026-05-17.json` PASS, findings `0`
  - `pnpm run quality:guardrails` PASS
  - `pnpm run docs:parity:check` PASS
  - `git diff --check` PASS
- Manual checks: Web route inventory matched `dashboard-route-map.md`; API health/ops gates, worker topology, exchange SDK ownership, Prisma bot scope, and assistant runtime integration were inspected.
- Screenshots/logs: not applicable.
- High-risk checks: no production mutation, no LIVE exchange mutation, no deploy.
- Module confidence ledger updated: not applicable; no module confidence status was changed by this audit-only task.
- Module confidence rows closed or changed: none.
- Requirements matrix updated: yes.
- Requirement rows closed or changed: REQ-ARCH-028, REQ-EXCH-029, REQ-AI-030.
- Quality scenarios updated: no.
- Quality scenario rows closed or changed: none.
- Risk register updated: yes.
- Risk rows closed or changed: RISK-028, RISK-029, RISK-030.
- Reality status: partially verified.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/**` and referenced architecture contracts listed in the audit report.
- Fits approved architecture: no, not completely.
- Mismatch discovered: yes.
- Decision required from user: yes, for assistant runtime truth and exchange capability granularity if repair direction changes behavior.
- Approval reference if architecture changed: not applicable; no architecture behavior was changed.
- Follow-up architecture doc updates: `AUD-ARCH-001`, `AUD-EXCH-002`, `AUD-AI-003`, `AUD-TRACE-006`.

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
- Visual gap audit completed: no, out of scope.
- Background or decorative asset strategy: not applicable.
- Canonical asset extraction required: no.
- Screenshot comparison pass completed: no.
- Remaining mismatches: browser route-state proof remains a separate audit lane.
- Required states: not applicable.
- Responsive checks: not applicable.
- Input-mode checks: not applicable.
- Accessibility checks: not applicable.
- Parity evidence: route inventory parity only.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no rollback needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: exchange scope doc drift, exchange capability granularity mismatch, assistant runtime overclaim, generated index/scan race, traceability automation gap.
- Gaps: no browser route-state proof and no full AI red-team proof in this audit.
- Inconsistencies: architecture overview/domain wording vs newer exchange code/reference docs.
- Architecture constraints: exact `ExchangeContext`, fail-closed exchange operations, protected diagnostics, split worker visibility, assistant fail-closed governance.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Missing or template-like files: none.
- Sources scanned: architecture docs, state files, generated project index/static scan, API/Web/Prisma/worker/exchange/assistant source.
- Rows created or corrected: requirement and risk rows for audit findings.
- Assumptions recorded: audit-only task; no production proof claim.
- Blocking unknowns: repair direction for assistant runtime and exact exchange capability model.
- Why it was safe to continue: findings could be recorded without changing runtime behavior.

### 2. Select One Priority Mission Objective
- Selected task: architecture-code discrepancy audit.
- Priority rationale: user explicitly requested this audit; it governs future repair planning.
- Why other candidates were deferred: implementation repairs need decisions after audit evidence.

### 3. Plan Implementation
- Files or surfaces to modify: audit report, documentation drift, project state, task board, next steps, system health, known issues, risk register, requirements matrix, learning journal, project memory index.
- Logic: no code logic changes.
- Edge cases: avoid converting deferred production proof boundaries into false defects.

### 4. Execute Implementation
- Implementation notes: generated inventory and static scan were refreshed, then targeted source/document comparisons were recorded.

### 5. Verify and Test
- Validation performed: generated index/static scan, guardrails, docs parity, diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: chat-only summary.
- Technical debt introduced: no.
- Scalability assessment: audit findings are now table-driven and can feed future repair tasks.
- Refinements made: separated true mismatches from aligned areas and deferred proof boundaries.

### 7. Update Documentation and Knowledge
- Docs updated: `history/audits/architecture-code-discrepancy-audit-2026-05-17.md`, `docs/analysis/documentation-drift.md`, this task file.
- Context updated: project state, task board, next steps, known issues, risk register, requirements matrix, system health, project memory index.
- Learning journal updated: yes.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration purpose.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated because repository truth changed.
- [x] Learning journal was updated because a recurring pitfall was confirmed.

## Notes
The audit found important architecture truth gaps, but no direct evidence that
the route inventory, protected diagnostics, split worker readiness, bot active
market-scope constraint, or exchange SDK ownership are broken.
