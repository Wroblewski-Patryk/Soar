# LUC-176 Account Access ClearSession Project-Truth Proof

## Header
- ID: LUC-176
- Title: Prove Account access implemented-needs-proof
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: prior LUC-93 clearSession behavior proof; current architecture/app-completion generators
- Priority: P1
- Module Confidence Rows: Account access / API auth middleware / app-completion truth
- Requirement Rows: Account access stale/invalid/expired/deleted-user auth candidates fail closed
- Quality Scenario Rows: Security fail-closed behavior
- Risk Rows: stale generated project truth can keep verified behavior in `implemented_needs_proof`
- Iteration: 2026-07-05 QVE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-176-ACCOUNT-ACCESS-CLEARSESSION-PROJECT-TRUTH-PROOF-2026-07-05
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this QA verification heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through current project state and active mission context.
- [x] `.agents/core/mission-control.md` was reviewed through active mission state.
- [x] Missing or template-like state tables were not encountered for this scoped proof.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: close the dispatched Account access `clearSession` app-completion `implemented_needs_proof` row with current proof and generated truth.
- Release objective advanced: V1 project-truth burn-down for account access.
- Included slices: focused middleware proof, scanner metadata promotion, architecture-awareness/app-completion/project-truth refresh, targeted readback.
- Explicit exclusions: runtime code changes, production protected auth proof, deploy/restart/rollback, DB migration, secret/account readback, trading/payment/subscription mutations.
- Checkpoint cadence: single heartbeat proof packet.
- Stop conditions: target row resolves, or generator/readback shows a remaining owner-specific blocker.
- Handoff expectation: close if verified; otherwise create a targeted follow-up issue for the owning lane.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| QA/Test | 09 QVE | LUC-176 wake, LUC-93/LUC-171 evidence | `requireAuth.test.ts` proof command | Fresh focused proof | Vitest pass | DONE |
| Documentation/Memory | 09 QVE | app-completion/project-truth indexes | scanner override, generated truth, task/evidence/context notes | Current generated source of truth | Generator/readback pass | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was read.
- [x] Responsibility stayed within QA verification and source-truth proof closure.
- [x] No runtime/product code lane was needed.
- [x] Expected output and validation/proof are recorded.
- [x] Missing or unclear ownership did not occur.

## Context
[LUC-176](/LUC/issues/LUC-176) was dispatched from project truth because
`apps/api/src/middleware/requireAuth.ts#clearSession` remained
`implemented_needs_proof`. Prior LUC-93 evidence had already added the
behavior proof, and LUC-171 added fresh DB-backed auth route proof. The
remaining issue was the architecture entity status used by app-completion.

## Goal
Make the current generated app-completion/project-truth indexes reflect that
`requireAuth.clearSession` is verified for the scoped Account access behavior.

## Success Signal
- User or operator problem: project truth routes an already-proven Account access row as incomplete.
- Expected product or reliability outcome: the target `clearSession` row no longer appears as the first project-truth gap.
- How success will be observed: app-completion drops one `implementedNeedsProof` item and project-truth first gap advances.
- Post-launch learning needed: no.

## Scope
- `docs/architecture/scanner-overrides.json`
- `docs/graphs/architecture-awareness.*`
- `docs/status/app-completion-index.*`
- `docs/status/project-truth-index.*`
- `docs/status/event-chain-index.*`
- `docs/status/runtime-error-index.*`
- `docs/status/operational-readiness-index.*`
- `history/evidence/luc-176-account-access-clearsession-project-truth-proof-2026-07-05.md`
- Context ledgers

## Implementation Plan
1. Read the issue context and current app-completion/project-truth rows.
2. Confirm direct test/doc relations and prior behavior proof exist for `clearSession`.
3. Promote the single scanner entity to `verified` through the existing scanner override mechanism.
4. Regenerate architecture-awareness, app-completion, and project-truth indexes.
5. Run focused `requireAuth` middleware proof.
6. Record durable task/evidence/context notes and close the issue.

