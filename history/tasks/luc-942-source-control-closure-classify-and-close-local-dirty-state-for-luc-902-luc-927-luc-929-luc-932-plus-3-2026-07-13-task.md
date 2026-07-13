# LUC-942 Source-Control Closure: Classify and Close Local Dirty State for LUC-902-LUC-927-LUC-929-LUC-932-plus-3

## Header
- ID: LUC-942
- Title: [Soar][Source Control Closure] Classify and close local dirty state for LUC-902-LUC-927-LUC-929-LUC-932-plus-3
- Task Type: coordination
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Priority: high
- Mission ID: LUC-942-SOURCE-CONTROL-CLOSE-LUC-902-LUC-927-LUC-929-LUC-932-PLUS-3-2026-07-13
- Mission Status: VERIFIED

## Context
[LUC-942](/LUC/issues/LUC-942) is the next local source-control closure sidecar for the runtime-session proof/readback cluster that now spans [LUC-902](/LUC/issues/LUC-902), [LUC-927](/LUC/issues/LUC-927), [LUC-929](/LUC/issues/LUC-929), [LUC-932](/LUC/issues/LUC-932), [LUC-933](/LUC/issues/LUC-933), [LUC-934](/LUC/issues/LUC-934), and [LUC-938](/LUC/issues/LUC-938). This heartbeat stayed inside the local closure lane: inspect the current worktree, classify the shared proof/generated-truth packet, verify it is safe to preserve locally, and record the commit decision without treating any deploy or protected-production gates as cleared.

## Goal
Classify the current dirty worktree for the linked runtime-session proof/readback bundle, prove whether a local source-control closure commit is safe, and leave a durable closure packet for board handoff.

## Scope
- `git status --porcelain=v1 -uall`
- `git diff --check`
- Dirty-path category classification
- Explicit issue-reference scan across dirty paths
- Focused verification for the touched proof/readback layers
- Lightweight redaction scan on dirty files
- Repo-side source-of-truth updates for this closure packet
- One local commit if the bundle remains coherent and verified

## Implementation Plan
1. Capture the baseline dirty tree before mutating `LUC-942` artifacts.
2. Group dirty paths into state/control, task/evidence, docs/generated, runtime/product, and stale/other.
3. Scan the dirty paths for [LUC-902](/LUC/issues/LUC-902), [LUC-927](/LUC/issues/LUC-927), [LUC-929](/LUC/issues/LUC-929), [LUC-932](/LUC/issues/LUC-932), [LUC-933](/LUC/issues/LUC-933), [LUC-934](/LUC/issues/LUC-934), [LUC-938](/LUC/issues/LUC-938), and baseline [LUC-942](/LUC/issues/LUC-942) ownership.
4. Re-run the smallest meaningful verification for the untracked proof files and generated-truth layer.
5. Persist the closure packet and make the local commit decision.

## Acceptance Criteria
- [x] Baseline dirty-tree counts are recorded.
- [x] The linked issue bundle is explicitly attributable in the dirty tree.
- [x] Runtime/product-code risk is classified rather than hand-waved.
- [x] Focused proof and source-truth verification are recorded.
- [x] Secret-risk readback is recorded without exposing sensitive values.
- [x] A durable repo-side evidence packet exists for [LUC-942](/LUC/issues/LUC-942).
- [x] The local source-control decision is explicit and justified.

## Constraints
- Stay inside local source-control closure scope.
- Do not push, deploy, restart, rollback, or mutate credentials/accounts.
- Do not treat protected delivery-gate status as cleared.
- Do not over-claim the closure commit as broader release acceptance.

## Definition of Done
- [x] Dirty-path classification is durable in repo artifacts.
- [x] Focused validation for the proof/generated-truth bundle is recorded.
- [x] Local source-control disposition is explicit with residual risk and next owner.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Classification

### Baseline Dirty Tree

- Baseline captured before this `LUC-942` artifact mutation: `43` dirty paths.
- Category counts:

| Category | Count |
| --- | ---: |
| State/control | 3 |
| Task/evidence | 14 |
| Docs/generated state | 23 |
| Runtime/product code | 3 |
| Stale/out-of-scope | 0 |

### Linked Issue Attribution

