# Task

## Header
- ID: LUC-6053
- Title: Classify Runtime-Impact Dirty Cluster From LUC-6043
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: CTO
- Depends on: [LUC-6043](/LUC/issues/LUC-6043)
- Priority: P0
- Module Confidence Rows: API key/profile, backtests, release smoke scripts
- Requirement Rows: source-control closure, release provenance
- Quality Scenario Rows: release safety, local validation, test reliability
- Risk Rows: dirty shared checkout, runtime-impact uncommitted changes
- Iteration: 2026-06-28 source-control closure
- Operation Mode: ARCHITECT
- Mission ID: LUC-6053-RUNTIME-IMPACT-DIRTY-CLUSTER-CLASSIFICATION-2026-06-28
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches CTO source-control classification work.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was effectively covered by active project state readback for this bounded source-control task.
- [x] `.agents/core/mission-control.md` was reviewed through current active mission context.
- [x] Missing or template-like state tables were not material to this classification.
- [x] Affected module confidence rows were identified at module level only; no module status was changed by this classification.
- [x] Affected requirement, quality scenario, and risk rows were identified at source-control/release-risk level.
- [x] The task improves release confidence by preventing unreviewed runtime changes from becoming a release source.

## Mission Block
- Mission objective:
  classify the runtime-impact dirty cluster surfaced by [LUC-6043](/LUC/issues/LUC-6043)
  and decide whether it is commit-ready, needs split/repair, or must remain
  blocked from release.
- Release objective advanced:
  source-control closure before any push/deploy/release operation.
- Included slices:
  product-code/test files, release/QA smoke scripts, dependency/workspace
  manifests, focused local validation, and closure routing.
- Explicit exclusions:
  no push, deploy, restart, protected smoke, secret/account readback,
  production mutation, exchange mutation, order, position,
  subscription/payment mutation, live-trading action, or broad history/doc
  cleanup.
- Checkpoint cadence:
  single heartbeat classification packet.
- Stop conditions:
  runtime-impact cluster classified with validation and next owner.
- Handoff expectation:
  Backend/QA source-control closure lane [LUC-6064](/LUC/issues/LUC-6064)
  owns any future commit, DB-backed validation, and split decision for this
  cluster.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | CTO active chat | [LUC-6053](/LUC/issues/LUC-6053), [LUC-6043](/LUC/issues/LUC-6043), git status | Classification packet, issue disposition | Runtime-impact dirty cluster classification | Git diff/status, focused script tests, focused API-key validation attempt | DONE |
| Backend/QA follow-up | [09 CBE](/LUC/agents/09-cbe-core-backend-engineer) via [LUC-6064](/LUC/issues/LUC-6064) | This task packet | API e2e cleanup and validation files | Future commit/split/repair decision | DB-backed API tests | ROUTED |
| Ops/Release | Ops/Delivery | [LUC-5997](/LUC/issues/LUC-5997), [LUC-6000](/LUC/issues/LUC-6000) | Release source selection | Keep shared main out of release source | Clean RC ref remains separate | INFORMED |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed.
- [x] Responsibility lanes are explicit.
- [x] No two write lanes own the same file in this task.
- [x] Each lane has expected output and validation/proof.
- [x] Missing ownership is routed to Backend/QA, not expanded silently by CTO.

## Context
[LUC-6043](/LUC/issues/LUC-6043) reported a large dirty Soar packet and created
this child for the runtime-impact subset. The shared Soar checkout remains
dirty and divergent from `origin/main`, while [LUC-5997](/LUC/issues/LUC-5997)
already recorded a separate clean release-candidate source ref from
[LUC-6000](/LUC/issues/LUC-6000).

## Goal
Classify the runtime-impact dirty cluster so PM/Delivery can tell whether the
files should be committed, repaired, split, or rejected before any release
operation.

