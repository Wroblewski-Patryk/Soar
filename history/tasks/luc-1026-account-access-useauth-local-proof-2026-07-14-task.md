# LUC-1026 Account Access useAuth Local Proof

## Header
- ID: LUC-1026
- Title: Link or extend local proof for useAuth
- Task Type: qa
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Module Confidence Rows: Account access / Web auth context hook / app-completion truth
- Requirement Rows: Account access shared auth hook must have linked automated proof for local session-state contract
- Quality Scenario Rows: Protected auth state must stay fail-closed without a provider and remain stable under provider-backed session flows
- Risk Rows: generated app-completion can over-route a proven Web auth hook as missing test link
- Iteration: 2026-07-14 TAE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-1026-ACCOUNT-ACCESS-USEAUTH-LOCAL-PROOF-2026-07-14
- Mission Status: VERIFIED_LOCAL_INDEX_LINK

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this verification heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through current project state and active mission context.
- [x] `.agents/core/mission-control.md` was reviewed through active mission state.
- [x] Missing or template-like state tables were not encountered for this scoped proof.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: close the scoped Account access `useAuth` local-proof gap by linking executable Web auth-context evidence into generated truth.
- Release objective advanced: V1 app-completion burn-down for Account access Web auth support surfaces.
- Included slices: focused Web auth-context regression extension, direct priority test-link relation, generated architecture/app-completion/project-truth refresh, and targeted readback.
- Explicit exclusions: runtime product logic changes, protected production auth proof, deploy/restart/rollback, env edits, DB/Redis mutation, exchange/payment/subscription mutation, and browser smoke.
- Checkpoint cadence: single heartbeat proof packet.
- Stop conditions: the `useAuth` row no longer reports `missing_test_link`, or generated readback shows a narrower owner-specific blocker.
- Handoff expectation: close if the proof row advances; otherwise leave the exact blocker and next owner.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| QA/Test | 09 TAE | [LUC-1026](/LUC/issues/LUC-1026), app-completion/project-truth indexes | `apps/web/src/context/AuthContext.test.tsx`, `docs/architecture/relations/priority-test-links.csv` | Direct `useAuth` proof relation plus a fresh local hook regression | Focused Web Vitest pack | DONE |
| Documentation/Memory | 09 TAE | generated source-truth indexes and project state files | generated `docs/status/*`, task/evidence/context notes | Current readback for the scoped proof row | Generator chain and targeted readback | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed for this scoped work.
- [x] Responsibility stayed within QA/Test proof and source-truth closure.
- [x] No product runtime code lane was needed.
- [x] Each owned surface has explicit validation.
- [x] Missing or unclear ownership did not occur.

## Context
[LUC-1026](/LUC/issues/LUC-1026) is a scoped Frontend Proof wake for the
shared Web auth hook `apps/web/src/context/AuthContext.tsx#useAuth`. Current
`app-completion` classified the row as `implemented_needs_proof` with
`risk=missing_test_link`, even though `AuthContext.test.tsx` already exercised
provider-backed auth session behavior. The missing durable source-of-truth link
was the direct helper-to-test mapping.

## Goal
Make current generated app-completion/project-truth truth reflect that
`useAuth` has explicit local automated proof for its shared auth-state contract.

## Success Signal
- User or operator problem: a proven Web auth hook is still routed as a missing-test-link gap.
- Expected product or reliability outcome: the target `useAuth` row no longer appears with `missing_test_link`.
- How success will be observed: refreshed app-completion shows `hasTest=true` for the target row and project truth no longer routes the same proof gap.
- Post-launch learning needed: no.

## Deliverable For This Stage
A verification packet that links `useAuth` to executable local proof, refreshes
generated truth, and records residual ownership if the row advances into a
documentation-only gap.

## Scope
- `apps/web/src/context/AuthContext.test.tsx`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture/app-completion/project-truth indexes under `docs/`
- `history/evidence/luc-1026-account-access-useauth-local-proof-2026-07-14.md`
- this task packet
- project state/context ledgers for scoped truth refresh

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Read the current `useAuth` implementation, Web auth context tests, and generated row metadata.
2. Extend the focused test pack only if the existing proof leaves the hook contract ambiguous.
3. Add the smallest direct `priority-test-links.csv` relation for `useAuth`.
4. Run focused Web auth-context validation.
5. Regenerate architecture-awareness, app-completion, and project-truth indexes.
6. Record targeted readback, residual risk, and source-of-truth updates.

## Acceptance Criteria
- `AuthContext.test.tsx` proves the `useAuth` contract directly enough for local regression evidence.
- `priority-test-links.csv` contains a direct `useAuth` relation to executable proof.
- Focused Web tests pass.
- Refreshed app-completion readback no longer reports `apps/web/src/context/AuthContext.tsx#useAuth` as `missing_test_link`.
- No runtime auth behavior, production account/session state, deploy, or secret handling changes occur.

