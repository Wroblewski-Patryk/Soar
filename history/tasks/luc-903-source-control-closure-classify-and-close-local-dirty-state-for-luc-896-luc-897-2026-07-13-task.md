# LUC-903 Source-Control Closure: Classify and Close Local Dirty State for LUC-896-LUC-897

## Header
- ID: LUC-903
- Title: [Soar][Source Control Closure] Classify and close local dirty state for LUC-896-LUC-897
- Task Type: coordination
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Priority: high
- Mission ID: LUC-903-SOURCE-CONTROL-CLOSE-LUC-896-LUC-897-2026-07-13
- Mission Status: VERIFIED

## Context
[LUC-903](/LUC/issues/LUC-903) is the local source-control closure sidecar created because the implementation chain remains gated elsewhere. This heartbeat stayed inside the local closure lane: inspect the current worktree, classify the `LUC-896` proof and `LUC-897` doc-link/generated-truth bundle, verify it is safe to preserve locally, and report the closure evidence back without treating protected delivery gates as cleared.

## Goal
Classify the current dirty worktree for the linked `LUC-896` and `LUC-897` bundle, prove whether a local source-control closure commit is safe, and leave a durable closure packet for board handoff.

## Scope
- `git status --porcelain=v1 -uall`
- `git diff --check`
- Dirty-path category classification
- Explicit issue-reference scan across dirty paths
- Focused verification for the touched proof/doc-truth layers
- Lightweight redaction scan on dirty files
- Repo-side source-of-truth updates for this closure packet
- One local commit if the bundle remains coherent and verified

## Implementation Plan
1. Capture the baseline dirty tree before mutating `LUC-903` artifacts.
2. Group the dirty paths into state/control, task/evidence, docs/generated, runtime/product, and stale/other.
3. Scan the dirty paths for `LUC-896`, `LUC-897`, and baseline `LUC-903` ownership.
4. Re-run the smallest meaningful verification for the touched proof and source-truth layers.
5. Persist the closure packet and make the local commit decision.

## Acceptance Criteria
- [x] Baseline dirty-tree counts are recorded.
- [x] The linked `LUC-896` and `LUC-897` bundle is explicitly attributable in the dirty tree.
- [x] Runtime/product-code risk is classified rather than hand-waved.
- [x] Focused proof and source-truth verification are recorded.
- [x] Secret-risk readback is recorded without exposing sensitive values.
- [x] A durable repo-side evidence packet exists for `LUC-903`.
- [x] The local source-control decision is explicit and justified.

## Constraints
- Stay inside local source-control closure scope.
- Do not push, deploy, restart, rollback, or mutate credentials/accounts.
- Do not treat protected delivery-gate status as cleared.
- Do not over-claim the closure commit as broader release acceptance.

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

- Baseline captured before this `LUC-903` artifact mutation: `35` dirty paths.
- Category counts:

| Category | Count |
| --- | ---: |
| State/control | 5 |
| Task/evidence | 6 |
| Docs/generated state | 23 |
| Runtime/product code | 1 |
| Stale/out-of-scope | 0 |

### Linked Issue Attribution

| Issue | Dirty paths with explicit refs |
| --- | ---: |
| [LUC-896](/LUC/issues/LUC-896) | 9 |
| [LUC-897](/LUC/issues/LUC-897) | 8 |
| [LUC-903](/LUC/issues/LUC-903) | 0 baseline paths |

- The runtime/product path is `apps/api/src/modules/bots/botOwnership.service.test.ts`, which adds focused `resolveSessionWindowEnd` proof coverage for [LUC-896](/LUC/issues/LUC-896).
- The generated graph/status bundle does not repeat issue IDs in every file, but it is directly traceable to [LUC-897](/LUC/issues/LUC-897) because the source diff adds the missing `getBotRuntimeSession` doc relation in canonical docs/link registries and the downstream generated outputs reflect that change.

### Safety Readback

- `git diff --check` passed with line-ending normalization warnings only; no substantive diff errors were reported.
- Focused proof validation passed: `corepack pnpm --filter api exec vitest run src/modules/bots/botOwnership.service.test.ts` (`1` file, `7` tests).
- Source-truth drift validation passed: `pnpm run architecture:graph:drift:strict` (`853/853` covered, `0` missing).
- Lightweight secret-pattern scan on the dirty paths found no evident raw secret values, env-file disclosure, or private-key material.

## Validation Evidence
- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/botOwnership.service.test.ts`
- Manual checks:
  - `git status --porcelain=v1 -uall`
  - `git diff --check`
  - explicit per-path scans for `LUC-896`, `LUC-897`, and `LUC-903`
  - lightweight secret-pattern scan over the dirty paths
- High-risk checks:
  - `pnpm run architecture:graph:drift:strict`
  - no push/deploy/protected-account activity
- Reality status:
  - verified

## Result Report
- Task summary:
  - classified the current local bundle as a coherent `LUC-896` proof plus `LUC-897` doc-link/generated-truth chain and proved it is safe to preserve with a local commit.
- Files changed:
  - `history/tasks/luc-903-source-control-closure-classify-and-close-local-dirty-state-for-luc-896-luc-897-2026-07-13-task.md`
  - `history/evidence/luc-903-source-control-closure-2026-07-13.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - baseline dirty-tree readback, diff check, issue-ref scan, secret-pattern scan, focused bot-ownership proof run, and architecture drift audit
- What is incomplete:
  - protected delivery-gate closure remains outside this sidecar and is not claimed here
- Next steps:
  - preserve the verified local bundle with one scoped commit and report the closure evidence back on [LUC-903](/LUC/issues/LUC-903)
- Decisions made:
  - local source-control decision is `commit`
  - push status is held for batch because a push from `main` may trigger Coolify redeploy, which this issue does not own
