# LUC-1672 Confirm Coolify Team/Workspace

## Header

- ID: LUC-1672
- Title: [Operator][Coolify] Confirm expected Coolify team/workspace
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P1
- Module Confidence Rows: operations / Coolify production deploy confidence
- Requirement Rows: production deploy confidence / Coolify selector proof
- Quality Scenario Rows: release/deploy gate
- Risk Rows: wrong Coolify team/workspace selector
- Iteration: 2026-06-03 Ops heartbeat
- Operation Mode: BUILDER
- Mission ID: Soar production deploy confidence
- Mission Status: VERIFIED

## Context

The issue asked for the expected Coolify team/workspace selector so Paperclip
does not inspect or mutate the wrong Coolify project. This is an Ops-only,
read-only verification slice.

## Goal

Confirm the active Coolify selector and prove that the configured Soar project
and production environment resolve under that selector.

## Scope

- Read-only Coolify API selector verification.
- Read-only configured project and production environment readback.
- Repository source-of-truth evidence update.
- No production mutation.

## Implementation Plan

1. Read issue heartbeat context and Ops role safety contract.
2. Check names-only runtime binding presence without printing secret values.
3. Call Coolify read-only endpoints for current team, visible teams, project,
   and production environment.
4. Record redacted evidence and update operational source-of-truth files.
5. Close the Paperclip issue with verified evidence.

## Acceptance Criteria

- Current selector is identified by id and name.
- Configured project resolves to `Soar`.
- Production environment resolves to `production`.
- Secret values are not printed or stored.
- No deploy, restart, rollback, env edit, database action, team setting change,
  account action, live-trading action, or secret readback is performed.

## Definition of Done

- [x] Read-only selector verification completed.
- [x] Redacted evidence file created.
- [x] Coolify deployment contract and runtime ledger updated.
- [x] Project state and task board updated.
- [x] Paperclip issue updated to `done`.

## Validation Evidence

- `GET /api/issues/LUC-1672/heartbeat-context` -> pass; issue read back as
  `in_progress`, priority `high`, zero first-class blockers.
- Names-only env binding check -> pass without printing values.
- `GET /api/v1/teams/current` -> pass at `2026-06-03T05:34:32Z`, id `0`,
  name `LuckySparrow`.
- `GET /api/v1/teams` -> pass, two visible teams.
- `GET /api/v1/projects/{configured-project-id}` -> pass, project `Soar`.
- `GET /api/v1/projects/{configured-project-id}/production` -> pass,
  environment `production`, id `6`, six application rows.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed: `docs/operations/coolify-vps-deployment-contract.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none; explicit team-id bindings remain absent but
  non-blocking while current-team and project-scoped reads succeed.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable; no mutation performed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Result Report

- Task summary: confirmed Coolify selector id `0`, name `LuckySparrow`, with
  project `Soar` and production environment `production` id `6` resolving under
  that selector.
- Files changed:
  - `history/evidence/luc-1672-coolify-team-workspace-confirmation-2026-06-03.md`
  - `history/tasks/luc-1672-confirm-coolify-team-workspace-2026-06-03-task.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
  - `docs/operations/runtime-config-ledger.csv`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: read-only Coolify API calls listed above.
- What is incomplete: application readiness, protected smoke coverage, SLO
  status, and deploy mutation readiness were outside this issue.
- Next steps: resource inventory reconciliation may proceed against the
  verified selector.
*** Update File: docs/operations/coolify-vps-deployment-contract.md
@@
-Latest team/workspace selector checkpoint: `LUC-1665` at
-`2026-06-03T05:03:35Z`. Authenticated read-only Coolify API calls confirmed
+Latest team/workspace selector checkpoint: `LUC-1672` at
+`2026-06-03T05:34:32Z`. Authenticated read-only Coolify API calls confirmed
 the expected current selector id `0`, name `LuckySparrow`. Under this selector,
 the configured Soar project resolves to project `Soar`, production environment
 `production` id `6`, and the canonical eight-resource production environment
 inventory: six applications, one PostgreSQL resource, and one Redis resource.
@@
 secret readback, or live-trading action. Evidence:
+`history/evidence/luc-1672-coolify-team-workspace-confirmation-2026-06-03.md`.
+
+Previous team/workspace selector checkpoint: `LUC-1665` at
+`2026-06-03T05:03:35Z`. Authenticated read-only Coolify API calls confirmed
+the expected current selector id `0`, name `LuckySparrow`. Under this selector,
+the configured Soar project resolves to project `Soar`, production environment
+`production` id `6`, and the canonical eight-resource production environment
+inventory: six applications, one PostgreSQL resource, and one Redis resource.
+`GET /api/v1/teams` returned two visible teams. `COOLIFY_SOAR_TEAM_ID` and
+`COOLIFY_TEAM_ID` remain absent in this runner, but the selector is recorded as
+non-secret config truth and not an active blocker while current-team and
+project-scoped reads succeed. This heartbeat performed no deploy, restart,
+rollback, env edit, database action, team setting change, account action,
+secret readback, or live-trading action. Evidence:
 `history/evidence/luc-1665-coolify-team-workspace-confirmation-2026-06-03.md`.
