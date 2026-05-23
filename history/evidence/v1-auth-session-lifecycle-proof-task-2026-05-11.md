# Task

## Header
- ID: V1-AUTH-SESSION-LIFECYCLE-PROOF-2026-05-11
- Title: Auth session lifecycle local proof
- Task Type: release
- Current Stage: implementation
- Status: DONE
- Owner: QA/Test
- Depends on: V1 master state ledger 2026-05-11
- Priority: P0
- Module Confidence Rows: SOAR-AUTH-001
- Requirement Rows: REQ-FUNC-004
- Quality Scenario Rows: QA-004
- Risk Rows: RISK-004
- Iteration: V1-2026-05-11-08
- Operation Mode: BUILDER
- Mission ID: V1-AUTH-LOCAL-PROOF
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed in the active V1 mission context.
- [x] `.agents/core/mission-control.md` was reviewed in the active V1 mission context.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified or will be created if absent.
- [x] Affected requirement, quality scenario, and risk rows were identified or will be created if absent.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: Prove local Auth session lifecycle behavior for login, logout, expired sessions, and web redirect handling.
- Release objective advanced: Move Auth from `UNVERIFIED` toward local action proof.
- Included slices: API auth lifecycle assertions, existing web session handling evidence, source-of-truth updates.
- Explicit exclusions: Production-safe/non-local browser clickthrough and admin entitlement proof.
- Checkpoint cadence: After API proof and after state/report refresh.
- Stop conditions: Auth contract mismatch, failing session lifecycle, or need for product/security decision.
- Handoff expectation: Record proof and remaining release gaps.

## Context
The V1 ledger marks Auth as `UNVERIFIED` with the next proof: browser login/logout/session-expiry proof plus API auth lifecycle assertions. Existing tests cover registration, cookie TTLs, duplicate cookies, web redirect/interceptor behavior, and AuthProvider logout. This task closes the missing API lifecycle assertions without changing runtime behavior.

## Goal
Add focused API lifecycle proof for logout and expired JWT handling, then connect that evidence to the existing web session handling tests.

## Success Signal
- User or operator problem: Operators must not remain authenticated after logout or expired/deleted sessions.
- Expected product or reliability outcome: Auth APIs fail closed and web session handling routes users back to login.
- How success will be observed: Focused API and web auth tests pass, and V1 source-of-truth files record Auth local proof.
- Post-launch learning needed: yes

## Deliverable For This Stage
Focused Auth lifecycle test coverage and updated V1 proof state.

## Scope
- `apps/api/src/modules/auth/auth.e2e.test.ts`
- Existing web auth/session tests as validation evidence
- V1 product action matrix and generated V1 reports
- Auth module confidence, requirement, quality, risk, task board, project state, and planning docs

## Constraints
- Use existing auth controller, JWT, cookies, API client, middleware, and AuthProvider.
- Do not introduce a new auth/session system.
- Do not weaken fail-closed behavior.
- Do not add live or production mutation proof in this local task.

## Implementation Plan
1. Add API e2e assertions for logout clearing cookie and causing `/auth/me` to return 401.
2. Add API e2e assertions for expired JWT returning session-expired messaging and clear-cookie header.
3. Run focused API Auth tests.
4. Run focused web Auth/session tests already covering redirect/logout UI behavior.
5. Update source-of-truth and regenerate V1 reports.

## Acceptance Criteria
- API logout clears the session cookie and subsequent `/auth/me` fails closed.
- Expired JWT fails closed with the session-expired message and clear-cookie header.
- Existing web AuthProvider/API interceptor tests confirm logout redirect and expired-session redirect handling.
- Auth product row moves from `UNVERIFIED` to the accurate local-proof status.

## Definition of Done
- [ ] Focused API Auth tests pass.
- [ ] Focused web Auth/session tests pass.
- [ ] V1 source-of-truth and generated reports are updated.

