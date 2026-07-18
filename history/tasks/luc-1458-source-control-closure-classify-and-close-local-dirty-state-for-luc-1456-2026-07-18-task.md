# LUC-1458 Source-Control Closure For LUC-1456

## Context

- ID: `LUC-1458`
- Title: `Classify and close local dirty state for LUC-1456`
- Task Type: `source_control_closure`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `Soar Product Manager`
- Priority: `P1`
- Mission ID: `LUC-1458-SOURCE-CONTROL-CLOSURE-LUC-1456-2026-07-18`
- Mission Status: `VERIFIED`

`LUC-1456` completed a scoped docs-link repair and left a local dirty packet
containing the validated docs-link inputs, generated graph/status refresh
output, state/context updates, and three `LUC-1456` history artifacts. The
residual handoff text in that packet incorrectly pointed to `LUC-1457` even
though the actual assigned source-control closure sidecar is `LUC-1458`.

## Goal

Classify the local dirty set for `LUC-1456`, correct the stale sidecar
references, and close the coherent packet with one local commit if no unrelated
ownership appears in the worktree.

## Constraints

- preserve the validated `LUC-1456` bundle as-is unless a closure-only
  correction is required
- no runtime/product code changes
- no push, deploy, restart, rollback, env edit, migration, or secret handling
- no revert/reset/clean or staging of unrelated work

## Definition of Done

- [x] The dirty worktree is classified into `current`, `stale`, and
      `out-of-scope` buckets.
- [x] The stale `LUC-1457` residual references are corrected to `LUC-1458`.
- [x] A `LUC-1458` task/evidence/closeout packet records the closure decision.
- [x] One local commit closes the coherent `LUC-1456` docs/state/history
      bundle.
- [x] Verification records the clean post-commit worktree and the inherited
      `LUC-1456` validation boundary.

## Forbidden

- runtime/product code edits
- push, deploy, or production mutation
- unrelated cleanup or history rewriting
- secret disclosure or broad redaction scans outside the dirty scope

## Plan

1. Re-run the local dirty-state baseline and classify every path against
   `LUC-1456`.
2. Correct the stale sidecar references to the actual assigned issue
   `LUC-1458`.
3. Record the closure task/evidence/closeout packet.
4. Run focused closure verification and commit the coherent bundle locally.

## Result Report

- Classification:
  `current` = `LUC-1456` docs-link inputs, generated `docs/graphs/*` and
  `docs/status/*`, `.agents/state/active-mission.md`,
  `.agents/state/next-steps.md`, `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`, and the `LUC-1456` history artifacts;
  `stale` = none;
  `out-of-scope` = none.
- Updated files:
  `.agents/state/active-mission.md`,
  `.agents/state/next-steps.md`,
  `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`,
  `history/tasks/luc-1456-account-access-use-dashboard-missing-doc-link-2026-07-18-task.md`,
  `history/evidence/luc-1456-account-access-use-dashboard-missing-doc-link-2026-07-18.md`,
  `history/artifacts/luc-1456-paperclip-closeout-2026-07-18.md`,
  `history/tasks/luc-1458-source-control-closure-classify-and-close-local-dirty-state-for-luc-1456-2026-07-18-task.md`,
  `history/evidence/luc-1458-source-control-closure-luc-1456-2026-07-18.md`,
  `history/artifacts/luc-1458-paperclip-closeout-2026-07-18.md`.
- Validation:
  inherited `LUC-1456` generator/readback proof retained;
  `git diff --check` warnings only for LF->CRLF normalization;
  targeted `rg` over `LUC-1456|LUC-1458|LUC-1457` in touched files PASS;
  `git status --short` clean after commit.
- Source-control closure:
  one local commit created for the coherent bundle; no push; deploy impact
  `none`.
