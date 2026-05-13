# Task

## Header
- ID: V1-WEB-BACKEND-PARITY-RUNTIME-ENUMS-2026-05-13
- Title: Align Web runtime enum contracts with backend schema
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1 web/backend runtime parity lane
- Priority: P1
- Module Confidence Rows: Web Dashboard Home, Web Bots, API Bots Runtime
- Requirement Rows: REQ-API-018, REQ-UX-011
- Quality Scenario Rows: QA-REL-003
- Risk Rows: RISK-RUNTIME-UI-DRIFT
- Iteration: 2026-05-13 runtime parity continuation
- Operation Mode: BUILDER
- Mission ID: V1-WEB-BACKEND-FUNCTION-PARITY-2026-05-13
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the selected autonomous continuation slice.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by preventing Web runtime contract drift.

## Mission Block
- Mission objective: close remaining Web/API runtime contract drift that can make Dashboard Home or Bots monitoring misrepresent backend runtime state.
- Release objective advanced: V1 evidence confidence for simultaneous PAPER/LIVE runtime operation and operator surfaces.
- Included slices: runtime enum type aliases, Web fixture parity, focused Web validation, source-of-truth updates.
- Explicit exclusions: no backend schema change, no visual redesign, no production LIVE action.
- Checkpoint cadence: update after implementation and after validation.
- Stop conditions: typecheck or focused tests reveal broader API contract mismatch requiring a separate task.
- Handoff expectation: next checkpoint can continue endpoint-to-surface parity from a stricter typed baseline.

## Context
Backend runtime tables expose stable Prisma enums for `TradingRecordOrigin`, `PositionManagementMode`, `FeeSource`, and runtime capital source semantics. Web runtime payload types still allowed free-form trade origin and management mode strings, and some tests used older fixture names that the backend no longer emits.

## Goal
Make Web runtime trade/order/position types reflect backend enum domains and remove stale runtime fixture enum values.

## Scope
- `apps/web/src/features/bots/types/bot.type.ts`
- Focused Dashboard Home and Bots monitoring runtime fixture tests
- Canonical state docs for Web/API parity confidence

## Implementation Plan
1. Add shared Web aliases for backend runtime enum domains.
2. Replace free-form trade enum fields with strict aliases.
3. Reuse aliases for positions, open orders, and capital summary typing.
4. Update stale Web test payloads from legacy values to backend-valid values.
5. Run focused Web runtime tests, Web typecheck, and guardrails.

## Acceptance Criteria
- Web trade payload typing rejects non-backend `feeSource`, `origin`, and `managementMode` values.
- Existing Dashboard Home and Bots monitoring focused tests pass with backend-valid fixture values.
- Web typecheck passes.
- Source-of-truth docs record the verified parity slice.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for the touched runtime type slice.
- [x] Runtime enum aliases are implemented without introducing new runtime behavior.
- [x] Focused tests and typecheck pass.
- [x] Task board, project state, module confidence, requirement matrix, quality scenarios, and risk register are updated.

## Deliverable For This Stage
Code and fixture changes that make Web runtime enum contracts backend-valid.

## Constraints
- Use existing runtime payload types and tests.
- Do not introduce a new schema or client generator.
- Do not add temporary compatibility for impossible backend enum values.
- Keep legacy `MANUAL` position origin compatibility only where already required by older Web position fixtures.

## Forbidden
- New systems without approval.
- Duplicated enum mapping logic.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- LIVE trading or production mutation.

## Validation Evidence
- Tests: `pnpm --filter web run test -- src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx src/features/bots/components/BotsManagement.test.tsx --run` => PASS (`5` files, `47` tests); `pnpm --filter web run typecheck` => PASS; `pnpm run quality:guardrails` => PASS.
- Manual checks: `rg -n 'SIMULATED|PAPER_RUNTIME|managementMode: "BOT"|managementMode: "MANUAL"|managementMode: "SIGNAL"|origin: "MANUAL"' apps/web/src/features/dashboard-home apps/web/src/features/bots -g '*.ts' -g '*.tsx'` => no matches.
- Screenshots/logs: not applicable
- High-risk checks: no LIVE action; static/client contract only
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: Web Dashboard Home, Web Bots, API Bots Runtime
- Requirements matrix updated: yes
- Requirement rows closed or changed: REQ-API-018, REQ-UX-011
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: QA-REL-003
- Risk register updated: yes
- Risk rows closed or changed: RISK-RUNTIME-UI-DRIFT
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
- Design source reference: existing Dashboard Home and Bots monitoring runtime surfaces
- Canonical visual target: not applicable
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: no
- Visual-direction brief reviewed: no
- Existing shared pattern reused: existing runtime tables and labels
- New shared pattern introduced: no
- Design-memory update required: no
- Visual gap audit completed: no
- Required states: success
- Responsive checks: not applicable for static type/fixture contract
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: focused Web runtime tests (`47/47`), Web typecheck, stale-value scan, and guardrails passed.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit if client typing causes unintended downstream build failure.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Web runtime trade types allowed enum values the backend cannot emit.
- Gaps: stale Web fixture values could hide API/Web parity regressions.
- Inconsistencies: `SIMULATED`, `PAPER_RUNTIME`, `BOT`, `MANUAL`, and `SIGNAL` appeared in runtime payload fixtures.
- Architecture constraints: PAPER/LIVE runtime semantics must remain shared; only execution adapter differs.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: operating system, mission control, task board, next steps, backend schema, runtime services, Web runtime types/tests
- Rows created or corrected: source-of-truth rows updated for Dashboard Home and Bot Runtime parity evidence.
- Assumptions recorded: no blocking assumptions
- Blocking unknowns: none
- Why it was safe to continue: backend enum domains are explicit in Prisma schema and runtime serializers.

