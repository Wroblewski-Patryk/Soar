# Task

## Header
- ID: V1-WEB-BACKEND-PARITY-MONITORING-PROPS-2026-05-13
- Title: Reuse runtime enum aliases in Bots Monitoring props
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1-WEB-BACKEND-PARITY-RUNTIME-ENUMS-2026-05-13
- Priority: P2
- Module Confidence Rows: Web Bots, Bot Runtime
- Requirement Rows: REQ-FUNC-003
- Quality Scenario Rows: QA-003
- Risk Rows: RISK-003
- Iteration: 2026-05-13 runtime parity continuation
- Operation Mode: BUILDER
- Mission ID: V1-WEB-BACKEND-FUNCTION-PARITY-2026-05-13
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the continuation slice.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by reducing duplicate Web runtime contract declarations.

## Mission Block
- Mission objective: keep Bot Runtime monitoring props tied to the shared Web runtime contract.
- Release objective advanced: V1 Web/API runtime contract parity.
- Included slices: local prop type cleanup, focused validation, source-of-truth update.
- Explicit exclusions: no UI behavior change, no backend change, no production action.
- Checkpoint cadence: one verified cleanup slice.
- Stop conditions: typecheck exposes a broader duplicate runtime contract needing a separate task.
- Handoff expectation: continue endpoint-to-surface parity checks from shared aliases.

## Context
After runtime enum aliases were introduced, `BotsMonitoringTab` still declared local `feeSource` and `capitalSource` unions. These duplicated the shared runtime contract and could drift later.

## Goal
Reuse shared runtime aliases in Bots Monitoring prop contracts.

## Scope
- `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx`
- Source-of-truth state docs for the V1 parity lane

## Implementation Plan
1. Import shared `FeeSource` and `RuntimeCapitalSource` aliases.
2. Replace local duplicate union declarations in monitoring trade and capital props.
3. Reuse `BotRuntimeTrade["origin"]` for operational trade origin.
4. Run focused Bots monitoring tests, Web typecheck, and guardrails.

## Acceptance Criteria
- Bots Monitoring prop types no longer duplicate fee/capital enum domains.
- Focused Bots Monitoring tests pass.
- Web typecheck and guardrails pass.
- State docs record the cleanup.

## Definition of Done
- [x] Duplicate local enum unions are removed from the monitoring prop contract.
- [x] Focused validation passes.
- [x] Source-of-truth docs are updated.

## Deliverable For This Stage
Verified code cleanup and evidence record.

## Constraints
- Reuse existing shared runtime types.
- Do not change rendered UI behavior.
- Do not broaden accepted backend values.

## Forbidden
- New runtime type systems.
- Temporary compatibility aliases for impossible backend values.
- Production mutation or LIVE action.

## Validation Evidence
- Tests: `pnpm --filter web run test -- src/features/bots/components/BotsManagement.test.tsx --run` => PASS (`14/14`); `pnpm --filter web run typecheck` => PASS; `pnpm run quality:guardrails` => PASS.
- Manual checks: duplicate-union scan in `BotsMonitoringTab.tsx` returned no matches.
- Screenshots/logs: not applicable
- High-risk checks: no LIVE action
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: Web Bots, Bot Runtime
- Requirements matrix updated: yes
- Requirement rows closed or changed: REQ-FUNC-003
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: QA-003
- Risk register updated: yes
- Risk rows closed or changed: RISK-003
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## UX/UI Evidence
- Design source type: not applicable
- Design source reference: existing Bots Monitoring runtime surface
- Canonical visual target: not applicable
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: no
- Visual-direction brief reviewed: no
- Existing shared pattern reused: shared runtime payload types
- New shared pattern introduced: no
- Design-memory update required: no
- Required states: success
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: focused `BotsManagement` test (`14/14`), Web typecheck, duplicate-union scan, and guardrails passed.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit if type imports expose unexpected downstream constraints.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: a local Bots Monitoring prop contract duplicated runtime enum domains.
- Gaps: future enum changes could update shared types but miss this prop boundary.
- Inconsistencies: local unions for fee and capital source overlapped with shared aliases.
- Architecture constraints: Web runtime surfaces must reflect backend runtime truth.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: task board, next steps, backend schema, shared Web runtime types, Bots Monitoring prop contract
- Rows created or corrected: module confidence, requirement matrix, quality scenario, risk register, system health, next steps, project state, and task board updated.
- Assumptions recorded: none
- Blocking unknowns: none
- Why it was safe to continue: change is type-level reuse with no behavior change.

