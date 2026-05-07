# Task

## Header
- ID: V1-PROD-PROMOTE-HELPER-2026-05-07
- Title: Add repeatable production promote workflow helper
- Task Type: release
- Current Stage: implementation
- Status: DONE
- Owner: Ops/Release
- Depends on: V1-PROD-PROMOTE-GITHUB-BILLING-BLOCKER-2026-05-07
- Priority: P0
- Iteration: 2026-05-07 production promote tooling
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this small tooling slice.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The approved production deploy path is the GitHub Actions `Promote PROD`
workflow. The local shell does not have `gh`, but Git Credential Manager can
provide a GitHub API token without printing it. Manual PowerShell snippets were
used to dispatch and diagnose the workflow; this task turns that safe path into
a reusable repository script.

## Goal
Provide one repeatable, secret-safe command to dispatch and inspect the
official production promote workflow from a local operator environment.

## Scope
- `scripts/promoteProdWorkflow.mjs`
- `package.json`
- `docs/planning/v1-prod-promote-helper-task-2026-05-07.md`

## Implementation Plan
1. Add a Node script that can dry-run, dispatch `promote-prod.yml`, poll the
   latest run, fetch the first job, and fetch check-run annotations.
2. Resolve auth from `GITHUB_TOKEN`, `GH_TOKEN`, or `git credential fill`
   without printing token values.
3. Expose it as `pnpm run ops:prod:promote`.
4. Validate syntax, help, dry-run, and the current billing-lock failure mode.

## Acceptance Criteria
- `pnpm run ops:prod:promote -- --help` prints usage.
- `pnpm run ops:prod:promote -- --dry-run --dispatch --ref main` performs no
  GitHub mutation.
- A dispatch run reports GitHub run/job/annotation status without secrets.
- The helper does not bypass the approved workflow or call Coolify directly.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` intent satisfied for an ops tooling slice.
- [x] Existing production workflow remains the only deploy entrypoint.
- [x] No secret value is printed or stored.
- [x] Relevant validations are run.

## Forbidden
- Direct Coolify webhook calls from the local helper.
- Printing GitHub tokens or credential helper output.
- Marking V1 ready from workflow dispatch alone.
- Running live-money or destructive production actions.

## Validation Evidence
- Tests:
  - `node --check scripts/promoteProdWorkflow.mjs` PASS.
  - `pnpm run ops:prod:promote -- --help` PASS.
  - `pnpm run ops:prod:promote -- --dry-run --dispatch --ref main` PASS and
    performed no GitHub mutation.
  - `pnpm run ops:prod:promote -- --ref main --wait-seconds 5` returned the
    latest run/job/annotation and exited non-zero because the latest workflow
    run is failed. The wrapper observed this as expected current blocker
    evidence.
- Manual checks:
  - Helper uses only GitHub workflow dispatch/status APIs.
- Screenshots/logs: not applicable.
- High-risk checks:
  - Token value is scoped to request execution and is never logged.

## Architecture Evidence
- Architecture source reviewed:
  - `.github/workflows/promote-prod.yml`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence
- Deploy impact: low when run with `--dispatch`; no direct deploy behavior in
  the script itself.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: rollback remains owned by `promote-prod.yml`.
- Observability or alerting impact: workflow annotations become easier to read
  from local continuation.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production promote is blocked by GitHub Actions billing lock.
- Gaps: dispatch/status was only available through one-off PowerShell snippets
  in this shell.
- Inconsistencies: no reusable command existed for future continuations without
  `gh`.
- Architecture constraints: helper must reuse `promote-prod.yml`, not bypass
  Coolify or rollback guard.

### 2. Select One Priority Task
- Selected task: add production promote workflow helper.
- Priority rationale: it makes the next V1 deploy attempt repeatable once
  billing is restored.
- Why other candidates were deferred: actual deploy and protected V1 evidence
  remain blocked until GitHub Actions can start jobs.

### 3. Plan Implementation
- Files or surfaces to modify: one script, `package.json`, one task document.
- Logic: REST dispatch, run polling, job/annotation readback.
- Edge cases: missing token, failed workflow, no run yet, dry-run.

### 4. Execute Implementation
- Implementation notes: added `scripts/promoteProdWorkflow.mjs` and
  `ops:prod:promote`.

### 5. Verify and Test
- Validation performed: syntax check, help, dry-run, and status-only GitHub
  workflow readback.
- Result: PASS for helper behavior; current promote status remains failed due
  to GitHub Actions billing lock.

### 6. Self-Review
- Simpler option considered: continue using ad hoc PowerShell.
- Technical debt introduced: no.
- Scalability assessment: improves operator repeatability without changing
  deploy ownership.
- Refinements made: supports dry-run and token-free output.

### 7. Update Documentation and Knowledge
- Docs updated: this task document.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to continuation scope.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
Added `scripts/promoteProdWorkflow.mjs` and exposed it as
`pnpm run ops:prod:promote`. The helper can dry-run, dispatch the official
`promote-prod.yml` workflow, read the latest run/job, and surface check-run
annotations without printing GitHub tokens. Current status-only validation
reports the known GitHub Actions billing lock.