## Definition of Done
- [x] Concrete local proof exists for the scoped `useAuth` contract.
- [x] Generated truth reflects the proof linkage change.
- [x] Evidence and state files identify the next owner if documentation follow-up remains.

## Stage Exit Criteria
- [x] The output matches the declared `verification` stage.
- [x] Later-stage release work was not mixed in.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `corepack pnpm --filter web exec vitest run src/context/AuthContext.test.tsx`
  - `corepack pnpm --filter web run typecheck`
- Manual checks:
  - targeted readback of `docs/architecture/relations/priority-test-links.csv`
  - targeted readback of `docs/status/app-completion-index.json` and `docs/status/project-truth-index.md`
- High-risk checks:
  - no protected auth/session readback
  - no browser or deploy mutation
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: Account access / Web auth context hook / app-completion truth
- Requirements matrix updated: no
- Requirement rows closed or changed: not applicable
- Quality scenarios updated: no
- Quality scenario rows closed or changed: not applicable
- Risk register updated: no
- Risk rows closed or changed: not applicable
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/relations/priority-test-links.csv`, generated architecture-awareness/app-completion/project-truth outputs
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none in this lane

## Security / Privacy Evidence
- Data classification: local auth hook/session-state proof only
- Trust boundaries: shared Web auth context and local mocked API edge
- Permission or ownership checks: providerless default contract stays fail-closed; provider-backed flows remain covered in the focused test pack
- Abuse cases: unauthorized refetch, protected-route bootstrap failure, and logout redirect remain covered locally
- Secret handling: no real secrets, tokens, or cookies were read or persisted
- Security tests or scans: focused Web auth-context regression pack
- Fail-closed behavior: verified locally through the existing unauthorized/protected-route scenarios and the new providerless default-state assertion
- Residual risk: `useAuth` may still need a docs-owned direct documentation link after the proof gap is resolved

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `useAuth` had existing local tests but generated truth still reported `missing_test_link`.
- Gaps: no direct helper-to-test relation existed in `priority-test-links.csv`.
- Inconsistencies: architecture-awareness knew the test file, but app-completion still marked `hasTest=false` for the hook.
- Architecture constraints: reuse the existing relation-ingestion and generator workflow.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: active mission, task board, project state, module ledger, `AuthContext` source, `AuthContext.test.tsx`, app-completion/project-truth outputs, prior auth proof tasks.
- Why it was safe to continue: scoped QA/Test source-truth repair only.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-1026](/LUC/issues/LUC-1026) local `useAuth` proof linkage.
- Priority rationale: direct wake payload for this issue.
- Why other candidates were deferred: the wake contract forbids switching issues before handling this slice.

### 3. Plan Implementation
- Files or surfaces to modify: focused Web auth-context test, direct priority link, generated truth, and state/evidence notes.
- Logic: make the local `useAuth` contract explicit, link the proof directly, regenerate truth, and read back the new classification.
- Edge cases: generated truth could advance from `missing_test_link` to a docs-only gap instead of fully verified.

### 4. Execute Implementation
- Implementation notes: added a providerless `useAuth` default-contract regression and one direct `priority-test-links.csv` row for the hook.

### 5. Verify and Test
- Validation performed: focused Web vitest, Web typecheck, generator refresh, and targeted readback.
- Result: PASS. `AuthContext.test.tsx` passed (`1` file / `5` tests), Web typecheck passed, architecture-awareness regenerated with `10928` entities / `36121` relations and `entityOverridesApplied=33`, and app-completion now records `useAuth` with `hasTest=true` and `risk=missing_doc_link`.

### 6. Self-Review
- Simpler option considered: add only the relation row without touching tests.
- Technical debt introduced: no.
- Scalability assessment: follows the existing relation-ingestion workflow used for other missing-test-link closures.
- Refinements made: added one narrow assertion for the default hook contract so the link points to an explicit hook-level regression, not just indirect provider behavior.

### 7. Update Documentation and Knowledge
- Docs updated: priority test links, generated indexes, task/evidence/context notes.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to this QA/Test verification heartbeat.
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
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
- [x] Parent validation ran after accepted lane integration.

## Result Report
- Task summary: linked and clarified local automated proof for the shared Web auth `useAuth` hook.
- Files changed: `AuthContext.test.tsx`, `priority-test-links.csv`, generated truth outputs, task/evidence/context notes.
- How tested: focused Web auth-context vitest, Web typecheck, generator refresh, and targeted readback.
- What is incomplete: if generated truth advances `useAuth` to `missing_doc_link`, that direct documentation follow-up remains outside TAE ownership.
- Next steps: route any resulting `missing_doc_link` row to Docs Memory Lead + Project Manager; otherwise no remaining action on this issue.
- Decisions made: reused the existing relation-ingestion workflow instead of adding a broader scanner override for a proof-only gap.
