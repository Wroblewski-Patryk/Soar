# LUC-957 Source-Control Closure: Classify and Close Local Dirty State for LUC-950-LUC-956

## Header
- ID: LUC-957
- Title: [Soar][Source Control Closure] Classify and close local dirty state for LUC-950-LUC-956
- Task Type: coordination
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Priority: high
- Mission ID: LUC-957-SOURCE-CONTROL-CLOSE-LUC-950-LUC-956-2026-07-13
- Mission Status: VERIFIED

## Context
[LUC-957](/LUC/issues/LUC-957) is the final local source-control closure
sidecar for the current [LUC-950](/LUC/issues/LUC-950) documentation-closure
bundle after [LUC-956](/LUC/issues/LUC-956) added its own durable task/evidence
artifacts. This heartbeat stayed inside the local closure lane: inspect the
current worktree, classify the combined docs/generated/state packet, verify it
is safe to preserve locally, and make the required local commit decision
without treating deploy or protected-production gates as cleared.

## Goal
Classify the current dirty worktree for the linked `LUC-950` plus `LUC-956`
closure bundle, prove whether a local source-control closure commit is safe,
and leave a durable closure packet for board handoff.

## Scope
- `git status --porcelain=v1 -uall`
- `git diff --check`
- Dirty-path category classification
- Explicit issue-reference scan across dirty paths
- Minimal docs/generated-truth verification
- Lightweight redaction scan on dirty files
- Repo-side source-of-truth updates for this closure packet
- One scoped local commit for the docs/history/context-only packet

## Implementation Plan
1. Capture the baseline dirty tree after `LUC-950` and `LUC-956` artifacts
   exist but before mutating `LUC-957` artifacts.
2. Group dirty paths into state/control, task/evidence, docs/generated,
   runtime/product, and stale/other.
3. Scan the dirty paths for [LUC-950](/LUC/issues/LUC-950) and
   [LUC-956](/LUC/issues/LUC-956) provenance and manually inspect the only
   redaction-scan hits for false-positive wording.
4. Re-run the smallest meaningful verification for the preserved
   docs/generated layer.
5. Persist the closure packet and create one local source-control closure
   commit for the coherent bundle.

## Acceptance Criteria
- [x] Baseline dirty-tree counts are recorded.
- [x] The linked issue bundle is explicitly attributable in the dirty tree.
- [x] Runtime/product-code risk is classified rather than hand-waved.
- [x] Focused docs/generated verification is recorded.
- [x] Secret-risk readback is recorded without exposing sensitive values.
- [x] A durable repo-side evidence packet exists for
      [LUC-957](/LUC/issues/LUC-957).
- [x] The local source-control decision is explicit and justified.
- [x] One scoped local commit preserves the docs/history/context-only packet.

## Constraints
- Stay inside local source-control closure scope.
- Do not push, deploy, restart, rollback, or mutate credentials/accounts.
- Do not treat protected delivery-gate status as cleared.
- Do not over-claim the closure commit as broader release acceptance.

## Definition of Done
- [x] Dirty-path classification is durable in repo artifacts.
- [x] Focused validation for the docs/generated-truth bundle is recorded.
- [x] Local source-control disposition is explicit with residual risk and next
      owner.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Classification

### Baseline Dirty Tree

- Baseline captured before this `LUC-957` artifact mutation: `29` dirty paths.
- Category counts:

| Category | Count |
| --- | ---: |
| State/control | 2 |
| Task/evidence | 4 |
| Docs/generated state | 23 |
| Runtime/product code | 0 |
| Stale/out-of-scope | 0 |

### Linked Issue Attribution

| Issue | Dirty paths with explicit refs |
| --- | ---: |
| [LUC-950](/LUC/issues/LUC-950) or scoped `listBotRuntimeSessions` entities | 18 |
| [LUC-956](/LUC/issues/LUC-956) | 5 |

- The dirty bundle contains no `apps/*` runtime/product changes.
- The canonical source-of-truth files in scope remain:
  - `docs/modules/api-bots.md`
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/architecture/scanner-overrides.json`
- The generated/readback files do not repeat literal issue IDs in every path,
  but they are directly traceable to [LUC-950](/LUC/issues/LUC-950) because the
  diff updates the documentation relations and the downstream
  architecture-awareness/app-completion/project-truth outputs that the issue
  refreshed.
- [LUC-956](/LUC/issues/LUC-956) is part of the same preserved bundle because
  its task/evidence artifacts and matching project-state/task-board updates are
  the only additional dirty paths beyond the already-classified `LUC-950`
  packet.

### Safety Readback

- `git diff --check` passed with line-ending normalization warnings only; no
  substantive diff errors were reported.
- Source-truth drift validation passed:
  `pnpm run architecture:graph:drift:strict` (`857/857` covered, `0` missing).
- Targeted docs/status readback confirms the next routed Account access docs
  gap is
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionSymbolStats`.
- Added-line redaction scan produced only false-positive terminology hits in
  `docs/graphs/architecture-awareness.csv` for literal architecture/entity text
  such as `api key`, `secret`, and `bearer`; manual inspection confirmed these
  are documentation/index strings with no credential values, token material, or
  env-file disclosure.

## Validation Evidence
- Manual checks:
  - `git status --porcelain=v1 -uall`
  - `git diff --check`
  - explicit per-path scans for [LUC-950](/LUC/issues/LUC-950) and
    [LUC-956](/LUC/issues/LUC-956)
  - added-line redaction scan over the dirty paths
  - targeted `rg` readback over `docs/status`
- High-risk checks:
  - `pnpm run architecture:graph:drift:strict`
  - no push/deploy/protected-account activity
- Reality status:
  - verified

## Result Report
- Task summary:
  - classified the current local bundle as one coherent `LUC-950` plus
    `LUC-956` docs/generated/state packet and proved it is safe to preserve
    with one local source-control closure commit.
- Files changed:
  - `history/tasks/luc-957-source-control-closure-classify-and-close-local-dirty-state-for-luc-950-luc-956-2026-07-13-task.md`
  - `history/evidence/luc-957-source-control-closure-2026-07-13.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - baseline dirty-tree readback, diff check, issue-ref scan, added-line
    redaction scan, targeted docs/status readback, architecture drift audit,
    and local commit preservation
- What is incomplete:
  - no push or deploy decision is claimed here
- Next steps:
  - report the closure evidence and commit SHA back on
    [LUC-957](/LUC/issues/LUC-957)
- Decisions made:
  - local source-control decision is `commit`
  - push status is held because this sidecar does not own
    deployment-triggering actions from `main`
