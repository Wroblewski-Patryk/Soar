# LUC-1405 `use-profile-security` Stale Missing-Doc-Link Reconciliation

## Context

- ID: `LUC-1405`
- Title: `[Soar][Project Truth][App Completion] Reconcile stale missing-doc-link signal for use-profile-security`
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `Soar Product Manager`
- Priority: `P1`
- Mission ID: `LUC-1405-USE-PROFILE-SECURITY-STALE-MISSING-DOC-LINK-2026-07-18`
- Mission Status: `VERIFIED`

`LUC-1396` already closed the scoped Account access `missing_doc_link` lane for
`apps/api/src/router/dashboard.routes.ts#/profile/security`, but `LUC-1405`
was reopened to reconcile a stale signal that still appeared in operator flow.
This lane verifies the current Soar source of truth rather than changing
runtime behavior or redoing the prior documentation repair.

## Goal

Prove whether `use-profile-security` is still emitted as `missing_doc_link` in
the canonical app-completion/project-truth outputs, and record the smallest
durable reconciliation packet for Paperclip closeout.

## Constraints

- no runtime code changes
- no new documentation system or duplicate docs
- no generator bypasses or manual fake closure
- no deploy, push, restart, protected smoke, or secret handling

## Definition of Done

- [x] Current readback proves whether `USE /profile/security` still appears as
      `missing_doc_link`.
- [x] Prior closure evidence from `LUC-1396` is cross-checked against current
      canonical state files.
- [x] A durable task/evidence/state packet explains the stale-signal outcome
      and the no-code-change decision.

## Forbidden

- runtime or architecture changes outside the stale-signal verification scope
- reopening the prior repair without current evidence
- status-only closure without repository evidence

## Plan

1. Read the existing `LUC-1396` closeout packet and current state ledgers.
2. Read the generated `app-completion` and `project-truth` outputs for the
   exact `use-profile-security` endpoint.
3. Record a reconciliation packet showing whether the signal is stale or live.

## Result Report

- Updated files:
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  `history/tasks/luc-1405-use-profile-security-stale-missing-doc-link-reconciliation-2026-07-18-task.md`,
  `history/evidence/luc-1405-use-profile-security-stale-missing-doc-link-reconciliation-2026-07-18.md`,
  `history/artifacts/luc-1405-paperclip-closeout-2026-07-18.md`.
- Validation:
  `rg -n "LUC-1405|use-profile-security|USE /profile/security" .codex/context/PROJECT_STATE.md .codex/context/TASK_BOARD.md .agents/state/module-confidence-ledger.md docs/status/app-completion-index.md docs/status/project-truth-index.md docs/architecture/relations/documentation-links.csv docs/architecture/scanner-overrides.json history/tasks history/evidence -S` -> PASS;
  Node JSON readback of `docs/status/app-completion-index.json` for
  `use-profile-security` -> PASS with no matching `missing_doc_link` row;
  Node JSON readback of `docs/status/project-truth-index.json` for
  `use-profile-security` -> PASS with no matching `missing_doc_link` row;
  `Get-Content history/evidence/luc-1396-account-access-use-profile-security-missing-doc-link-2026-07-17.md -TotalCount 160` -> PASS;
  `git status --short` -> PASS with clean worktree before edits.
- Readback:
  `docs/status/app-completion-index.{md,json}` and
  `docs/status/project-truth-index.{md,json}` do not currently emit
  `USE /profile/security` as `missing_doc_link`.
  `docs/architecture/relations/documentation-links.csv` still contains the
  direct row
  `apps/api/src/router/dashboard.routes.ts#/profile/security,docs/modules/api-profile.md`.
  `.agents/state/module-confidence-ledger.md`, `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`, and the prior `LUC-1396` evidence all
  agree that the scoped gap was already closed on `2026-07-17`.
- Outcome:
  `LUC-1405` closes as a stale-signal reconciliation lane only. The current
  source of truth already reflects the `LUC-1396` repair, so no code,
  documentation, generator, or graph rebuild work was required in this
  heartbeat.
- Naming note:
  this issue reuses identifier `LUC-1405`, which already exists in older June
  history files for a different topic. The July 18, 2026 reconciliation packet
  therefore uses the longer `use-profile-security-stale-missing-doc-link`
  filename suffix to avoid collisions.