## Stage Exit Criteria
- [ ] The output matches the declared `Current Stage`.
- [ ] Work from later stages was not mixed in without explicit approval.
- [ ] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Implicit stage skipping.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/auth/auth.e2e.test.ts --sequence.concurrent=false --pool=forks --poolOptions.forks.singleFork=true --testTimeout=30000` passed (`11/11`).
  - `pnpm --filter web exec vitest run src/context/AuthContext.test.tsx src/lib/api.test.ts src/middleware.test.ts src/features/auth/hooks/useLoginForm.test.tsx src/features/auth/components/LoginForm.test.tsx` passed (`5` files, `17` tests).
  - V1 report refresh passed: project index, static scan, master ledger, scorecard.
  - `pnpm --filter api run typecheck` passed.
  - `pnpm --filter web run typecheck` passed.
  - `node --check scripts/buildProjectIndex.mjs` passed.
  - `pnpm run quality:guardrails` passed.
  - `git diff --check` passed with line-ending warnings only.
- Manual checks: reviewed Auth product matrix row, module confidence row, requirement, quality, risk, and generated V1 reports.
- Screenshots/logs: not applicable
- High-risk checks: no production credentials or live operator accounts used; local tests prove fail-closed behavior only; no `chrome-headless-shell` or Auth Vitest node processes remained after validation.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: SOAR-AUTH-001
- Requirements matrix updated: yes
- Requirement rows closed or changed: REQ-FUNC-004
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: QA-004
- Risk register updated: yes
- Risk rows closed or changed: RISK-004
- Reality status: verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: docs/architecture/architecture-source-of-truth.md; docs/architecture/reference/assistant-runtime-contract.md
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: Revert the focused tests/docs if needed.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Auth is `UNVERIFIED` in the V1 matrix despite existing partial API/web coverage.
- Gaps: No explicit API e2e proof that logout invalidates `/auth/me`; no expired-JWT API e2e proof.
- Inconsistencies: Web tests already cover redirect pieces, but the product matrix has not captured them as Auth proof.
- Architecture constraints: API remains authoritative for token validation; web middleware only checks cookie transport.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: Auth API tests, AuthProvider tests, API interceptor tests, middleware tests, V1 ledger.
- Rows created or corrected: pending
- Assumptions recorded: Local API/web focused tests are accepted local proof but not production-safe proof.
- Blocking unknowns: none
- Why it was safe to continue: Work is test and documentation scoped.

### 2. Select One Priority Mission Objective
- Selected task: Auth session lifecycle proof.
- Priority rationale: Auth is the next unverified P0 row after local-proof rows in the V1 ledger.
- Why other candidates were deferred: Production-safe clickthrough needs approved representative environment/data.

### 3. Plan Implementation
- Files or surfaces to modify: Auth API e2e test and V1 docs/state.
- Logic: Assert fail-closed session lifecycle outcomes.
- Edge cases: Expired token must clear cookie without accepting stale identity.

### 4. Execute Implementation
- Implementation notes: Added API Auth e2e assertions for logout invalidation and expired JWT session clearing. Existing web Auth tests were used as focused web lifecycle evidence.

### 5. Verify and Test
- Validation performed: focused API Auth e2e, focused Web Auth/session tests, API/Web typecheck, project-index syntax check, guardrails, diff check, process cleanup check, regenerated V1 reports.
- Result: Auth moved to `PASS_LOCAL`; V1 remains `NO-GO`.

### 6. Self-Review
- Simpler option considered: only updating docs from existing tests was insufficient because API logout/expired JWT gaps were real.
- Technical debt introduced: no
- Scalability assessment: Focused e2e assertions are low blast radius and reuse existing auth APIs.
- Refinements made: Matched clear-cookie assertion to the actual Express `Expires=Thu, 01 Jan 1970` contract.

### 7. Update Documentation and Knowledge
- Docs updated: V1 action matrix, planning queue, execution plan, generated V1 reports.
- Context updated: module confidence, requirements matrix, quality scenarios, risk register, delivery map, next steps, known issues, regression log, system health, project state, task board.
- Learning journal updated: not applicable.

## Review Checklist (mandatory)
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
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
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
Production-safe browser proof remains separate.

## Result Report
- Auth local session lifecycle is now proven through API and focused web tests.
- Product action matrix status moved from `UNVERIFIED` to `PASS_LOCAL`.
- Remaining gap: production-safe browser Auth clickthrough before verification/release readiness.

## Integration Evidence
API Auth e2e and Web Auth focused tests prove the local API-to-client session lifecycle contract.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: all authenticated operators
- Existing workaround or pain: Auth was still `UNVERIFIED` in V1 readiness tracking.