| Issue | Dirty paths with explicit refs |
| --- | ---: |
| [LUC-902](/LUC/issues/LUC-902) | 12 |
| [LUC-927](/LUC/issues/LUC-927) | 8 |
| [LUC-929](/LUC/issues/LUC-929) | 8 |
| [LUC-932](/LUC/issues/LUC-932) | 12 |
| [LUC-933](/LUC/issues/LUC-933) | 12 |
| [LUC-934](/LUC/issues/LUC-934) | 5 |
| [LUC-938](/LUC/issues/LUC-938) | 10 |
| [LUC-942](/LUC/issues/LUC-942) | 0 baseline paths |

- The runtime/product paths are:
  - `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts`
  - `apps/api/src/modules/bots/runtimeSessionRead.list.test.ts`
  - `apps/api/src/modules/bots/runtimeSessionTradesRead.list.test.ts`
- Those three files are attributable to the linked proof/readback cluster:
  `runtimeSessionRead.list.test.ts` closes the [LUC-902](/LUC/issues/LUC-902) proof lane, `runtimeSessionOpenOrdersReadModel.service.test.ts` carries the focused helper coverage read back by [LUC-933](/LUC/issues/LUC-933) and [LUC-934](/LUC/issues/LUC-934), and `runtimeSessionTradesRead.list.test.ts` closes the backend-read proof lane in [LUC-938](/LUC/issues/LUC-938).
- The generated graph/status bundle does not repeat issue IDs in every file, but it is directly traceable to the same linked issue set because the diff updates `priority-test-links.csv`, `scanner-overrides.json`, downstream architecture-awareness exports, and the resulting app-completion/project-truth readbacks that those issues explicitly refreshed.

### Safety Readback

- `git diff --check` passed with line-ending normalization warnings only; no substantive diff errors were reported.
- Focused proof validation passed: `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionRead.list.test.ts src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts src/modules/bots/runtimeSessionTradesRead.list.test.ts --run --reporter=dot` (`3` files, `9` tests).
- Source-truth drift validation passed: `pnpm run architecture:graph:drift:strict` (`857/857` covered, `0` missing).
- Added-line secret-pattern scan on the scoped dirty paths found only code identifiers and evidence wording such as `apiKeyFingerprint`, `token`, and `password`; no raw secret values, env-file disclosure, private-key material, or credential payloads were introduced.

## Validation Evidence
- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionRead.list.test.ts src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts src/modules/bots/runtimeSessionTradesRead.list.test.ts --run --reporter=dot`
- Manual checks:
  - `git status --porcelain=v1 -uall`
  - `git diff --check`
  - explicit per-path scans for [LUC-902](/LUC/issues/LUC-902), [LUC-927](/LUC/issues/LUC-927), [LUC-929](/LUC/issues/LUC-929), [LUC-932](/LUC/issues/LUC-932), [LUC-933](/LUC/issues/LUC-933), [LUC-934](/LUC/issues/LUC-934), [LUC-938](/LUC/issues/LUC-938), and [LUC-942](/LUC/issues/LUC-942)
  - added-line secret-pattern scan over the dirty paths
- High-risk checks:
  - `pnpm run architecture:graph:drift:strict`
  - no push/deploy/protected-account activity
- Reality status:
  - verified

## Result Report
- Task summary:
  - classified the current local bundle as a coherent runtime-session proof plus generated source-truth chain spanning [LUC-902](/LUC/issues/LUC-902), [LUC-927](/LUC/issues/LUC-927), [LUC-929](/LUC/issues/LUC-929), [LUC-932](/LUC/issues/LUC-932), [LUC-933](/LUC/issues/LUC-933), [LUC-934](/LUC/issues/LUC-934), and [LUC-938](/LUC/issues/LUC-938), and proved it is safe to preserve with a local commit.
- Files changed:
  - `history/tasks/luc-942-source-control-closure-classify-and-close-local-dirty-state-for-luc-902-luc-927-luc-929-luc-932-plus-3-2026-07-13-task.md`
  - `history/evidence/luc-942-source-control-closure-2026-07-13.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - baseline dirty-tree readback, diff check, issue-ref scan, added-line secret scan, three focused runtime-session proof runs, and architecture drift audit
- What is incomplete:
  - direct doc-link closure remains outside this sidecar and is not claimed here
- Next steps:
  - preserve the verified local bundle with one scoped commit and report the closure evidence back on [LUC-942](/LUC/issues/LUC-942)
- Decisions made:
  - local source-control decision is `commit`
  - push status is held for batch because a push from `main` may trigger Coolify redeploy, which this issue does not own