## Acceptance Criteria
- `requireAuth.test.ts` focused proof passes.
- Architecture-awareness reports one applied entity override for the target row.
- App-completion `implementedNeedsProof` count drops by one.
- Project-truth first gap advances from `clearSession` to the next Account access row.
- No runtime, production, protected account, secret, deploy, DB, exchange, payment, subscription, order, position, or live-trading mutation occurs.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for this verification/source-truth slice.
- [x] Concrete evidence file created.
- [x] Project-truth indexes refreshed.
- [x] Paperclip issue can be moved to `done` with no remaining action on this exact row.

## Stage Exit Criteria
- [x] The output matches `verification`.
- [x] Later release/deploy stages were not mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes beyond the scoped verified-status metadata repair
- production mutation or protected secret/account readback

## Validation Evidence
- Tests:
  - `corepack pnpm --filter api exec vitest run src/middleware/requireAuth.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000` -> PASS, `1` file / `9` tests.
- Manual checks:
  - targeted app-completion/project-truth readback shows `clearSession` absent from the priority queue and first gap advanced to `requireAuth`.
- Generator checks:
  - architecture-awareness exporter -> PASS, `10623` entities / `34477` relations, `entityOverridesApplied=1`.
  - app-completion exporter -> PASS, `implementedNeedsProof=114` after previous `115`.
  - project-truth `--apply` -> PASS, first gap now `apps/api/src/middleware/requireAuth.ts#requireAuth`.
- High-risk checks: no protected auth/session readback and no production mutation.
- Module confidence ledger updated: yes.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/scanner-overrides.json`; generated architecture-awareness.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable; source-truth metadata repair only.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no deploy or data migration occurred.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `clearSession` had direct test/doc relations but still had source entity status `implemented`.
- Gaps: generated app-completion held stale `implemented_needs_proof`.
- Inconsistencies: proof existed, metadata did not reflect it.
- Architecture constraints: use existing scanner override and generators.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: active mission, task board, module ledger, app-completion index, project-truth index, architecture graph, prior evidence.
- Why it was safe to continue: scoped verification/source-truth repair only.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-176](/LUC/issues/LUC-176) `clearSession` proof closure.
- Priority rationale: assigned high-priority scoped wake.
- Why other candidates were deferred: wake payload forbids switching before handling this issue.

### 3. Plan Implementation
- Files or surfaces to modify: scanner override, generated indexes, evidence/context notes.
- Logic: promote one proven entity, regenerate truth, verify readback.
- Edge cases: stale graph, generator still routing target, focused proof failure.

### 4. Execute Implementation
- Implementation notes: added a single entity override and regenerated generated source-of-truth files.

### 5. Verify and Test
- Validation performed: focused middleware test, generator chain, targeted readback.
- Result: PASS; target row resolved.

### 6. Self-Review
- Simpler option considered: close from prior evidence only; rejected because issue required refreshed indexes.
- Technical debt introduced: no.
- Scalability assessment: uses existing scanner override and generator flow.
- Refinements made: kept metadata promotion scoped to one entity.

### 7. Update Documentation and Knowledge
- Docs updated: scanner override, generated indexes, task/evidence/context notes.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to QA verification.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Required responsibility lanes were integrated.

## Result Report
- Task summary: resolved the Account access `clearSession` project-truth gap by connecting existing behavior proof to the generated app-completion metadata.
- Files changed: scanner override, generated architecture/app-completion/project-truth indexes, task/evidence/context notes.
- How tested: focused API middleware proof and generator/readback checks.
- What is incomplete: no remaining action on [LUC-176](/LUC/issues/LUC-176); next Account access gap is `requireAuth` and is outside this issue.
- Next steps: create or route a separate QA/Project Manager proof slice for `apps/api/src/middleware/requireAuth.ts#requireAuth` when selected.
- Decisions made: used the existing scanner override mechanism instead of adding duplicate tests.