### 2. Select One Priority Mission Objective
- Selected task: runtime enum parity.
- Priority rationale: direct Web/API contract correctness for the active V1 multi-bot runtime proof lane.
- Why other candidates were deferred: rendered production clickthrough needs broader auth/runtime setup; this local contract slice is executable now.

### 3. Plan Implementation
- Files or surfaces to modify: Web runtime types and focused fixtures.
- Logic: narrow free-form enum fields to backend-valid aliases.
- Edge cases: keep position `MANUAL` origin compatibility for older fixture/display tests while trade payloads use backend `USER`.

### 4. Execute Implementation
- Implementation notes: added shared Web aliases for backend enum domains and normalized stale test payload values.

### 5. Verify and Test
- Validation performed: focused Web runtime tests, Web typecheck, stale-value scan, and repository guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only editing fixtures; rejected because it would leave free-form Web trade typing.
- Technical debt introduced: no
- Scalability assessment: aliases reduce future contract drift.
- Refinements made: stale fixture values were removed after type narrowing.

### 7. Update Documentation and Knowledge
- Docs updated: this task artifact, task board, project state, module confidence, requirement matrix, quality scenarios, risk register, system health, and next steps.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
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
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This task intentionally changes type safety and test payload truth only; it does not change runtime API behavior.

## Production-Grade Required Contract
- Goal: strict Web runtime enum parity with backend schema.
- Scope: Web runtime payload types and tests listed above.
- Implementation Plan: see section above.
- Acceptance Criteria: see section above.
- Definition of Done: tied to `DEFINITION_OF_DONE.md` plus focused validation.
- Result Report: completed below after verification.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: operator using Dashboard Home or Bots monitoring.
- Existing workaround or pain: stale enum values could make UI tests pass against impossible runtime payloads.
- Smallest useful slice: strict aliases plus fixture cleanup.
- Success metric or signal: focused tests and Web typecheck pass.
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
- Critical user journey: operator reads selected bot runtime history and capital state.
- SLI: Web runtime contract correctness by typecheck/focused tests.
- SLO: backend-valid payload fixtures only for V1 runtime surfaces.
- Error budget posture: healthy
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused Web runtime tests and static stale-value scan.
- Rollback or disable path: revert commit

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: static contract against backend schema/runtime serializers
- Endpoint and client contract match: yes for the narrowed enum domains inspected in backend schema/runtime serializers.
- DB schema and migrations verified: Prisma schema inspected
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused Web runtime tests, Web typecheck, and guardrails.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: no new data
- Trust boundaries: no boundary change
- Permission or ownership checks: no change
- Abuse cases: not applicable
- Secret handling: no secrets used
- Security tests or scans: not applicable
- Fail-closed behavior: strict typing rejects impossible runtime states
- Residual risk: rendered browser proof remains a separate V1 evidence lane

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: Web runtime payload types now use backend-compatible enum aliases for fee source, trading origin, position management mode, and capital source; stale impossible enum fixture values were removed.
- Files changed: `apps/web/src/features/bots/types/bot.type.ts`; focused Dashboard Home/Bots monitoring runtime tests; source-of-truth state files.
- How tested: focused Web runtime tests (`47/47`), Web typecheck, stale-value scan, and repository guardrails.
- What is incomplete: production-safe browser/runtime clickthrough remains a separate V1 proof lane.
- Next steps: continue endpoint-to-surface parity checks and production-safe multi-bot UI/runtime clickthrough.
- Decisions made: none.
