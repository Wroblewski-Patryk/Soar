# V1 Final Preflight Command Task (2026-05-08)

## Header
- ID: V1-FINAL-PREFLIGHT-COMMAND-2026-05-08
- Title: Add one-command V1 final evidence preflight
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: V1-RELEASE-STATE-SHA-HANDOFF-2026-05-08
- Priority: P0
- Iteration: 41
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The remaining V1 blockers require protected production auth, production
DB/Coolify access, and real Gate 4 approver inputs. Individual scripts fail
closed correctly, but there is no single operator-safe command that summarizes
deploy freshness, missing prerequisite env names, and current evidence status.

## Goal
Add a read-only `ops:release:v1:preflight` command that helps an operator know
exactly what is ready and what is missing before running protected final V1
evidence collection.

## Scope
- `scripts/runV1FinalPreflight.mjs`
- `package.json`
- `history/plans/v1-final-blocker-execution-pack-2026-05-07.md`
- state/context/planning docs
- this task artifact

## Success Signal
- User or operator problem: operator can run one command and see deploy
  freshness plus missing auth/DB/approval prerequisites.
- Expected product or reliability outcome: less chance of partial or fake V1
  evidence.
- How success will be observed: command exits non-zero while protected inputs
  are missing and writes no protected evidence artifact.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement the preflight command, document it, and validate fail-closed behavior.

## Constraints
- Do not read or print secret values.
- Do not create `LIVEIMPORT-03`, restore, rollback, or approval evidence.
- Do not add a new deploy system or bypass final gate checks.
- Reuse existing release-gate evidence classifier and build-info wait command.

## Implementation Plan
1. Add a Node preflight script that checks current `HEAD`, optional build-info
   freshness, required env-name presence, and release-gate evidence readiness.
2. Expose it as `pnpm run ops:release:v1:preflight`.
3. Document it in the final blocker execution pack and state files.
4. Validate syntax, fail-closed no-auth behavior, guardrails, docs parity,
   public smoke, and diff check.

## Acceptance Criteria
- Missing auth/DB/approval env names are reported by name only.
- Current evidence blockers are reported using the existing release-gate
  classifier.
- The command exits `1` when V1 prerequisites are incomplete.
- The command exits without creating protected production evidence artifacts.

## Definition of Done
- [x] Preflight command implemented and documented.
- [x] No secret values are printed.
- [x] Missing local prerequisites fail closed.
- [x] Validation passes.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Fake production evidence.
- New auth paths or secret persistence.
- Downgrading protected readback to public health/build-info.
- Running live-money, exchange-write, destructive DB, or rollback actions.

## Validation Evidence
- Tests:
  - `node --check scripts/runV1FinalPreflight.mjs` => PASS
- Manual checks:
  - `pnpm run ops:release:v1:preflight -- --help` => PASS
  - `pnpm run ops:release:v1:preflight -- --timeout-seconds 30 --interval-seconds 5` => expected exit `1`, build-info PASS, missing protected env names reported, no `liveimport-03` artifact created
  - `pnpm run quality:guardrails` => PASS
  - `pnpm run docs:parity:check` => PASS
  - `git diff --check` => PASS
  - `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` => PASS
- Screenshots/logs: command output shows `BLOCKED` with missing prerequisite
  names and current evidence blockers.
- High-risk checks: no secret values printed, no protected evidence artifact
  created, no DB/Coolify, exchange, live-money, rollback, or destructive action
  executed.

## Architecture Evidence
- Architecture source reviewed: final blocker execution pack, release gate,
  deployment contract.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this preflight script/docs commit if needed.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: remaining V1 blockers are protected and can only be closed with
  operator access.
- Gaps: no one-command preflight summarizes deploy freshness, env-name
  readiness, and evidence blockers.
- Inconsistencies: individual fail-closed scripts are correct but scattered.
- Architecture constraints: final evidence must still run through approved
  collectors and release gate.

### 2. Select One Priority Task
- Selected task: add final V1 preflight command.
- Priority rationale: improves the handoff to the only remaining executable
  production-evidence path.
- Why other candidates were deferred: real evidence collection needs protected
  auth/access not present in this shell.

### 3. Plan Implementation
- Files or surfaces to modify: ops script, package script, final blocker pack,
  state/context/planning docs.
- Logic: read env names, run build-info wait, call release-gate evidence
  classifier, print concise summary, fail closed if incomplete.
- Edge cases: no secrets printed; no protected artifacts written.

### 4. Execute Implementation
- Implementation notes: added `scripts/runV1FinalPreflight.mjs`, exposed it as
  `ops:release:v1:preflight`, and documented it as step 0 in the final blocker
  pack.

### 5. Verify and Test
- Validation performed: syntax, help, no-auth fail-closed preflight,
  guardrails, docs parity, diff check, and public deploy smoke.
- Result: PASS; preflight intentionally exits `1` while protected inputs and
  evidence are missing.

### 6. Self-Review
- Simpler option considered: leave instructions only in docs; rejected because
  the user asked for continued V1 progress and operator handoff needs a
  runnable check.
- Technical debt introduced: no
- Scalability assessment: composes existing gates instead of replacing them.
- Refinements made: preflight reports optional private OPS layer env names
  separately from required auth/DB prerequisites.

### 7. Update Documentation and Knowledge
- Docs updated: final blocker pack, state files, context files, planning queue,
  and this task artifact.
- Context updated: yes
- Learning journal updated: not applicable

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

## Result Report
- Task summary: added a read-only final V1 preflight command for deploy,
  prerequisite, and evidence readiness.
- Files changed: `scripts/runV1FinalPreflight.mjs`, `package.json`, final
  blocker pack, state/context/planning docs, and this task artifact.
- How tested: syntax, help, fail-closed no-auth run, guardrails, docs parity,
  diff check, and public deploy smoke.
- What is incomplete: real protected V1 evidence still requires operator auth,
  production DB/Coolify access, and real Gate 4 approver inputs.
- Next steps: operator runs `ops:release:v1:preflight`, provides missing
  prerequisites, then collects `LIVEIMPORT-03`, restore, rollback, RC approval,
  and final non-dry-run release gate.
- Decisions made: preflight is intentionally non-artifact-producing and cannot
  replace final V1 release evidence.
