# LUC-1800 Source-Control Closure: Classify and Close Local Dirty State for LUC-1787-LUC-1796

## Header
- ID: LUC-1800
- Title: [Soar][Source Control Closure] Classify and close local dirty state for LUC-1787-LUC-1796
- Task Type: coordination
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Priority: high
- Mission ID: LUC-1800-SOURCE-CONTROL-CLOSE-LUC-1787-LUC-1796-2026-07-23
- Mission Status: VERIFIED

## Context
[LUC-1800](/LUC/issues/LUC-1800) is the local source-control closure sidecar
for the current Soar v1 sale-readiness truth packet after
[LUC-1796](/LUC/issues/LUC-1796) produced its new exact-candidate QA rerun
task/evidence artifacts and [LUC-1787](/LUC/issues/LUC-1787) synced the parent
contract/gap/state wording. This heartbeat stayed inside the local closure
lane: inspect the current worktree, classify the packet, verify it is safe to
preserve locally, and make the commit decision without treating owner
acceptance or release deployment gates as cleared.

## Goal
Classify the current dirty worktree for the linked `LUC-1787` and `LUC-1796`
bundle, prove whether a local source-control closure commit is safe, and leave
a durable closure packet for board handoff.

## Scope
- `git status --short --branch`
- `git diff --check`
- Dirty-path category classification
- Explicit issue/proof attribution across the scoped dirty paths
- Added-line redaction review for the scoped diff
- Repo-side source-of-truth updates for this closure packet
- One scoped local commit for the docs/state/evidence-only packet

## Implementation Plan
1. Capture the baseline dirty tree before mutating any `LUC-1800` artifact.
2. Group the dirty paths into state/context, planning truth, history, runtime,
   and out-of-scope buckets.
3. Verify the dirty paths are attributable only to `LUC-1787` and `LUC-1796`.
4. Re-run the smallest meaningful closure checks for this packet.
5. Persist the closure packet and preserve the coherent bundle with one local
   source-control closure commit.

## Acceptance Criteria
- [x] Baseline dirty-tree counts are recorded.
- [x] The linked issue bundle is explicitly attributable in the dirty tree.
- [x] Runtime/product-code risk is classified rather than assumed away.
- [x] Focused closure verification is recorded.
- [x] Secret-risk readback is recorded without exposing sensitive values.
- [x] A durable repo-side evidence packet exists for
      [LUC-1800](/LUC/issues/LUC-1800).
- [x] The local source-control decision is explicit and justified.
- [x] One scoped local commit preserves the packet.

## Constraints
- Stay inside local source-control closure scope.
- Do not push, deploy, restart, rollback, or mutate credentials/accounts.
- Do not treat owner-acceptance or release-governance gates as cleared.
- Do not over-claim the closure commit as product or release acceptance.

## Definition of Done
- [x] Dirty-path classification is durable in repo artifacts.
- [x] Focused validation for the docs/state/evidence bundle is recorded.
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

- Baseline captured before this `LUC-1800` artifact mutation: `8` dirty paths.
- Category counts:

| Category | Count |
| --- | ---: |
| State/context | 4 |
| Docs/planning truth | 1 |
| History evidence/tasks | 3 |
| Runtime/product code | 0 |
| Stale/out-of-scope | 0 |

### Linked Issue Attribution

| Issue | Dirty paths with direct ownership |
| --- | ---: |
| [LUC-1787](/LUC/issues/LUC-1787) | 6 |
| [LUC-1796](/LUC/issues/LUC-1796) | 7 |

- The overlap is expected because the parent sale-readiness truth files now
  cite the new `LUC-1796` rerun evidence while preserving `LUC-1787` ownership.
- The dirty bundle contains no `apps/*`, `packages/*`, config, env, lockfile,
  dependency, or runtime script changes.

### Safety Readback

- `git diff --check` passed with line-ending normalization warnings only; no
  substantive diff errors were reported.
- Dirty-path readback confirms the packet is limited to:
  - new `LUC-1796` QA task/evidence artifacts
  - `LUC-1787` contract and gap-register closure wording
  - `.agents` and `.codex` state/context sync for the same exact-candidate
    `SRG-002` decision
- Added-line redaction review over the scoped diff found no secret-shaped
  values, cookies, authorization headers, or raw credential material.

## Validation Evidence
- Manual checks:
  - `git status --short --branch`
  - `git diff --check`
  - scoped issue/proof readback over the eight dirty paths
  - added-line redaction review over the scoped diff
- High-risk checks:
  - no push/deploy/protected-account activity
- Reality status:
  - verified

## Result Report
- Task summary:
  - classified the current local sale-readiness dirty set as one coherent
    `LUC-1787` plus `LUC-1796` docs/state/evidence packet and proved it is safe
    to preserve with one local source-control closure commit.
- Files changed:
  - `history/tasks/luc-1800-source-control-closure-classify-and-close-local-dirty-state-for-luc-1787-luc-1796-2026-07-23-task.md`
  - `history/evidence/luc-1800-source-control-closure-2026-07-23.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - baseline dirty-tree readback, diff check, scoped issue attribution, and
    added-line redaction review
- What is incomplete:
  - no push or deploy decision is claimed here
- Next steps:
  - report the closure evidence and commit SHA back on
    [LUC-1800](/LUC/issues/LUC-1800)
- Decisions made:
  - local source-control decision is `commit`
  - push status is held because this sidecar does not own deploy-triggering
    actions from `main`