## Scope
- `apps/api/src/modules/backtests/backtests.e2e.test.ts`
- `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts`
- `apps/api/src/modules/profile/apiKey/apiKey.types.ts`
- `scripts/goLiveSmoke.mjs`
- `scripts/goLiveSmoke.test.mjs`
- `scripts/releaseOpsScriptContracts.test.mjs`
- `scripts/runQaRepeatableSmokeE2e.mjs`
- `scripts/runQaRepeatableSmokeE2e.test.mjs`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`

## Implementation Plan
1. Read issue heartbeat context and prior source-control closure state.
2. Inspect current branch, dirty status, and diffs for the runtime-impact files.
3. Classify behavior impact and release risk.
4. Run smallest relevant validation that does not require protected inputs or
   production mutation.
5. Record source-of-truth summary and final Paperclip disposition.

## Acceptance Criteria
- Runtime-impact files reviewed and categorized.
- Behavior impact recorded.
- Validation command/result recorded.
- Secret/redaction boundary recorded.
- Commit/no-commit decision recorded.
- Residual risk and next owner recorded.

## Definition of Done
- [x] [LUC-6053](/LUC/issues/LUC-6053) has a durable classification packet.
- [x] Validation evidence is recorded.
- [x] No protected or production mutation occurred.
- [x] The shared dirty checkout is not treated as a release source.
- [x] The next owner/action is explicit.

## Validation Evidence
- Current source-control status:
  `main...origin/main [ahead 15, behind 2]`.
- Current dirty count:
  `209` porcelain rows total: `39` tracked/modified and `170` untracked.
- Runtime-scope dirty count:
  `11` tracked modified files in the scope listed above.
- Runtime behavior classification:
  - `apiKey.types.ts` changes API-key exchange validation from a literal enum
    to shared `EXCHANGE_OPTIONS`.
  - `apiKey.e2e.test.ts` adds a shared exchange configuration contract and
    broad DB cleanup retry/reset logic.
  - `backtests.e2e.test.ts` adds broader DB cleanup retry/reset logic.
  - `goLiveSmoke.mjs`, `runQaRepeatableSmokeE2e.mjs`, package scripts, and
    tests route API/backtests smoke through infra-aware wrappers and add a
    focused backtests target.
  - `pnpm-workspace.yaml` receives security/package-manager overrides moved
    from `package.json`; `pnpm-lock.yaml` changes with that manifest movement.
- Secret/redaction check:
  no secret values, cookies, tokens, account passwords, API keys, payment
  data, exchange credentials, or protected production inputs were read or
  recorded by this task.
- Validation command:
  `pnpm exec node --test scripts/goLiveSmoke.test.mjs scripts/runQaRepeatableSmokeE2e.test.mjs scripts/releaseOpsScriptContracts.test.mjs`
  passed `22/22`.
- Focused API validation attempt:
  `pnpm --filter api exec vitest run src/modules/profile/apiKey/apiKey.e2e.test.ts -t "keeps API-key validation on the shared names-only exchange configuration" --run`
  failed after the suite `beforeEach` cleanup hook timed out at `10000ms`
  (`1` failed, `18` skipped). This is local DB-backed validation instability,
  not a production proof.
- Reality status:
  partially verified.

## Architecture Evidence
- Architecture source reviewed:
  source-control/build-provenance closure packets and current repository state.
- Fits approved architecture:
  yes as a classification/routing task.
- Mismatch discovered:
  no architecture mismatch. The risk is source-control/release readiness, not
  architecture intent.
- Decision required from user:
  no.
- Follow-up architecture doc updates:
  none.

## Deployment / Ops Evidence
- Deploy impact:
  none in this task.
- Env or secret changes:
  none.
- Health-check impact:
  none executed against production.
- Smoke steps updated:
  not by this task; the dirty cluster itself contains uncommitted smoke-runner
  changes that must be committed only by a dedicated Backend/QA closure lane.
- Rollback note:
  no deploy occurred. Do not use shared dirty `main` as a release source.
- Observability or alerting impact:
  none.
- Staged rollout or feature flag:
  not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  [LUC-6053](/LUC/issues/LUC-6053) owns runtime-impact dirty classification.
- Gaps:
  API DB-backed validation did not pass because the modified cleanup hook timed
  out locally.
- Inconsistencies:
  runtime files are mixed with broad evidence/docs/state dirt in the shared
  checkout.
- Architecture constraints:
  release operations must not use dirty/divergent shared `main`.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed:
  no.
- Sources scanned:
  issue heartbeat context, current task board/project state, prior
  [LUC-5997](/LUC/issues/LUC-5997) source-control packet, git status/diff.
- Why it was safe to continue:
  classification and local validation only; no protected or production action.

### 2. Select One Priority Mission Objective
- Selected task:
  classify [LUC-6053](/LUC/issues/LUC-6053) runtime-impact dirty cluster.
- Priority rationale:
  critical release/source-control safety gate.
- Why other candidates were deferred:
  this scoped wake forbids switching to another issue.

### 3. Plan Implementation
- Files or surfaces to modify:
  source-of-truth summaries and this task packet only.
- Logic:
  inspect diffs, classify behavior, validate script contracts, route API
  validation residual.
- Edge cases:
  avoid committing unrelated dirty shared checkout state.

### 4. Execute Implementation
- Implementation notes:
  no runtime implementation was changed by this task.

### 5. Verify and Test
- Validation performed:
  git status/diff, script contract tests, focused API-key validation attempt.
- Result:
  script contract tests pass; API-key e2e focused validation times out in
  cleanup hook.

### 6. Self-Review
- Simpler option considered:
  comment-only classification. Rejected because repository source-of-truth
  needs durable evidence for source-control closure.
- Technical debt introduced:
  no.
- Scalability assessment:
  route future commit/repair to the owning Backend/QA lane.
- Refinements made:
  explicit no-commit decision and release-source prohibition.

### 7. Update Documentation and Knowledge
- Docs updated:
  this task packet, `.agents/state/active-mission.md`,
  `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`.
- Context updated:
  yes.
- Learning journal updated:
  not applicable; no new recurring pitfall beyond already-known DB-backed
  validation instability.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to CTO/source-control role.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.

## Production-Grade Required Contract

### Goal
Classify runtime-impact dirty source-control changes before release.

### Scope
The 11 runtime-scope files listed above.

### Implementation Plan
Inspect, validate, classify, and route without committing or deploying.

### Acceptance Criteria
Runtime impact, validation result, commit decision, push/deploy impact, and
next owner are explicit.

### Definition of Done
`DEFINITION_OF_DONE.md` is satisfied for a classification task: evidence exists,
no unsafe release action occurred, and residual risk is routed.

### Result Report
- Task summary:
  [LUC-6053](/LUC/issues/LUC-6053) is classified as
  `DONE / RUNTIME_IMPACT_DIRTY_CLUSTER_CLASSIFIED / NOT_COMMITTED /
  BACKEND_QA_CLOSURE_REQUIRED`.
- Files changed:
  source-of-truth summaries and this task packet only.
- How tested:
  script contract tests passed `22/22`; focused API-key e2e validation failed
  on cleanup hook timeout.
- What is incomplete:
  runtime cluster is not committed and not releaseable from shared `main`.
- Next steps:
  [LUC-6064](/LUC/issues/LUC-6064), assigned to
  [09 CBE](/LUC/agents/09-cbe-core-backend-engineer), should split or commit
  this coherent runtime cluster only after DB-backed API validation passes,
  then record the commit SHA. Ops/Delivery must continue using the clean RC
  source path from [LUC-6000](/LUC/issues/LUC-6000) for release consideration,
  not shared dirty `main`.
- Decisions made:
  no commit, no push, no deploy from this heartbeat.
