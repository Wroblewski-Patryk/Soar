# Task

## Header
- ID: LUC-1284
- Title: Classify and close local dirty state for LUC-1280-LUC-1282
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Review
- Depends on: LUC-1282
- Priority: P1
- Module Confidence Rows: Dashboard overview / dashboard backtests router mount
- Requirement Rows: not applicable
- Quality Scenario Rows: maintainability / source-of-truth hygiene
- Risk Rows: local dirty-state closure
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1284-source-control-closure
- Mission Status: VERIFIED

## Context
`LUC-1280` closed the Dashboard overview `USE /backtests` missing-doc-link gap,
and `LUC-1282` classified the resulting local dirty packet as coherent and safe
for one reversible commit. The workspace still remained dirty because that
commit had not yet been created.

## Goal
Classify the combined `LUC-1280` + `LUC-1282` dirty packet and close it with
one local reversible commit, without push or deploy actions.

## Constraints
- no push
- no deploy
- no production mutation
- no secret disclosure
- do not revert unrelated workspace changes

## Definition of Done
- [x] Dirty paths are revalidated against the expected `LUC-1280` + `LUC-1282`
      packet.
- [x] A single local reversible commit closes the workspace dirty state.
- [x] Final commit/push/deploy posture is recorded in repo truth and evidence.

## Validation Evidence
- Tests:
  `git status --short`;
  `git diff --stat`;
  `git diff --numstat`;
  `git diff --check`;
  `git add -- <scoped packet>`;
  `git commit -m "docs: close local dirty state for LUC-1280 and LUC-1282"`;
  `git status --short`.
- Manual checks:
  verified that all dirty paths belonged to the expected docs/history/context
  closure packet before commit, then confirmed a clean worktree after commit.
- High-risk checks:
  no push, deploy, secret, or production actions performed.
- Module confidence ledger updated: no
- Requirements matrix updated: not applicable
- Quality scenarios updated: not applicable
- Risk register updated: not applicable
- Reality status: verified

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert local commit if later review finds packet contamination;
  no remote state was changed
- Observability or alerting impact: none

## Result Report
- Closed packet:
  `docs/modules/api-backtests.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  regenerated `docs/graphs/*`,
  regenerated `docs/status/*`,
  `.agents/state/module-confidence-ledger.md`,
  `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`,
  `history/tasks/luc-1280-dashboard-overview-use-backtests-missing-doc-link-2026-07-15-task.md`,
  `history/evidence/luc-1280-dashboard-overview-use-backtests-missing-doc-link-2026-07-15.md`,
  `history/tasks/luc-1282-source-control-closure-luc-1280-2026-07-15-task.md`,
  `history/evidence/luc-1282-source-control-closure-luc-1280-2026-07-15.md`,
  and this `LUC-1284` closure packet.
- Classification:
  one coherent reversible local docs-and-generated-output packet with no
  unrelated write scope detected in the workspace snapshot used for closure.
- Commit status:
  committed locally in this heartbeat.
- Push status:
  not pushed.
- Deploy impact:
  none.