### 2. Select One Priority Mission Objective
- Selected task: remove local duplicate runtime enum unions from Bots Monitoring props.
- Priority rationale: prevents recurrence of the enum drift just fixed.
- Why other candidates were deferred: this cleanup is the smallest executable continuation inside the same parity lane.

### 3. Plan Implementation
- Files or surfaces to modify: `BotsMonitoringTab.tsx`.
- Logic: import shared aliases and replace duplicate local unions.
- Edge cases: preserve existing `BotRuntimeTrade` derived fields.

### 4. Execute Implementation
- Implementation notes: reused shared runtime aliases for fee/capital source and `BotRuntimeTrade["origin"]` for operational trade origin.

### 5. Verify and Test
- Validation performed: focused `BotsManagement` test, Web typecheck, duplicate-union scan, and guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave local unions; rejected because it keeps a known drift point.
- Technical debt introduced: no
- Scalability assessment: shared aliases reduce future contract maintenance.
- Refinements made: combined imported aliases onto one line to preserve the production monolith line budget.

### 7. Update Documentation and Knowledge
- Docs updated: this task artifact plus state/context files.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected.
- [x] Operation mode was selected according to continuation context.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.

## Notes
This is intentionally a contract-cleanup task, not a UI redesign or runtime behavior change.

## Production-Grade Required Contract
- Goal: reuse shared runtime enum aliases in Bots Monitoring props.
- Scope: `BotsMonitoringTab.tsx` and source-of-truth docs.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: focused validation plus source-of-truth update.
- Result Report: completed below after verification.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: operator reading Bots runtime monitoring.
- Existing workaround or pain: duplicate local prop types can drift from backend truth.
- Smallest useful slice: shared alias reuse in one component boundary.
- Success metric or signal: focused tests and typecheck pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## User Feedback Evidence
- `docs/governance/user-feedback-loop.md` reviewed: not applicable
- Feedback item IDs: user's V1 completeness concern
- Feedback accepted: yes
- Feedback needs clarification: no
- Feedback conflicts: none
- Feedback deferred or rejected: none
- Active task changed by feedback: yes
- New task created from feedback: yes
- Design memory updated: no
- Learning journal updated: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: Bot Runtime monitoring trade/capital summary reading.
- SLI: component contract stays bound to shared runtime aliases.
- SLO: no local duplicate enum declarations for fee/capital source in monitoring props.
- Error budget posture: healthy
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused Web test and duplicate-union scan.
- Rollback or disable path: revert commit

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: static Web contract against shared API payload types
- Endpoint and client contract match: yes for the shared enum aliases used by Bots Monitoring props.
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused `BotsManagement` test, Web typecheck, and guardrails.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: no new data
- Trust boundaries: no boundary change
- Permission or ownership checks: no change
- Abuse cases: not applicable
- Secret handling: no secrets used
- Security tests or scans: not applicable
- Fail-closed behavior: shared type aliases prevent accepting impossible runtime states at this boundary.
- Residual risk: production-safe clickthrough remains separate.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: Bots Monitoring prop contracts now reuse shared runtime enum aliases instead of local duplicate fee/capital unions.
- Files changed: `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx` and source-of-truth docs.
- How tested: focused `BotsManagement` test (`14/14`), Web typecheck, duplicate-union scan, and guardrails.
- What is incomplete: production-safe Bot Runtime clickthrough remains a separate V1 proof lane.
- Next steps: continue endpoint-to-surface parity checks and production-safe multi-bot UI/runtime clickthrough.
- Decisions made: none