*** Update File: docs/operations/runtime-config-ledger.csv
@@
-coolify,production,Coolify team/workspace selector,no,yes,Ops Release Lead,docs/operations/coolify-vps-deployment-contract.md,GET /api/v1/teams/current plus project readback,2026-06-03,LUC-1665 reconfirmed expected selector id 0 name LuckySparrow at 2026-06-03T05:03:35Z; COOLIFY_SOAR_TEAM_ID/COOLIFY_TEAM_ID absent but exact selector is recorded as non-secret config.
+coolify,production,Coolify team/workspace selector,no,yes,Ops Release Lead,docs/operations/coolify-vps-deployment-contract.md,GET /api/v1/teams/current plus project readback,2026-06-03,LUC-1672 reconfirmed expected selector id 0 name LuckySparrow at 2026-06-03T05:34:32Z; COOLIFY_SOAR_TEAM_ID/COOLIFY_TEAM_ID absent but exact selector is recorded as non-secret config.
*** Update File: .codex/context/PROJECT_STATE.md
@@
+- 2026-06-03 `LUC-1672` Operator Coolify team/workspace selector confirmation is verified and done. Read-only Coolify API readback at `2026-06-03T05:34:32Z` confirmed current selector id `0`, name `LuckySparrow`; configured project resolves to `Soar`, and production environment resolves to `production` id `6` with six application rows. `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` remain absent in this runner, but the exact expected selector is recorded as non-secret config truth and not an active blocker while current-team and project-scoped reads succeed. Paperclip heartbeat context showed `in_progress` with zero first-class blockers. No deploy, restart, rollback, env edit, database action, team setting change, account action, live trading action, or secret readback was performed. Evidence: `history/evidence/luc-1672-coolify-team-workspace-confirmation-2026-06-03.md`, `history/tasks/luc-1672-confirm-coolify-team-workspace-2026-06-03-task.md`.
+
 - 2026-06-03 `LUC-1668` Operator Coolify team/workspace selector confirmation is verified and done. Read-only Coolify API readback at `2026-06-03T05:08:45Z` confirmed current selector id `0`, name `LuckySparrow`; configured project resolves to `Soar`, and production environment resolves to `production` id `6` with six application rows. `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` remain absent in this runner, but the exact expected selector is recorded as non-secret config truth and not an active blocker while current-team and project-scoped reads succeed. Paperclip heartbeat context showed `in_progress` with zero first-class blockers. No deploy, restart, rollback, env edit, database action, team setting change, account action, live trading action, or secret readback was performed. Evidence: `history/evidence/luc-1668-coolify-team-workspace-confirmation-2026-06-03.md`, `history/tasks/luc-1668-confirm-coolify-team-workspace-2026-06-03-task.md`.
*** Update File: .codex/context/TASK_BOARD.md
@@
+## 2026-06-03 LUC-1672 [Operator][Coolify] Confirm expected Coolify team/workspace
+- Status: done.
+- Scope:
+  - verified expected Coolify team/workspace selector through fresh read-only API;
+  - confirmed configured project `Soar` and environment `production` resolve under selector `0` / `LuckySparrow`;
+  - recorded optional team-id bindings as absent but non-blocking while current-team and project-scoped reads succeed.
+- Evidence:
+  - `GET /api/issues/LUC-1672/heartbeat-context` -> pass; issue read back as `LUC-1672`, status `in_progress`, priority `high`, zero first-class blockers;
+  - names-only Coolify env binding check -> pass without printing values;
+  - `GET /api/v1/teams/current` -> pass at `2026-06-03T05:34:32Z`, id `0`, name `LuckySparrow`;
+  - `GET /api/v1/teams` -> pass, two teams visible;
+  - `GET /api/v1/projects/{configured-project-id}` -> pass, project `Soar`;
+  - `GET /api/v1/projects/{configured-project-id}/production` -> pass, environment `production`, id `6`, six application rows.
+- Deployment impact: none; no deploy, restart, rollback, env change, database action, team setting change, account mutation, live-trading mutation, or secret readback.
+- Artifacts:
+  - `history/evidence/luc-1672-coolify-team-workspace-confirmation-2026-06-03.md`
+  - `history/tasks/luc-1672-confirm-coolify-team-workspace-2026-06-03-task.md`
+
 ## 2026-06-03 LUC-1668 [Operator][Coolify] Confirm expected Coolify team/workspace
 - Status: done.
 - Scope:
