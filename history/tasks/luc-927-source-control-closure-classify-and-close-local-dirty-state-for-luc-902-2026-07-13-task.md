# LUC-927 Source-Control Closure: Classify and Close Local Dirty State for LUC-902

## Header
- ID: LUC-927
- Title: [Soar][Source Control Closure] Classify and close local dirty state for LUC-902
- Task Type: coordination
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Priority: high
- Mission ID: LUC-927-SOURCE-CONTROL-CLOSE-LUC-902-2026-07-13
- Mission Status: VERIFIED

## Context
[LUC-927](/LUC/issues/LUC-927) is the local source-control closure sidecar for [LUC-902](/LUC/issues/LUC-902). The proof lane already closed the `missing_test_link` requirement for `listBotRuntimeSessions`, but explicitly left local dirty-state ownership open because the shared worktree still carried generated/status updates plus a new scoped test file. This heartbeat stays inside the source-control lane: classify the dirty bundle, verify it is coherent and safe to preserve locally, and remove the local closure blocker from the linked proof issue.

## Goal
Classify the current dirty worktree for the [LUC-902](/LUC/issues/LUC-902) bundle, prove whether a local source-control closure decision is safe, and leave a durable closure packet for board handoff.

## Scope
- `git status --porcelain=v1 -uall`
- `git diff --check`
- Dirty-path category classification
- Explicit issue-reference scan across dirty paths
- Focused verification for the touched proof/doc-truth layers
- Lightweight redaction scan on dirty files
- Repo-side source-of-truth updates for this closure packet

## Implementation Plan
1. Capture the baseline dirty tree before mutating `LUC-927` artifacts.
2. Group the dirty paths into state/control, task/evidence, docs/generated, runtime/product, and stale/other.
3. Scan the dirty paths for `LUC-902` and baseline `LUC-927` ownership.
4. Re-run the smallest meaningful verification for the touched proof and source-truth layers.
5. Persist the closure packet and remove the local source-control blocker from repo state.

## Acceptance Criteria
- [x] Baseline dirty-tree counts are recorded.
- [x] The linked [LUC-902](/LUC/issues/LUC-902) bundle is explicitly attributable in the dirty tree.
- [x] Runtime/product-code risk is classified rather than hand-waved.
- [x] Focused proof and source-truth verification are recorded.
- [x] Secret-risk readback is recorded without exposing sensitive values.
- [x] A durable repo-side evidence packet exists for [LUC-927](/LUC/issues/LUC-927).
- [x] The local source-control decision is explicit and justified.

## Constraints
- Stay inside local source-control closure scope.
- Do not push, deploy, restart, rollback, or mutate credentials/accounts.
- Do not over-claim the closure packet as broader release acceptance.

## Definition of Done
- [x] Dirty-path classification is durable in repo artifacts.
- [x] Focused validation for the proof/doc-truth bundle is recorded.
- [x] Local source-control disposition is explicit with residual risk and next owner.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Classification

### Baseline Dirty Tree

- Baseline captured before this `LUC-927` artifact mutation: `27` dirty paths.
- Category counts:

| Category | Count |
| --- | ---: |
| State/control | 3 |
| Task/evidence | 2 |
| Docs/generated state | 21 |
| Runtime/product code | 1 |
| Stale/out-of-scope | 0 |

### Linked Issue Attribution

| Issue | Dirty paths with explicit refs |
| --- | ---: |
| [LUC-902](/LUC/issues/LUC-902) | 10 |
| [LUC-927](/LUC/issues/LUC-927) | 0 baseline paths |

- The runtime/product path is `apps/api/src/modules/bots/runtimeSessionRead.list.test.ts`, which adds focused `listBotRuntimeSessions` read-service proof coverage for [LUC-902](/LUC/issues/LUC-902).
- The generated graph/status bundle does not repeat issue IDs in every file, but it is directly traceable to [LUC-902](/LUC/issues/LUC-902) because the diff adds the controller/read-service proof links in `priority-test-links.csv`, `scanner-overrides.json`, `architecture-awareness.*`, and `architecture-proof-register.csv`, and the downstream generated outputs reflect that change.

### Safety Readback

- `git diff --check` passed with line-ending normalization warnings only; no substantive diff errors were reported.
- Focused proof validation passed: `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionRead.list.test.ts --run --reporter=dot` (`1` file, `2` tests).
- Source-truth drift validation passed: `pnpm run architecture:graph:drift:strict` (`855/855` covered, `0` missing).
- Lightweight secret-pattern scan on the dirty paths found no evident live-secret formats, private-key material, or env-file disclosure.

## Validation Evidence
- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionRead.list.test.ts --run --reporter=dot`
- Manual checks:
  - `git status --porcelain=v1 -uall`
  - `git diff --check`
  - explicit per-path scans for `LUC-902` and `LUC-927`
  - lightweight dirty-path secret-pattern scan over scoped live-secret regexes
- High-risk checks:
  - `pnpm run architecture:graph:drift:strict`
  - no push/deploy/protected-account activity
- Reality status:
  - verified

## Result Report
- Task summary:
  - classified the current local bundle as a coherent [LUC-902](/LUC/issues/LUC-902) proof plus generated source-truth chain and proved it is safe to preserve locally.
- Files changed:
  - `history/tasks/luc-927-source-control-closure-classify-and-close-local-dirty-state-for-luc-902-2026-07-13-task.md`
  - `history/evidence/luc-927-source-control-closure-2026-07-13.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - baseline dirty-tree readback, diff check, issue-ref scan, secret-pattern scan, focused runtime-session read proof run, and architecture drift audit
- What is incomplete:
  - direct doc-link closure for the controller and read service remains a separate docs-owned follow-up outside this sidecar
- Next steps:
  - preserve the verified local bundle with a scoped commit when the broader worktree batching decision is made
- Decisions made:
  - local source-control decision is `commit`
  - push status is held because this sidecar does not own deployment-triggering actions from `main`
