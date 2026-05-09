# V1-RESTORE-DRILL-DATE-OVERRIDE-2026-05-09

## Header
- ID: V1-RESTORE-DRILL-DATE-OVERRIDE-2026-05-09
- Title: Add explicit evidence date support to restore drill generator
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: V1-ROLLBACK-PROOF-DATE-OVERRIDE-2026-05-09
- Priority: P1
- Iteration: 2026-05-09
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the continuation slice.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Final preflight still reports backup/restore drill evidence as stale for
2026-05-09. The restore drill evidence wrapper used the current UTC timestamp
for artifact names, so it should support the same explicit release evidence
date used by RC and rollback proof tooling.

## Goal
Add `--today <yyyy-mm-dd>` to the restore drill evidence wrapper so an
operator can create correctly dated restore drill artifacts once production
DB/Coolify context is available.

## Scope
- `scripts/runRestoreDrillEvidence.mjs`
- `docs/planning/v1-restore-drill-date-override-task-2026-05-09.md`
- source-of-truth state and learning docs

## Success Signal
- User or operator problem: restore drill evidence can target the active
  release date instead of UTC day.
- Expected product or reliability outcome: future restore drill artifacts
  classify correctly in final preflight.
- How success will be observed: `--help` documents `--today`, and generated
  artifact names use the supplied date.
- Post-launch learning needed: yes

## Deliverable For This Stage
Tooling support and documentation only. No production restore drill artifact is
claimed in this task.

## Constraints
- do not fabricate restore drill evidence
- do not run production DB/Coolify operations without approved context
- do not record secrets
- do not push this commit individually

## Implementation Plan
1. Add `--today` parsing to `scripts/runRestoreDrillEvidence.mjs`.
2. Use the explicit date for restore drill artifact filename stamps.
3. Verify help and syntax.
4. Document that actual production restore drill remains blocked until
   DB/Coolify context is available.

## Acceptance Criteria
- [x] `runRestoreDrillEvidence.mjs --help` shows `--today`.
- [x] Script syntax check passes.
- [x] No restore drill artifact is committed from this tooling-only task.
- [x] Source-of-truth docs continue to list production restore drill as
  open/blocked.

## Definition of Done
- [x] Tooling change is implemented.
- [x] Validation commands pass.
- [x] Task and state docs are updated.
- [x] No production evidence is misrepresented.

## Validation Evidence
- Tests:
  - `node --check scripts/runRestoreDrillEvidence.mjs`
  - `node scripts/runRestoreDrillEvidence.mjs --help`
  - `node scripts/repoGuardrails.mjs`
  - `node scripts/checkDocsParity.mjs`
  - `git diff --check`
- Manual checks:
  - production restore drill was not run because production DB/Coolify context
    is required
- High-risk checks:
  - no live-money, exchange, rollback, or production DB action

## Architecture Evidence
- Architecture source reviewed:
  - `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`
  - `docs/operations/deployment-rollback-playbook.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: backup/restore drill remains stale and requires production DB/Coolify
  context.
- Gaps: current shell does not have approved restore-drill execution context.
- Architecture constraints: local or empty output cannot be accepted as
  production restore proof.

### 2. Select One Priority Task
- Selected task: add restore drill date override.
- Priority rationale: smallest safe improvement that prepares the blocked
  operator command for correct evidence classification.
- Why other candidates were deferred: actual restore drill requires production
  DB/Coolify access.

### 3. Plan Implementation
- Files or surfaces to modify: restore drill evidence wrapper and docs.
- Logic: parse `--today` and use it for artifact filename stamps.
- Edge cases: invalid/missing date falls back to current timestamp.

### 4. Execute Implementation
- Implementation notes: added `evidenceStamp` helper and help text.

### 5. Verify and Test
- Validation performed: syntax/help, guardrails, docs parity, diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: manually rename generated restore drill files.
- Technical debt introduced: no
- Scalability assessment: date override matches RC and rollback evidence
  tooling.
- Refinements made: documented that no production restore artifact was
  accepted.

### 7. Update Documentation and Knowledge
- Docs updated: task, state docs, learning journal.
- Context updated: yes
- Learning journal updated: yes.

## Result Report
- Task summary: added explicit evidence-date support to restore drill artifact
  generation.
- Files changed: restore drill script, task/state docs, learning journal.
- How tested: syntax/help and repository docs checks.
- What is incomplete: actual restore drill still requires production
  DB/Coolify context.
- Next steps: run restore drill with `--today 2026-05-09` once approved
  production DB/Coolify access is available.
