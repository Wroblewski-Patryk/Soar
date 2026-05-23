# Task

## Header
- ID: V1-PROD-RESTORE-DRILL-COOLIFY-TERMINAL-2026-05-08
- Title: release: verify production restore drill execution path through Coolify terminal
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `V1-PROTECTED-EVIDENCE-COOLIFY-CONTEXT-2026-05-08`
- Priority: P0
- Iteration: 49
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The latest `main` is deployed to production and public API/Web smoke passes.
The previous protected-context sweep confirmed the production Postgres
container name in Coolify as `x11cfnz1dd9x0yzccftqzcoe`, but the local Docker
daemon cannot reach that remote container. The final blocker execution pack
requires a production restore drill using the existing Docker-based restore
contract, so this task verifies whether the approved Coolify terminal can
provide that execution path without adding a bypass or writing secrets.

## Goal
Determine whether the existing production restore drill can be executed safely
through Coolify terminal access, and either collect valid restore evidence or
record the exact remaining blocker.

## Scope
- Inspect Coolify terminal behavior for the production Postgres resource.
- Do not execute destructive commands beyond the existing isolated restore
  drill contract.
- Do not create new restore mechanisms or substitute evidence.
- Update source-of-truth state with the verified execution path or blocker.

## Implementation Plan
1. Open the production Postgres terminal through the in-app browser.
2. Verify whether the terminal can execute non-secret, read-only commands
   against container `x11cfnz1dd9x0yzccftqzcoe`.
3. If command execution is available, identify the DB name/user without
   printing secrets, then run only the existing restore-drill equivalent
   commands needed to produce PASS evidence.
4. If command execution is not available or cannot produce repository evidence,
   record the blocker and next required access precisely.
5. Run public smoke/preflight as applicable and update state.

## Acceptance Criteria
- The Coolify terminal execution capability is verified by an observable
  non-secret signal, or a precise blocker is recorded.
- No secret values are printed or stored.
- No live-money, exchange, or destructive production action is run.
- V1 is not marked ready unless final restore evidence is actually captured.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for this release/evidence slice.
- [x] The production restore drill path is either executed with evidence or
  blocked with the exact missing capability.
- [x] Source-of-truth docs reflect the current state.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Do not invent a second restore-proof system.
- Do not mark local Docker checks as production restore evidence.
- Do not persist secrets or raw database credentials.
- Do not use destructive DB reset/drop commands outside the isolated restore
  target created by the existing restore-drill contract.
- Do not reuse Coolify credentials as Soar application credentials.

## Validation Evidence
- Tests:
  - `pnpm run ops:release:v1:preflight -- --timeout-seconds 30 --interval-seconds 5` -> expected BLOCKED, with `backup/restore drill evidence: fresh for 2026-05-08`.
  - `pnpm run quality:guardrails` -> PASS.
  - `pnpm run docs:parity:check` -> PASS.
  - `git diff --check` -> PASS with line-ending warnings only.
- Manual checks:
  - Coolify terminal connected to production Postgres container
    `x11cfnz1dd9x0yzccftqzcoe`.
  - Read-only terminal probe returned `SOAR_TERMINAL_OK`, `root`, and
    `psql (PostgreSQL) 18.3`.
  - DB context read without password exposure: `POSTGRES_USER=postgres`,
    `POSTGRES_DB=postgres`.
  - Corrected restore drill created a compressed backup, created isolated
    restore DB `postgres_restore_check_20260508151624`, restored into it,
    validated key table counts, dropped restore DB, removed backup dump, and
    returned `RESULT: PASS`.
  - Cleanup verification returned `0` matching `postgres_restore_check_%`
    databases and no `/tmp/postgres_backup_*.dump` files.
- Screenshots/logs:
  - Evidence artifacts:
    `history/artifacts/_artifacts-restore-drill-prod-coolify-2026-05-08T15-16-24Z.json`
    and `history/evidence/v1-restore-drill-prod-2026-05-08T15-16-24Z.md`.
- High-risk checks:
  - No password, token, connection string, API key, user payload, bot payload,
    order payload, position payload, or log payload was stored.
  - One earlier restore attempt was rejected as evidence because validation SQL
    quoting failed while the first script lacked `set -e`; it was followed by
    cleanup and a corrected `set -eu` run.

