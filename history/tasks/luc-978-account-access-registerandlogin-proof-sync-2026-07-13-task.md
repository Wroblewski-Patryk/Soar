# Task

## Header
- ID: LUC-978
- Title: Account access `registerAndLogin` proof sync
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-975](/LUC/issues/LUC-975)
- Priority: P1
- Module Confidence Rows: Account access / API bots shared auth bootstrap helper executable proof
- Requirement Rows: not applicable
- Quality Scenario Rows: not applicable
- Risk Rows: not applicable
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-978-ACCOUNT-ACCESS-REGISTERANDLOGIN-PROOF-SYNC-2026-07-13
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were bootstrapped from repository
      sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or
      marked not applicable.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective:
  close the stale `implemented_needs_proof` row for
  `apps/api/src/modules/bots/bots.e2e.shared.ts#registerAndLogin`.
- Release objective advanced:
  Account access app-completion truth accuracy.
- Included slices:
  diagnosis, focused proof rerun, verified override sync, generator refresh,
  evidence update.
- Explicit exclusions:
  runtime code changes, new tests, deploy, push, protected smoke,
  source-control batching.
- Checkpoint cadence:
  single verification heartbeat.
- Stop conditions:
  the helper clears from the first-gap proof slot or a concrete blocker is
  proven.
- Handoff expectation:
  close the Paperclip issue with proof-sync evidence and explicit no-runtime-change note.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, heartbeat context | issue framing and closeout | integrated QA closure packet | Paperclip closeout | COMPLETE |
| QA/Test | QA/Test | `docs/status/project-truth-index.*`, `docs/architecture/scanner-overrides.json` | proof sync and evidence files | verified helper override plus refreshed indexes | focused duplicate-guard e2e and generator readback | COMPLETE |
| Documentation/Memory | Coordinator | `.codex/context/*`, module confidence ledger | repo truth updates for this lane | durable state entry | state readback | COMPLETE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was created or refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md`.
- [x] Process eval will be recorded in `.agents/state/agent-evals.md` if this
      is broad, repeated, partial, or subagent-heavy work.

## Context

`LUC-975` already closed the docs lane for the bots shared
`registerAndLogin` helper, but project truth still routed the helper as the
first Account access `implemented_needs_proof` gap. The task was to determine
whether that row reflected a real missing proof or a stale proof-sync gap.

## Goal

Make generated Soar truth reflect the existing executable proof for
`apps/api/src/modules/bots/bots.e2e.shared.ts#registerAndLogin`.

## Success Signal
- User or operator problem:
  project truth still flags the shared bots auth bootstrap helper as needing proof.
- Expected product or reliability outcome:
  app-completion and project-truth stop treating the helper as the first open
  Account access proof gap.
- How success will be observed:
  the helper disappears from the `firstGap` proof slot after focused rerun and
  generator refresh.
- Post-launch learning needed: no

## Deliverable For This Stage

Produce a verified proof-sync packet: focused rerun, canonical override sync,
and durable evidence showing the generated row cleared.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Root cause for the stale `implemented_needs_proof` row is identified.
- [x] Canonical proof metadata is updated through existing scanner overrides.
- [x] Generated app-completion and project-truth readback no longer route the
      shared helper as the first Account access proof gap.

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
  - `corepack pnpm --filter api exec vitest run src/modules/bots/bots.duplicate-guard.e2e.test.ts --run --reporter=dot --test-timeout 30000`
- Manual checks:
  - direct readback of `docs/status/app-completion-index.json`
  - direct readback of `docs/status/project-truth-index.json`
- Screenshots/logs:
  - not applicable
- High-risk checks:
  - not applicable
- Module confidence ledger updated: yes
- Module confidence rows closed or changed:
  - Account access / API bots shared auth bootstrap helper executable proof
- Requirements matrix updated: not applicable
- Requirement rows closed or changed:
  - none
- Quality scenarios updated: not applicable
- Quality scenario rows closed or changed:
  - none
- Risk register updated: not applicable
- Risk rows closed or changed:
  - none
- Reality status: verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docs/architecture/scanner-overrides.json` and generated status outputs.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  not applicable
- Follow-up architecture doc updates:
  none

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes:
  none
- Health-check impact:
  none
- Smoke steps updated:
  no
- Rollback note:
  not applicable
- Observability or alerting impact:
  none
- Staged rollout or feature flag:
  none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  project truth still listed the bots shared `registerAndLogin` helper as
  `implemented_needs_proof`.
- Gaps:
  missing verified entity override for an already-executed helper.
- Inconsistencies:
  doc-link closure existed, but generated proof status still lagged behind.
- Architecture constraints:
  must use scanner overrides and generator refresh, not ad hoc status edits.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files:
  none
- Sources scanned:
  heartbeat context, `scanner-overrides.json`, proof artifacts, status indexes,
  `bots.e2e.shared.ts`, `bots.duplicate-guard.e2e.test.ts`.
- Rows created or corrected:
  one verified entity override for the shared helper.
- Assumptions recorded:
  safe assumption that the duplicate-guard e2e suite remained the canonical
  executable proof for the shared helper.
- Blocking unknowns:
  none
- Why it was safe to continue:
  the focused rerun could directly validate the assumption without new runtime work.

### 2. Select One Priority Mission Objective
- Selected task:
  sync the bots shared `registerAndLogin` proof into generated truth.
- Priority rationale:
  it was the first Account access proof gap in project truth.
- Why other candidates were deferred:
  out of issue scope.

### 3. Plan Implementation
- Files or surfaces to modify:
  `docs/architecture/scanner-overrides.json`, generated status outputs, task
  and evidence artifacts, state summaries.
- Logic:
  add verified override, rerun the smallest covering e2e file, rerun
  generators, read back first-gap change.
- Edge cases:
  adjacent `registerAndLogin` helpers in other modules must remain untouched.

### 4. Execute Implementation
- Implementation notes:
  synced the missing verified override and refreshed the generated truth chain.

### 5. Verify and Test
- Validation performed:
  focused duplicate-guard e2e rerun plus serial generator refresh and status
  readback.
- Result:
  PASS; the shared helper cleared from the first-gap proof slot.

### 6. Self-Review
- Simpler option considered:
  comment-only closure based on existing evidence.
- Technical debt introduced: no
- Scalability assessment:
  uses the same verified override pattern as other closed app-completion proof
  rows.
- Refinements made:
  kept the fix limited to metadata and readback only.

### 7. Update Documentation and Knowledge
- Docs updated:
  proof evidence and generated truth outputs.
- Context updated:
  project state, task board, module confidence ledger.
- Learning journal updated: not applicable.

## Review Checklist (mandatory)
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
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.

