## Context

- Issue: `LUC-1400`
- Stage: `verification`
- Project: `Soar`
- Source-control closure sidecar for the local dirty packet tied to
  `LUC-1393`, `LUC-1396`, and `LUC-1397`.
- The observed dirty set is limited to docs, generated status/index outputs,
  history evidence, and project state/context files produced by the three
  linked issue lanes.

## Goal

Classify the current local dirty state, run bounded local validation and
redaction checks, and either commit the coherent docs/state/evidence packet or
record the exact no-commit blocker.

## Constraints

- Do not push or deploy.
- Do not modify product code or foreign repositories.
- Keep redaction checks bounded to authored/untracked paths and high-confidence
  credential signatures only.
- Do not revert or separate linked dirty files that belong to the same closure
  packet.

## Definition of Done

- Dirty paths are classified as current, stale, or out-of-scope.
- The smallest meaningful validation for the packet is recorded.
- A commit/no-commit decision is made with evidence.
- `LUC-1400` receives a Paperclip closeout with commit, verification, and
  residual-risk details.

## Forbidden

- Push.
- Deploy.
- Secret disclosure.
- Broad repo validation unrelated to the closure packet.

## Implementation Plan

1. Inspect the bounded git diff and map each dirty group back to
   `LUC-1393`, `LUC-1396`, and `LUC-1397`.
2. Record the classification and closure decision in local history evidence.
3. Run bounded redaction and diff-integrity checks.
4. Commit the coherent docs/state/evidence packet if validation holds.
5. Update `LUC-1400` with the final source-control closure evidence.

## Acceptance Criteria

- The local dirty packet is fully attributable.
- The commit decision follows the sidecar rules in the issue description.
- The final Paperclip disposition leaves no ambiguous local dirty-state owner
  for this packet.

## Result Report

- Pending during task execution.