## Architecture Evidence
- Architecture source reviewed:
  - `history/plans/v1-final-blocker-execution-pack-2026-05-07.md`
  - `docs/operations/coolify-linux-vps-setup-guide.md`
  - `DEPLOYMENT_GATE.md`
  - `DEFINITION_OF_DONE.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates:

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable unless restore proof is captured.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Restore drill requires production Docker/container access; local
  Docker cannot reach the VPS container.
- Gaps: Need verify whether Coolify terminal can bridge that access safely.
- Inconsistencies: none at task start.
- Architecture constraints: only existing restore-drill contract can satisfy
  release evidence.

### 2. Select One Priority Task
- Selected task: Verify production restore drill execution path through Coolify
  terminal.
- Priority rationale: Restore evidence is one of the remaining final V1
  blockers that may be unblockable with existing Coolify access.
- Why other candidates were deferred: `LIVEIMPORT-03` and rollback proof still
  require Soar app/operator auth, which is not present in this shell.

### 3. Plan Implementation
- Files or surfaces to modify: task and state docs only unless a valid evidence
  artifact is generated.
- Logic: no runtime logic changes planned.
- Edge cases: terminal may use websocket-only execution that is not available
  through HTTP automation; record this honestly.

### 4. Execute Implementation
- Implementation notes:
  - Verified Coolify terminal execution through Playwright because browser
    plugin login could not fill Coolify's email input.
  - Ran the restore drill as an operator terminal action in the production
    Postgres container.
  - Wrote production restore evidence artifacts after the corrected PASS run.

### 5. Verify and Test
- Validation performed:
  - Terminal read-only probe.
  - Production restore drill through Coolify terminal.
  - Cleanup verification.
  - Final V1 preflight.
  - Repository guardrails.
  - Docs parity.
  - Diff whitespace check.
- Result:
  - Restore drill PASS.
  - Preflight now reports backup/restore drill evidence as fresh.
  - Guardrails PASS.
  - Docs parity PASS.
  - Diff check PASS with line-ending warnings only.

### 6. Self-Review
- Simpler option considered: rerun local restore drill, rejected because local
  Docker cannot reach the production container.
- Technical debt introduced: no
- Scalability assessment: Reuses existing release evidence requirements.
- Refinements made:
  - Rejected the first apparent PASS because validation SQL failed; reran with
    `set -eu` and corrected SQL quoting.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `history/artifacts/_artifacts-restore-drill-prod-coolify-2026-05-08T15-16-24Z.json`
  - `history/evidence/v1-restore-drill-prod-2026-05-08T15-16-24Z.md`
  - `history/plans/v1-final-blocker-execution-pack-2026-05-07.md`
  - `docs/planning/mvp-next-commits.md`
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/current-focus.md`
  - `.agents/state/known-issues.md`
  - `.agents/state/system-health.md`
  - `.agents/state/next-steps.md`
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Operation mode was selected according to iteration rotation.
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

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: production DB metadata and operator session
- Trust boundaries: local browser automation, Coolify, VPS Docker, production
  Postgres container
- Permission or ownership checks: Coolify session must be scoped to the Soar
  project/resource.
- Abuse cases: accidental secret printing, destructive DB command, fake
  release evidence.
- Secret handling: no secret values may be persisted.
- Security tests or scans:
  - Artifact content reviewed to exclude secrets and raw protected records.
  - Preflight rerun verifies V1 remains blocked on unrelated protected inputs.
- Fail-closed behavior:
  - Invalid quoting attempt was not accepted as release evidence.
- Residual risk:
  - Restore evidence is complete, but V1 remains blocked on live-import
    readback auth, rollback proof auth, and RC Gate 4 approval.

## Result Report

- Task summary:
  - Verified Coolify terminal access to the production Postgres container and
    completed the isolated backup/restore drill with cleanup.
- Files changed:
  - `history/evidence/v1-prod-restore-drill-coolify-terminal-task-2026-05-08.md`
  - `history/artifacts/_artifacts-restore-drill-prod-coolify-2026-05-08T15-16-24Z.json`
  - `history/evidence/v1-restore-drill-prod-2026-05-08T15-16-24Z.md`
  - source-of-truth state docs listed above.
- How tested:
  - Coolify terminal probe.
  - Production restore drill PASS.
  - Cleanup verification PASS.
  - Final V1 preflight expected BLOCKED with restore evidence fresh.
  - Repository guardrails PASS.
  - Docs parity PASS.
- What is incomplete:
  - `LIVEIMPORT-03`, rollback proof, and RC Gate 4 approval remain incomplete.
- Next steps:
  - Continue with protected app/operator auth for live-import readback or
    rollback proof, or collect real RC approver identities.
- Decisions made:
  - Do not accept the first apparent PASS because validation SQL failed.
